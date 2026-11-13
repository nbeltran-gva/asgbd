# 5. Copias de seguridad y restauración

La realización de copias de seguridad es una tarea fundamental del DBA. En PostgreSQL es sencilla de automatizar mediante un script que se ejecute periódicamente.

Existen dos enfoques principales para realizar una **copia de seguridad**:

- una copia lógica mediante el programa `pg_dump` y `pg_dumpall`;
- una copia física de los ficheros del servidor, siguiendo un procedimiento adecuado.

También existe la posibilidad de realizar una **recuperación a un momento concreto** (**PITR**, *Point in Time Recovery*). 

Para recuperar el sistema a un momento determinado, PostgreSQL debe guardar todos los cambios realizados en unos ficheros denominados **WAL** (*Write Ahead Log*), que contienen información sobre las transacciones. _Este tipo de recuperación es avanzado y no se tratará en este curso._

---

## Copia de seguridad con `pg_dump`

`pg_dump` es la utilidad de PostgreSQL para realizar copias de seguridad **lógicas** de una base de datos. 

!!! note "Copia lógica y copia física"

    Una copia lógica contiene sentencias (`CREATE`, `INSERT`, `COPY`...) que reconstruyen los objetos y los datos. Es distinta de la copia física, que consiste en copiar directamente los ficheros del servidor.


Se ejecuta desde la línea de comandos como cliente del servidor y genera un fichero con las instrucciones necesarias para reconstruir la base de datos tal como se encontraba en el momento de realizar la copia.

**Sus principales características son:**

- **Copia consistente**: se puede ejecutar con la base de datos en funcionamiento, sin bloquear a los usuarios que leen o escriben, ya que la copia refleja una instantánea coherente de los datos.
- **Copia de una sola base de datos**: guarda una base de datos cada vez; para copiar todo el clúster se utiliza `pg_dumpall`.
- **Copia parcial**: permite guardar solo la estructura, solo los datos, un esquema concreto o determinadas tablas.
- **Distintos formatos de salida**: texto plano con sentencias SQL, o formatos comprimidos (`custom`, `directory`, `tar`) que se restauran con `pg_restore`.
- **Portabilidad**: el fichero generado puede restaurarse en otro servidor o incluso en otra versión de PostgreSQL.

La herramienta `pg_dump` suele encontrarse en la ruta:

```text
/usr/lib/postgresql/16/bin
```

**Opciones principales**

| Opción | Función |
|---|---|
| `-a` | Guarda únicamente los datos. |
| `-s` | Guarda únicamente la estructura. |
| `--inserts` | Utiliza sentencias `INSERT` para los datos; si no se indica, puede utilizar `COPY`. |
| `--column-inserts` | Incluye los nombres de las columnas en las sentencias `INSERT`. |
| `-f fichero` | Envía el resultado al fichero indicado. |
| `-F formato` | Indica el formato de salida: `c` (*custom*), `d` (*directory*), `t` (*tar*) o `p` (*plain text*). |
| `-n nombre_esquema` | Copia únicamente el esquema indicado. |
| `-t nombre_tabla` | Copia únicamente la tabla indicada. |
| `--help` o `-?` | Muestra la ayuda con todas las opciones. |

También están disponibles las opciones habituales de conexión:

- `-h`: host;
- `-p`: puerto;
- `-U`: usuario;
- `-W`: solicita la contraseña.

??? example "Ejemplo: Copia de seguridad con pg_dump"

    A continuación se muestran algunos ejemplos de uso de `pg_dump`. En todos ellos el resultado se guarda en el fichero `geo.sql`. Cada comando sobrescribe `geo.sql` si el fichero ya existe.

    ```bash
    # Copiar la base de datos geo con el usuario geo
    pg_dump -U geo geo > geo.sql

    # Copiar únicamente la estructura de la base de datos geo
    pg_dump -s -U geo geo > geo.sql

    # Copiar únicamente los datos utilizando sentencias INSERT
    pg_dump -a --inserts -U geo geo > geo.sql

    # Copiar únicamente la estructura de las tablas comarques e instituts
    pg_dump -s -t comarques -t instituts -U geo geo > geo.sql
    ```


## Copia de seguridad con `pg_dumpall`

`pg_dumpall` realiza una copia de seguridad de todas las bases de datos del sistema. Se debe ejecutar como `postgres` para disponer de acceso a todas las bases de datos.

!!! note "Aclaración sobre el clúster"

    En PostgreSQL, un **clúster** es el conjunto de bases de datos gestionado por una misma instancia del servidor, que comparte los mismos roles. `pg_dumpall` genera una copia lógica de las bases de datos y de los objetos globales, mientras que `pg_dump` copia una única base de datos. No incluye los ficheros de configuración ni los archivos WAL.

Además de las bases de datos, guarda objetos globales que no pertenecen a una base de datos concreta, como los usuarios y los grupos.

Una **desventaja** es que puede solicitar la contraseña del usuario `postgres` tantas veces como bases de datos haya en el sistema.

Para consultar todas las opciones:

```bash
pg_dumpall --help
```
??? example "Ejemplo: Ejecuta estos comandos desde la terminal con un usuario autorizado,..."

    Ejecuta estos comandos desde la terminal con un usuario autorizado, como `postgres`:

    ```bash
    # Copiar todas las bases de datos y los objetos globales del clúster
    pg_dumpall -U postgres > cluster.sql

    # Copiar únicamente los objetos globales, como roles y tablespaces
    pg_dumpall -U postgres --globals-only > globales.sql

    # Copiar únicamente los roles del clúster
    pg_dumpall -U postgres --roles-only > roles.sql

    # Copiar la estructura de todas las bases de datos, sin sus datos
    pg_dumpall -U postgres --schema-only > estructura_cluster.sql
    ```

    Cada comando sobrescribe el fichero de destino si ya existe. Los ficheros que incluyen roles pueden contener información sensible, como los hashes de sus contraseñas; protégelos adecuadamente.

    `pg_dumpall` copia cada base de datos por separado: cada copia es consistente, pero no se garantiza una instantánea simultánea de todo el clúster.


!!! note "no es lo mismo"

    - pg_dump copia una base de datos cada vez. Permite copiar toda la base de datos o solo ciertos esquemas, tablas, estructura o datos.
    - pg_dumpall copia todas las bases de datos del clúster y los objetos globales, como roles y tablespaces. También permite copiar solo estos objetos globales.
    Por ejemplo:

    Además, pg_dump admite varios formatos de salida; pg_dumpall genera un script SQL de texto.

---

## Restaurar copias seguridad

### 1. Restaurar un fichero de texto

Si no se ha utilizado la opción `-F`, el fichero de salida contiene sentencias SQL. En ese caso, se puede restaurar con `psql`.

Desde fuera de `psql` existen dos formas equivalentes:

```bash
psql nombre_bd < fichero.sql
```

```bash
psql -f fichero.sql nombre_bd
```

Desde dentro de `psql` también se puede utilizar el comando `\i`:

```text
\i fichero.sql
```

Para que la restauración funcione, deben existir la base de datos de destino y los roles que figuran como propietarios en la copia. Por ejemplo, conectado a `postgres` como superusuario, crea `geo_nueva` para restaurar `geo.sql`:

```sql
-- Ejecutar conectado a la base de datos postgres como superusuario
CREATE DATABASE geo_nueva OWNER geo;
```

Después, desde la terminal, restaura el fichero:

```bash
psql -U geo -d geo_nueva -f geo.sql
```

### 2. Restaurar formatos no textuales

Si se ha utilizado la opción `-F`, la restauración se realiza mediante `pg_restore`.

Las principales opciones de `pg_restore` son:

| Opción | Función |
|---|---|
| `-a` | Restaura únicamente los datos. |
| `-s` | Restaura únicamente la estructura. |
| `-d nombre_bd` | Se conecta a la base de datos indicada y restaura directamente en ella. |
| `-F formato` | Indica el formato del fichero de entrada. |
| `-t nombre_tabla` | Restaura únicamente la tabla indicada. |

También se pueden utilizar las opciones de conexión `-h`, `-p`, `-U` y `-W`.

??? example "Ejemplo: Restaurar una copia con pg_restore"

    Este formato requiere una copia creada, por ejemplo, con `pg_dump -Fc -U geo -f geo.backup geo`. La base de datos de destino debe existir previamente:

    ```bash
    pg_restore -U geo -d geo_nueva geo.backup
    ```


### 3. Transferir información entre bases de datos

Se puede combinar `pg_dump` con `psql` para transferir la información de una base de datos a otra:

```bash
pg_dump bd1 | psql bd2
```

También se puede transferir la información a una base de datos situada en otro servidor:

```bash
pg_dump bd1 | psql -h host bd2
```

## Actividades relacionadas

- [Actividad 15: Copia de seguridad y restauración de la estructura](00-actividades.md#actividad-15-copia-de-seguridad-y-restauracion-de-la-estructura).
- [Actividad 16: Transferencia de datos entre bases de datos](00-actividades.md#actividad-16-transferencia-de-datos-entre-bases-de-datos).
- [Actividad 17: Copia de una base de datos desde la línea de comandos](00-actividades.md#actividad-17-copia-de-una-base-de-datos-desde-la-linea-de-comandos).
