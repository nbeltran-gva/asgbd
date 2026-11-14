# Anexo: servidor PostgreSQL con Docker

En este anexo prepararás un servidor PostgreSQL para realizar prácticas en tu ordenador sin instalar el servidor directamente. Docker ejecuta PostgreSQL en un **contenedor** y Docker Compose permite definir su configuración en un archivo.

El ejemplo está pensado para un entorno local de aprendizaje, no para producción. Se inspira en la guía [Servidor PostgreSQL con Docker](https://asalvadorc.github.io/PostgreSQL/entorno_postgresql/).

## 1. Requisitos

Instala y arranca [Docker Desktop](https://docs.docker.com/desktop/) en Windows o macOS. En Windows, utiliza contenedores Linux y sigue las indicaciones del instalador para configurar WSL 2. En Linux, instala [Docker Engine y el complemento Compose](https://docs.docker.com/engine/install/) siguiendo las instrucciones de tu distribución.

En una terminal, comprueba que Docker y Compose están disponibles:

```bash
docker version
docker compose version
```

El primer comando debe mostrar información de **Client** y **Server**. Si no puede conectar con el servidor, comprueba que Docker Desktop o el servicio Docker esté iniciado.

## 2. Despliegue de PostgreSQL con Docker Compose


1. Crea una carpeta de trabajo denominada `asgbd-postgres-ud3`.
2. Accede a dicha carpeta:

```bash
mkdir asgbd-postgres-ud3
cd asgbd-postgres-ud3
```
3. Descarga el archivo [`compose.yaml`](src/compose.yaml) en la carpeta `asgbd-postgres-ud3` que has creado. También puedes abrirlo y copiar su contenido en un archivo con ese nombre:

??? exemple "Entender el archivo Compose"

    ```yaml
    services:
      postgres:
        image: postgres:17
        container_name: asgbd-postgres

        environment:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: postgres

        ports:
          - "127.0.0.1:5433:5432"

        volumes:
          - datos_postgresql:/var/lib/postgresql/data
          - ./scripts:/scripts
          - ./backups:/backups
          - datos_tablespaces:/tablespaces

    volumes:
      datos_postgresql:
      datos_tablespaces:
    ```

    | Configuración | Función |
    |---|---|
    | `postgres:17` | Utiliza la versión 17 de la imagen oficial de PostgreSQL, compatible con los ejemplos de membresías de la UD3. |
    | `POSTGRES_USER` | Define el usuario administrador inicial, `postgres`. |
    | `POSTGRES_PASSWORD` | Establece `postgres` como contraseña inicial del administrador. |
    | `POSTGRES_DB` | Indica la base de datos inicial, `postgres`. |
    | `127.0.0.1:5433:5432` | Publica el puerto 5432 del contenedor como puerto 5433, accesible solo desde el propio ordenador. |
    | `datos_postgresql` | Guarda los datos en un volumen para conservarlos aunque se elimine el contenedor. |
    | `./scripts:/scripts` | Comparte la carpeta `scripts` del ordenador con `/scripts` dentro del contenedor. Así puedes reutilizar los archivos SQL sin copiarlos cada vez. |
    | `./backups:/backups` | Comparte la carpeta `backups` del ordenador con `/backups` dentro del contenedor para guardar y recuperar copias. |
    | `datos_tablespaces` | Volumen persistente separado para los tablespaces de las actividades 7 y 8. Sus archivos se guardan en Docker, no en una carpeta visible del proyecto. |

Encontrarás más información en la documentación de la [imagen oficial de PostgreSQL](https://hub.docker.com/_/postgres).

## 3. Arrancar y comprobar el servidor

Abre una terminal en la carpeta que contiene `compose.yaml` y ejecuta:


```bash
# Inicia los servicios definidos en compose.yaml.
docker compose up -d

# Comprueba que el servicio postgres está activo.
docker compose ps

# Consulta los registros del servidor PostgreSQL.
docker compose logs postgres
```

El primer comando crea y arranca el servicio en segundo plano. En los registros, comprueba que PostgreSQL indica que está preparado para aceptar conexiones. La primera descarga de la imagen puede tardar unos minutos.

## 4. Conectarse y realizar una prueba

Desde la carpeta del proyecto, ejecuta el comando:

```bash
# Accede al cliente psql dentro del contenedor.
docker compose exec postgres psql -U postgres -d postgres
```
Veamos por partes:

- `docker compose exec` ejecuta un comando dentro de un servicio definido en `compose.yaml`.
- `postgres` es el nombre del servicio definido dentro de `services:`
- `psql -U postgres -d postgres` inicia el cliente  PostgreSQL conectado a la base de datos `postgres`.

A continuación, comprueba la versión del servidor y el usuario y la base de datos de la sesión:

```sql
SELECT version();
SELECT current_user, current_database();
```

También es conveniente realizar una comprobación listando las bases de datos y los roles disponibles, y finalmente salir de `psql` con estos metacomandos:

```text
\l
\du
\q
```
## 5. Conectarse desde clientes PostgreSQL

Para conectarte desde un **cliente instalado en el mismo ordenador**, utiliza estos datos:

| Parámetro | Valor |
|---|---|
| Servidor o *host* | `localhost` |
| Puerto | `5433` |
| Base de datos | `postgres` |
| Usuario | `postgres` |
| Contraseña | La indicada en `POSTGRES_PASSWORD` al inicializar el volumen |

!!! note "Puertos del contenedor y del ordenador"

    El servidor PostgreSQL escucha en el puerto `5432` dentro del contenedor.
    La configuración del puerto `127.0.0.1:5433:5432` en compose.yaml hace que se publique ese puerto como `5433` en el ordenador, así que los clientes instalados allí se conectan a través de `localhost:5433`. Desde otro contenedor de la misma red Compose, la conexión se hace al servidor `postgres:5432`. El prefijo `127.0.0.1` limita el acceso publicado al propio ordenador.

    Si otro programa ya está usando el puerto `5433` del ordenador, cambia el puerto de la izquierda, por ejemplo a `"127.0.0.1:5434:5432"`, y aplica el cambio con `docker compose up -d`. Después, conecta los clientes del ordenador a `localhost:5434`. Los ejemplos de pgAdmin y DBeaver de los apartados siguientes suponen que están instalados en el mismo ordenador que Docker.

### Conectarse con `psql` desde el ordenador

1. Instala las herramientas de línea de comandos de PostgreSQL en el ordenador. Puedes descargarlas desde la [página oficial de PostgreSQL](https://www.postgresql.org/download/). 
2. Comprueba con `docker compose ps` que el contenedor está en marcha.
3. Abre una terminal y conecta con el puerto publicado:

```bash
psql -h localhost -p 5433 -U postgres -d postgres
```

### Conexión con pgAdmin

1. Instala [pgAdmin 4](https://www.pgadmin.org/download/) para tu sistema operativo y ábrelo. 
2. Comprueba antes con `docker compose ps` que el contenedor está en marcha.
3. Abre pgAdmin:
    1. En el navegador de pgAdmin, haz clic derecho en **Servers** y selecciona **Register → Server**.
    2. En la pestaña **General**, escribe un nombre para identificar la conexión, por ejemplo `PostgreSQL Docker`. Esto no crea una base de datos, ni cambia el servidor.
    3. En **Connection**, introduce:

        | Campo | Valor |
        |---|---|
        | **Host name/address** | `localhost` |
        | **Port** | `5433` |
        | **Maintenance database** | `postgres` |
        | **Username** | `postgres` |
        | **Password** | La contraseña definida al inicializar el volumen |

    4. Pulsa **Save** y despliega el servidor y **Databases**.
    5. Selecciona la base `postgres` y abre **Tools → Query Tool**. Ejecuta:

        ```sql
        SELECT current_database(), current_user;
        ```
        El resultado debe mostrar `postgres` como base de datos y como usuario.

Para seguir practicando con esta herramienta, consulta [Administración gráfica con pgAdmin](06-pgadmin.md).

### Conexión con DBeaver

1. Descarga e instala [DBeaver Community](https://dbeaver.io/download/) y abre la aplicación. 
2. Comprueba que el contenedor está en marcha antes de crear la conexión.
3. Abre DBeaver:
    1. Selecciona **Nueva conexión** y elige **PostgreSQL**.
    2. Introduce los datos de conexión:

        | Campo | Valor |
        |---|---|
        | **Host** | `localhost` |
        | **Puerto** | `5433` |
        | **Base de datos** | `postgres` |
        | **Usuario** | `postgres` |
        | **Contraseña** | La contraseña definida al inicializar el volumen |
            
    3. Activa **Show all databases** (Mostrar todas las bases de datos).
    4. Pulsa **Probar conexión**. Si DBeaver solicita descargar el controlador de PostgreSQL, acepta la descarga y vuelve a probar la conexión. Después, guarda con **Finalizar**. El nombre de la conexión es solo una etiqueta; la base de datos de destino se indica en el campo **Base de datos**.
    5. En el **Navegador de bases de datos**, haz clic derecho sobre la conexión y selecciona **Editor SQL → Nuevo script SQL**. Ejecuta:

        ```sql
        SELECT current_database(), current_user;
        ```

        El resultado debe mostrar `postgres` como base de datos y como usuario.

Para una explicación adicional, consulta la [guía de conexión con DBeaver](https://asalvadorc.github.io/PostgreSQL/2_client_dbeaver_installaci_i_confiuraci/). Los nombres de las opciones pueden variar según la versión y el idioma del cliente.

!!! tip "Si la conexión falla"

    Comprueba que el contenedor está iniciado con `docker compose ps`, que utilizas el puerto publicado en `compose.yaml` y que la contraseña coincide con la usada al inicializar el volumen. Revisa los detalles del error y, si es necesario, los registros con `docker compose logs postgres`.

## 7. Detener y reanudar

Desde la misma carpeta:

```bash
# Detener el servicio sin eliminar sus datos
docker compose stop

# Volver a ponerlo en marcha
docker compose up -d

# Eliminar el contenedor y la red, pero conservar el volumen
docker compose down
```

!!! danger "No eliminar el volumen por accidente"

    `docker compose down -v` elimina también los volúmenes del proyecto y, con ellos, las bases de datos almacenadas. No lo uses si necesitas conservar las prácticas. Un volumen persistente tampoco sustituye a una [copia de seguridad](05-copias-restauracion.md).


## 8. Uso con la UD3

### ⚠️ Bases de datos y roles iniciales

El servidor recién creado contiene **solo** la base administrativa `postgres`, pero **no incluye**:

- La base de datos `geo` (si la utilizas en las prácticas)
- Sus tablas y objetos
- Los roles de práctica definidos en los requisitos iniciales

Para seguir los [ejemplos guiados](07-ejemplos_guiados.md), importa `dades_geo.sql` con los pasos anteriores o crea la base de datos y los objetos manualmente. El montaje de `scripts` comparte archivos, pero no los ejecuta automáticamente al arrancar PostgreSQL.

### 🔧 Herramientas de línea de comandos

Los comandos `psql`, `createdb`, `pg_dump` y `pg_restore` pueden ejecutarse de dos formas:

1. **Desde el ordenador**, si tienes instaladas las herramientas cliente: ejecútalos directamente y conecta con `-h localhost -p 5433`.

```bash
# Acceder como usu1 desde el ordenador (el rol debe existir y poder conectarse a geo)
psql -h localhost -p 5433 -U usu1 -d geo
```
2. **Dentro del contenedor**: antepón `docker compose exec postgres` al comando. Usa las rutas internas del contenedor, por ejemplo `/scripts/dades_geo.sql` o `/backups/geo.backup`, no las rutas del ordenador.

```bash
# Acceder a la base 'geo' como postgres (usuario administrador)
docker compose exec postgres psql -U postgres -d geo

# Ejecutar un comando sin abrir sesión interactiva
docker compose exec postgres psql -U postgres -d postgres -c "SELECT version();"
```

Para comandos que participan en una tubería (`|`), como `pg_dump ... | psql ...`, añade `-T` a `docker compose exec` en ambos lados para que Compose no asigne una terminal:

```bash
docker compose exec -T postgres pg_dump -U postgres -d geo | docker compose exec -T postgres psql -U postgres -d geo_nueva
```

### Importar `dades_geo.sql`

Guarda el archivo [`dades_geo.sql`](../ud2/src/dades_geo.sql) en la carpeta `scripts`, junto a `compose.yaml`. Si aún no existe, crea esa carpeta. Compose la monta en `/scripts` dentro del contenedor. Desde la carpeta del proyecto, inicia o actualiza el servicio:

```bash
docker compose up -d
```

Importa el archivo conectado inicialmente a `postgres`; el script crea el rol y la base de datos `geo`:

```bash
docker compose exec -T postgres psql -U postgres -d postgres -f /scripts/dades_geo.sql
```

Comprueba que se han cargado las tablas:

```bash
docker compose exec postgres psql -U postgres -d geo -c "\dt"
```

Importa el archivo una sola vez por volumen. Si lo repites, PostgreSQL avisará de que algunos objetos ya existen. `docker compose down -v` elimina las bases de datos guardadas en el volumen.

### Dónde guardar las copias

La carpeta `backups` debe estar junto a `compose.yaml`. Créala antes de usarla:

```bash
mkdir backups
```

Al ejecutar las herramientas dentro del servicio, utiliza rutas del contenedor bajo `/backups`.

### Actividades con tablespaces en Docker

El volumen `datos_tablespaces` guarda los tablespaces en `/tablespaces`. Antes de empezar, abre una shell como administrador del contenedor y prepara las carpetas:

```bash
docker compose exec -u root postgres sh
```

Dentro del contenedor, ejecuta:

```sh
mkdir -p /tablespaces/prueba /tablespaces/temporal
chown -R postgres:postgres /tablespaces
chmod 700 /tablespaces
exit
```

En la actividad 7, usa `/tablespaces/prueba` y `/tablespaces/temporal` como rutas. Después, asigna el tablespace `prueba` a `geo2` en la actividad 8. `docker compose down -v` elimina también el volumen y los tablespaces.



