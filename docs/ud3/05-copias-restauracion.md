# 5. Copias de seguridad y restauración

Hacer copias de seguridad es una tarea fundamental del DBA. En PostgreSQL es fácil automatizarla con un script que se ejecute cada cierto tiempo.

Hay dos tipos de copia:

| Tipo | Qué guarda | Herramientas |
|---|---|---|
| **Lógica** | Sentencias SQL (`CREATE`, `INSERT`, `COPY`...) que reconstruyen los objetos y los datos. | `pg_dump`, `pg_dumpall` |
| **Física** | Los ficheros del servidor, copiados con un procedimiento adecuado. | Copia de ficheros, `pg_basebackup` |

!!! note "Recuperación a un momento concreto (PITR)"

    PostgreSQL puede recuperar el sistema a un instante determinado si guarda los cambios en los ficheros **WAL** (*Write Ahead Log*). Es un tema avanzado que no se trata en este curso.

Esta página se centra en las **copias lógicas**.

---

## `pg_dump` o `pg_dumpall`

| | `pg_dump` | `pg_dumpall` |
|---|---|---|
| **Qué copia** | Una sola base de datos. | Todas las bases de datos del clúster y los objetos globales (roles y tablespaces). |
| **Copia parcial** | Sí: solo estructura, solo datos, un esquema o ciertas tablas. | Solo los objetos globales o solo la estructura. |
| **Formato de salida** | Texto SQL o formatos comprimidos. | Solo texto SQL. |
| **Quién lo ejecuta** | El propietario de la base de datos o un usuario con acceso a todo lo que se copia. | `postgres`, para tener acceso a todo. |

!!! note "Clúster"

    Un **clúster** es el conjunto de bases de datos que gestiona una misma instancia del servidor y que comparten los mismos roles. Las copias lógicas no incluyen los ficheros de configuración ni los WAL.

---

## Copia de seguridad con `pg_dump`

`pg_dump` se ejecuta desde la terminal, como cualquier cliente del servidor. Genera un fichero con las instrucciones necesarias para reconstruir la base de datos tal como estaba al hacer la copia.

!!! success "Características principales"

    - **No bloquea a los usuarios**: se puede ejecutar con la base de datos en uso y la copia es una instantánea coherente.
    - **Copia parcial**: permite guardar solo la estructura, solo los datos, un esquema o determinadas tablas.
    - **Varios formatos**: texto plano SQL o formatos comprimidos (`custom`, `directory`, `tar`) que se restauran con `pg_restore`.
    - **Portable**: el fichero se puede restaurar en otro servidor o en otra versión de PostgreSQL.

!!! quote "Sintaxis básica"

    ```bash
    pg_dump [ -h host ] [ -p puerto ] [ -U usuario ] [ -a | -s ] [ -F formato ] [ -n esquema ] [ -t tabla ] [ -f fichero ] nombre_bd
    ```

    Si no se indica `-f`, el resultado se muestra por pantalla; por eso se suele redirigir con `> fichero.sql`.

    | Opción | Función |
    |---|---|
    | `-a` | Guarda solo los datos. |
    | `-s` | Guarda solo la estructura. |
    | `--inserts` | Usa sentencias `INSERT` para los datos (por defecto usa `COPY`). |
    | `--column-inserts` | Como `--inserts`, pero incluye los nombres de las columnas. |
    | `-f fichero` | Guarda el resultado en el fichero indicado. |
    | `-F formato` | Formato de salida: `p` (texto, por defecto), `c` (*custom*), `d` (*directory*) o `t` (*tar*). |
    | `-n esquema` | Copia solo el esquema indicado. |
    | `-t tabla` | Copia solo la tabla indicada. |
    | `-h`, `-p`, `-U`, `-W` | Conexión: host, puerto, usuario y petición de contraseña. |
    | `--help` | Muestra todas las opciones. |

??? example "Ejemplo: copias con pg_dump"

    En todos los casos el resultado se guarda en `geo.sql`. Cada comando sobrescribe el fichero si ya existe.

    ```bash
    # Copiar la base de datos geo con el usuario geo
    pg_dump -U geo geo > geo.sql

    # Copiar solo la estructura
    pg_dump -s -U geo geo > geo.sql

    # Copiar solo los datos, con sentencias INSERT
    pg_dump -a --inserts -U geo geo > geo.sql

    # Copiar solo la estructura de las tablas comarques e instituts
    pg_dump -s -t comarques -t instituts -U geo geo > geo.sql

    # Copiar en formato comprimido (se restaura con pg_restore)
    pg_dump -Fc -U geo -f geo.backup geo
    ```

---

## Copia de seguridad con `pg_dumpall`

`pg_dumpall` copia **todas las bases de datos** del clúster y los **objetos globales** (roles y tablespaces). Se ejecuta como `postgres`.

!!! quote "Sintaxis básica"

    ```bash
    pg_dumpall [ -h host ] [ -p puerto ] [ -U usuario ] [ -g | -r | -s ] [ -f fichero ]
    ```

    | Opción | Función |
    |---|---|
    | `-g` o `--globals-only` | Copia solo los objetos globales (roles y tablespaces). |
    | `-r` o `--roles-only` | Copia solo los roles. |
    | `-s` o `--schema-only` | Copia solo la estructura, sin los datos. |
    | `-f fichero` | Guarda el resultado en el fichero indicado. |

    No necesita nombre de base de datos, porque copia todo el clúster. Si no se indica `-f`, el resultado sale por pantalla.

!!! warning "Inconvenientes"

    - Puede pedir la contraseña de `postgres` una vez por cada base de datos.
    - Cada base de datos se copia por separado: cada copia es coherente, pero no hay una instantánea simultánea de todo el clúster.
    - Los ficheros con roles contienen los *hashes* de las contraseñas: protégelos.


??? example "Ejemplo: copias con pg_dumpall"

    ```bash
    # Todas las bases de datos y los objetos globales
    pg_dumpall -U postgres > cluster.sql

    # Solo los objetos globales (roles y tablespaces)
    pg_dumpall -U postgres --globals-only > globales.sql

    # Solo los roles
    pg_dumpall -U postgres --roles-only > roles.sql

    # Solo la estructura de todas las bases de datos
    pg_dumpall -U postgres --schema-only > estructura_cluster.sql
    ```

    Cada comando sobrescribe el fichero de destino si ya existe. Para ver todas las opciones: `pg_dumpall --help`.

---

## Restaurar copias de seguridad

El comando depende del formato de la copia:

| Formato de la copia | Herramienta |
|---|---|
| Texto SQL (sin `-F`, o `-Fp`) | `psql` |
| Comprimido (`-Fc`, `-Fd`, `-Ft`) | `pg_restore` |

### Restaurar un fichero de texto

Si la copia es un fichero SQL, se restaura con `psql`. Hay tres formas:

!!! quote "Sintaxis básica"

    | Forma | Comando |
    |---|---|
    |(1) Desde la terminal (redirección < ) | `psql [ -U usuario ] nombre_bd < fichero.sql` |
    |(2) Desde la terminal (opción `-f`) | `psql [ -U usuario ] -f fichero.sql nombre_bd` |
    |(3) Desde dentro de `psql` | `\i fichero.sql` |

!!! important "Antes de restaurar"

    Deben existir la **base de datos de destino** y los **roles** que aparecen como propietarios en la copia.

??? example "Ejemplo: restaurar geo.sql en una base de datos nueva"

    Conectado a `postgres` como superusuario, crea la base de datos de destino:

    ```sql
    CREATE DATABASE geo_nueva OWNER geo;
    ```

    Después, desde la terminal, restaura el fichero:

    ```bash
    psql -U geo -d geo_nueva -f geo.sql
    ```

### Restaurar un formato comprimido

Si se usó la opción `-F` con `c`, `d` o `t`, la restauración se hace con `pg_restore`.

!!! quote "Sintaxis básica"

    ```bash
    pg_restore [ -h host ] [ -p puerto ] [ -U usuario ] [ -a | -s ] [ -t tabla ] [ -F formato ] -d nombre_bd fichero
    ```

    | Opción | Función |
    |---|---|
    | `-d nombre_bd` | Restaura directamente en la base de datos indicada (debe existir). |
    | `-a` | Restaura solo los datos. |
    | `-s` | Restaura solo la estructura. |
    | `-t tabla` | Restaura solo la tabla indicada. |
    | `-F formato` | Formato del fichero (normalmente se detecta solo). |
    | `-h`, `-p`, `-U`, `-W` | Conexión: host, puerto, usuario y petición de contraseña. |

??? example "Ejemplo: restaurar con pg_restore"

    La copia se creó con `pg_dump -Fc -U geo -f geo.backup geo` y la base de datos de destino ya existe:

    ```bash
    pg_restore -U geo -d geo_nueva geo.backup
    ```

## Transferir datos entre bases de datos

Se puede enlazar `pg_dump` con `psql` para copiar una base de datos en otra sin crear ningún fichero:

!!! quote "Sintaxis básica"

    | Destino | Comando |
    |---|---|
    | Mismo servidor | `pg_dump [ -U usuario ] bd_origen \| psql [ -U usuario ] bd_destino` |
    | Otro servidor | `pg_dump [ -U usuario ] bd_origen \| psql -h host [ -U usuario ] bd_destino` |

La base de datos de destino debe existir antes de ejecutar el comando.

??? example "Ejemplo: copiar geo en geo_copia"

    ```bash
    # Crear la base de datos de destino (como postgres)
    createdb -U postgres -O geo geo_copia

    # Copiar geo en geo_copia sin crear ningún fichero
    pg_dump -U geo geo | psql -U geo geo_copia

    # Copiar solo la estructura
    pg_dump -s -U geo geo | psql -U geo geo_copia

    # Copiar a una base de datos de otro servidor
    pg_dump -U geo geo | psql -h 192.168.1.20 -U geo geo_copia
    ```

## Actividades relacionadas

- [Actividad 15: Copia de seguridad y restauración de la estructura](00-actividades.md#actividad-15-copia-de-seguridad-y-restauracion-de-la-estructura).
- [Actividad 16: Transferencia de datos entre bases de datos](00-actividades.md#actividad-16-transferencia-de-datos-entre-bases-de-datos).
- [Actividad 17: Copia de una base de datos desde la línea de comandos](00-actividades.md#actividad-17-copia-de-una-base-de-datos-desde-la-linea-de-comandos).
