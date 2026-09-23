# 4. Instalación de clientes

Un cliente de PostgreSQL es una aplicación que permite conectarse al servidor y trabajar con sus bases de datos. El cliente no almacena la información principal: envía las solicitudes al servidor y muestra los resultados recibidos.

En esta unidad se utilizarán dos tipos de clientes:

| Tipo de cliente | Ejemplo | Características |
|---|---|---|
| Gráfico | pgAdmin | Facilita la administración mediante ventanas, menús y formularios. |
| Línea de comandos | `psql` | Permite ejecutar sentencias SQL y tareas administrativas desde un terminal. |

Antes de instalar un cliente hay que conocer la dirección del servidor, el puerto, el nombre de la base de datos, el usuario y el método de autenticación que se utilizará.

## pgAdmin

pgAdmin es una herramienta gráfica de administración para PostgreSQL. Dispone de versión de escritorio y versión web. Ambas permiten registrar servidores, crear bases de datos, consultar tablas, ejecutar sentencias SQL y revisar el estado de la conexión.

La instalación de pgAdmin en Windows se realiza siguiendo el instalador correspondiente. En Ubuntu Mate se deben seguir las instrucciones oficiales de [pgadmin.org/download](https://www.pgadmin.org/download/).

También se puede instalar la versión web de pgAdmin en el servidor y acceder desde un navegador.

### Datos para registrar el servidor

Al crear una conexión en pgAdmin se deben indicar, como mínimo, los siguientes datos:

| Campo | Ejemplo local | Ejemplo remoto |
|---|---|---|
| Nombre | `PostgreSQL local` | `PostgreSQL servidor` |
| Servidor o dirección | `localhost` | Dirección IP o nombre DNS del servidor |
| Puerto | `5432` | Puerto configurado en el servidor |
| Base de datos de mantenimiento | `postgres` | `postgres` u otra base autorizada |
| Usuario | `postgres` o un usuario de trabajo | Usuario creado para la conexión |
| Contraseña | La definida para el usuario | La definida para el usuario |

En una conexión remota, el servidor debe estar preparado para aceptar conexiones externas y la red debe permitir el acceso al puerto de PostgreSQL. Estos cambios se realizan en el servidor y no únicamente en el programa cliente.

## `psql`

`psql` es el cliente de consola. Permite realizar operaciones sobre las bases de datos de PostgreSQL y es útil para comprobar la implantación sin depender de una interfaz gráfica.

Los datos de conexión habituales son:

| Dato | Valor inicial |
| --- | --- |
| Servidor | `localhost` |
| Puerto | `5432` |
| Base de datos | `postgres` |
| Usuario | `postgres` |

Para una conexión remota se pueden indicar el servidor, el puerto, el usuario y la contraseña:

```bash
psql -h direccion_ip -p 5432 -U postgres -W
```

Las opciones principales son `-d` para la base de datos, `-p` para el puerto, `-U` para el usuario, `-h` para el servidor y `-W` para solicitar la contraseña.

También se puede indicar la base de datos directamente:

```bash
psql -h 192.168.1.50 -p 5432 -U alumno -d practicas -W
```

En este ejemplo, `psql` intenta conectarse al servidor situado en `192.168.1.50`, utilizando el puerto `5432`, el usuario `alumno` y la base de datos `practicas`. La opción `-W` solicita la contraseña antes de iniciar la sesión.

## Relación con la configuración del servidor

La instalación de un cliente no es suficiente para conectarse a un servidor remoto. PostgreSQL debe estar configurado para escuchar en la red y para aceptar al usuario desde la dirección de origen.

Los archivos principales son:

| Archivo | Función |
|---|---|
| `postgresql.conf` | Define parámetros generales del servidor, como el puerto y las direcciones en las que escucha. |
| `pg_hba.conf` | Define qué clientes pueden conectarse, con qué usuarios, a qué bases de datos y mediante qué método de autenticación. |

En Ubuntu suelen encontrarse en una ruta similar a `/etc/postgresql/<versión>/main/`. La ruta exacta puede consultarse desde `psql` con:

```bash
sudo -u postgres psql -c "SHOW config_file;"
sudo -u postgres psql -c "SHOW hba_file;"
```

Antes de modificar estos archivos, realiza una copia de seguridad. Un error de sintaxis o una regla incorrecta puede impedir el arranque del servidor o rechazar conexiones válidas. Después de cualquier cambio, hay que recargar o reiniciar el servicio y comprobar primero una conexión local.

```bash
sudo cp /etc/postgresql/<versión>/main/postgresql.conf /etc/postgresql/<versión>/main/postgresql.conf.bak
sudo cp /etc/postgresql/<versión>/main/pg_hba.conf /etc/postgresql/<versión>/main/pg_hba.conf.bak
sudo systemctl reload postgresql
```

El comando `reload` aplica los cambios que pueden recargarse sin detener el servicio. Si una modificación requiere reiniciar PostgreSQL, se debe utilizar `sudo systemctl restart postgresql` y comprobar después su estado.

## Preparación de una base de datos de prueba

Una vez instalado el cliente, conviene realizar una prueba sencilla con una base de datos de prácticas. El archivo SQL puede copiarse al servidor o ejecutarse desde el cliente, siempre que el usuario tenga permisos suficientes.

```bash
psql -h direccion_ip -p 5432 -U alumno -d practicas -W -f dades_geo.sql
```

La opción `-f` ejecuta las sentencias contenidas en el archivo `dades_geo.sql`. Como alternativa, se puede abrir una sesión y cargar el archivo desde `psql`:

```text
\i /ruta/al/archivo/bd_geo.sql
```

Para comprobar que la conexión y la importación han funcionado, se puede ejecutar una consulta sencilla:

```sql
SELECT current_user, current_database();
```

Si la conexión falla, hay que comprobar en este orden la dirección del servidor, el puerto, el estado del servicio, las reglas de `pg_hba.conf`, la contraseña y la conectividad de red.