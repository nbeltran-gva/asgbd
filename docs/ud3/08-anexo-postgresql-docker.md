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


1. Crea una carpeta de trabajo denominada `postgres-ud3`.
2. Accede a dicha carpeta:

```bash
mkdir postgres-ud3
cd postgres-ud3
```
3. Crea un archivo llamado `compose.yaml` con el siguiente contenido:


```yaml
services:
  postgres:
    image: postgres:17
    container_name: asgbd-postgres

    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: "Cambiar_Clave_Practica"
      POSTGRES_DB: postgres

    ports:
      - "127.0.0.1:5433:5432"

    volumes:
      - datos_postgresql:/var/lib/postgresql/data

volumes:
  datos_postgresql:
```

| Configuración | Función |
|---|---|
| `postgres:17` | Utiliza la versión 17 de la imagen oficial de PostgreSQL, compatible con los ejemplos de membresías de la UD3. |
| `POSTGRES_USER` | Define el usuario administrador inicial, `postgres`. |
| `POSTGRES_PASSWORD` | Establece la contraseña inicial del administrador. Sustitúyela por una propia. |
| `POSTGRES_DB` | Indica la base de datos inicial, `postgres`. |
| `127.0.0.1:5433:5432` | Publica el puerto 5432 del contenedor como puerto 5433, accesible solo desde el propio ordenador. |
| `datos_postgresql` | Guarda los datos en un volumen para conservarlos aunque se elimine el contenedor. |

!!! warning "Contraseña y datos existentes"

    La contraseña del ejemplo es solo para prácticas locales: cámbiala antes de iniciar el servidor y no publiques el archivo con una contraseña real. Las variables de inicialización se aplican cuando el volumen está vacío; cambiar después `POSTGRES_PASSWORD` en el archivo **no modifica** la contraseña de un usuario existente.

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

Si el puerto 5433 ya está ocupado, cambia el puerto situado a la izquierda, por ejemplo `"127.0.0.1:5434:5432"`, y vuelve a ejecutar `docker compose up -d`. Usa entonces el nuevo puerto al conectar desde el ordenador.

## 4. Conectarse y realizar una prueba

Desde la carpeta del proyecto, ejecuta el comando:

```bash
# Accede al cliente psql dentro del contenedor.
docker compose exec postgres psql -U postgres -d postgres
```
Veamos por partes:

- `docker compose exec` ejecuta un comando dentro de un servicio definido en `compose.yaml`.
- `postgres` es el nombre del servicio definido dentro de `services:`
- `psql -U postgres -d postgres` inicia el cliente PostgreSQL conectado a la base de datos `postgres`.

A continuación ejecuta estos comandos en `psql` de comprobación:

```sql
SELECT version();
SELECT current_user, current_database();
```

Para listar bases de datos y roles y salir de `psql`:

```text
\l
\du
\q
```

Para conectarte desde un cliente instalado en el mismo ordenador, utiliza estos datos:

| Parámetro | Valor |
|---|---|
| Servidor o *host* | `localhost` |
| Puerto | `5433` |
| Base de datos | `postgres` |
| Usuario | `postgres` |
| Contraseña | La indicada en `POSTGRES_PASSWORD` al inicializar el volumen |

Por ejemplo, si tienes `psql` instalado en el ordenador:

```bash
psql -h localhost -p 5433 -U postgres -d postgres
```

- El puerto `5433` es el del ordenador; dentro del contenedor PostgreSQL escucha en el puerto `5432`. 
- Los siguientes apartados suponen que `pgAdmin` o `DBeaver` están instalados en el mismo ordenador que Docker. 
- Si el cliente se ejecuta en otro contenedor, `localhost` se refiere a ese contenedor y necesita una configuración de red diferente.

## 5. Conexión con pgAdmin

Instala [pgAdmin 4](https://www.pgadmin.org/download/) para tu sistema operativo y ábrelo. Comprueba antes con `docker compose ps` que el contenedor está en marcha.

1. En el navegador de pgAdmin, haz clic derecho en **Servers** y selecciona **Register → Server**.
2. En la pestaña **General**, escribe un nombre para identificar la conexión, por ejemplo `PostgreSQL Docker`.
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

El nombre indicado en **General** es una etiqueta de pgAdmin: no crea una base de datos ni cambia el servidor. Para seguir practicando con esta herramienta, consulta [Administración gráfica con pgAdmin](06-pgadmin.md).

## 6. Conexión con DBeaver

Descarga e instala [DBeaver Community](https://dbeaver.io/download/) y abre la aplicación. Comprueba que el contenedor está en marcha antes de crear la conexión.

1. Selecciona **Nueva conexión** y elige **PostgreSQL**.
2. Introduce los datos de conexión:

    | Campo | Valor |
    |---|---|
    | **Host** | `localhost` |
    | **Puerto** | `5433` |
    | **Base de datos** | `postgres` |
    | **Usuario** | `postgres` |
    | **Contraseña** | La contraseña definida al inicializar el volumen |

3. Si deseas ver las bases de datos que se creen durante el curso, activa **Show all databases** (Mostrar todas las bases de datos). Tras crear una, actualiza la conexión en el navegador para que aparezca.
4. Pulsa **Probar conexión**. Si DBeaver solicita descargar el controlador de PostgreSQL, acepta la descarga y vuelve a probar la conexión. Después, guarda con **Finalizar**.
5. En el **Navegador de bases de datos**, haz clic derecho sobre la conexión y selecciona **Editor SQL → Nuevo script SQL**. Ejecuta:

    ```sql
    SELECT current_database(), current_user;
    ```

    El resultado debe mostrar `postgres` como base de datos y como usuario.

El nombre de la conexión es solo una etiqueta; la base de datos de destino se indica en el campo **Base de datos**. Para una explicación adicional, consulta la [guía de conexión con DBeaver](https://asalvadorc.github.io/PostgreSQL/2_client_dbeaver_installaci_i_confiuraci/). Los nombres de las opciones pueden variar según la versión y el idioma del cliente.

!!! tip "Si la conexión falla"

    Comprueba que el contenedor está iniciado con `docker compose ps`, que utilizas el puerto publicado en `compose.yaml` y que la contraseña coincide con la usada al inicializar el volumen. Revisa los detalles del error y, si es necesario, los registros con `docker compose logs postgres`.

## 7. Uso con la UD3

### ⚠️ Bases de datos y roles iniciales

El servidor recién creado contiene **solo** la base administrativa `postgres`, pero **no incluye**:

- La base de datos `geo` (si la utilizas en las prácticas)
- Sus tablas y objetos
- Los roles de práctica definidos en los requisitos iniciales

Para seguir los [ejemplos guiados](07-ejemplos_guiados.md), **debes crear primero la base de datos y los objetos** indicados en los requisitos iniciales del apartado. El contenedor no los importa automáticamente.

### 📋 Acceso a la sesión PostgreSQL en Docker

En la guía de UD3, los comandos `sudo -u postgres psql ...` corresponden a una **instalación local en Linux**. En Docker, equivalen a:

```bash
docker compose exec postgres psql -U postgres -d postgres
```

**Ejemplos prácticos:**

```bash
# Acceder a la base 'geo' como postgres (usuario administrador)
docker compose exec postgres psql -U postgres -d geo

# Acceder como otro rol (p.ej., 'usuario1') desde tu ordenador
psql -h localhost -p 5433 -U usuario1 -d geo

# Ejecutar un comando sin abrir sesión interactiva
docker compose exec postgres psql -U postgres -d postgres -c "SELECT version();"
```

### 🔧 Herramientas de línea de comandos

Los comandos `psql`, `pg_dump` y `pg_restore` de la guía pueden:

- **Instalados en tu ordenador**: ejecutarse directamente contra `-h localhost -p 5433`
- **Dentro del contenedor**: ejecutarse sin necesidad de instalar en el ordenador (pero usa las rutas internas del contenedor, no las del ordenador)

## 8. Detener y reanudar

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
