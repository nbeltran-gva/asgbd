# 3. Instalación de clientes

Un cliente de PostgreSQL es una aplicación que permite conectarse al servidor PostgreSQL y trabajar con sus bases de datos. El cliente no almacena los datos de forma permanente, sino que envía solicitudes al servidor y muestra los resultados obtenidos.

En esta unidad se utilizarán dos tipos de clientes:

| Tipo de cliente | Ejemplo | Características |
|---|---|---|
| Gráfico | pgAdmin | Facilita la administración mediante ventanas, menús y formularios. |
| Línea de comandos | `psql` | Permite ejecutar sentencias SQL y tareas administrativas desde un terminal. |

Antes de instalar un cliente hay que conocer:

- la dirección del servidor
- el puerto de conexión
- el nombre de la base de datos
- el usuario 
- y el método de autenticación que se utilizará (contraseña si es el caso).

## Cliente pgAdmin 

**pgAdmin** es una herramienta gráfica oficial de administración para PostgreSQL. 

Dispone de versión de escritorio y versión web. Ambas permiten:

- Registrar servidores.
- Crear y eliminar bases de datos.
- Administrar usuarios.
- Ejecutar consultas SQL.
- Visualizar objetos de la base de datos.

### Instalación 

1. En **Windows**: se realiza siguiendo el instalador correspondiente. 

2. En **Ubuntu Mate**: se deben seguir las instrucciones oficiales de [pgadmin.org/download](https://www.pgadmin.org/download/).

```bash
sudo apt update
sudo apt install pgadmin4
```

También se puede instalar la **versión web** de pgAdmin en el servidor y acceder desde un navegador.

### Conexión al servidor

Una vez instalado pgAdmin, cuando queremos crear una conexión en pgAdmin se deben indicar, como mínimo, los siguientes datos:

| Campo | Ejemplo local | Ejemplo remoto |
|---|---|---|
| Nombre | `PostgreSQL local` | `PostgreSQL servidor` |
| Servidor o dirección | `localhost` | Dirección IP o nombre DNS del servidor |
| Puerto | `5432` | Puerto configurado en el servidor |
| Base de datos de mantenimiento | `postgres` | `postgres` u otra base autorizada |
| Usuario | `postgres` o un usuario de trabajo | Usuario creado para la conexión |
| Contraseña | La definida para el usuario | La definida para el usuario |

En una conexión remota, el servidor debe estar preparado para aceptar conexiones externas y la red debe permitir el acceso al puerto de PostgreSQL. Estos cambios se realizan en el servidor y no únicamente en el programa cliente.

Si la conexión es correcta aparecerá el servidor en el árbol de objetos.

## Cliente `psql`

`psql` es el cliente más sencillo y utiliza el terminal o modo consola. Permite realizar operaciones sobre las bases de datos de PostgreSQL y es útil para comprobar la implantación sin depender de una interfaz gráfica.

### Instalación 

1. En **Windows** se puede instalar: 

    - Durante la instalación de PostgreSQL.
    - Mediante Stack Builder.
    - Utilizando los paquetes oficiales de PostgreSQL.

2. En **Ubuntu Mate**: se ejecutan las sentencias siguientes:

```bash
sudo apt update
sudo apt install postgresql-client
```
A continuación se debe realizar la comprobación de la instalación:

```bash
psql --version
```

Ejemplo de salida:

- psql (PostgreSQL) 16.4

### Conexión al servidor

Los datos de la conexión que utiliza plsql por defecto son: 

- server: localhost 
- puerto: 5432 
- base de datos: postgres 
- usuario: postgres 

También podemos conectar con otros usuarios, base de datos, puertos, etc especificando la opción correcta al llamar al programa `psql`. Aquí tienes algunas opciones:

Así las opciones principales para `psql` serán:

| Opción | Significado |
|---|---|
| `-?` | Ayuda |

| `-d` | Nombre de la Base de datos a la que se conecta. |
| `-p` | Puerto de conexión del servidor PostgreSQL. |
| `-U` | Usuario con el que se conecta. |
| `-h` | Dirección del servidor o host para una conexión remota. |
| `-W` | Solicita obligatoriamente la contraseña antes de conectarse. |

Por ejemplo, para una **conexión local** utilizamos únicamente el usuario y/o base de datos, por ejemplo:

```bash
psql -U alumno
```

```bash
psql -U alumno -d practicas
```

Mientra que para una **conexión remota** ya se deben indicar además el servidor y el puerto, por ejemplo:

```bash
psql -h 192.168.1.50 -p 5432 -U alumno -d practicas -W 
```
En este ejemplo, `psql` intenta conectarse al servidor situado en `192.168.1.50`, utilizando el puerto `5432`, el usuario `alumno` y la base de datos `practicas`. La opción `-W` solicita la contraseña antes de iniciar la sesión.


### Comandos básicos de psql

`psql` incluye varios comandos internos que facilitan el trabajo con la sesión actual. Algunos de los más útiles son:

| Comando | Descripción |
|---|---|
| `\e` | Abre el editor para modificar la última sentencia SQL. |
| `\l` | Muestra el listado de bases de datos disponibles. |
| `\d` | Muestra el listado de tablas de la base de datos actual. |
| `\du` | Muestra el listado de usuarios. |
| `\d nombre_tabla` | Muestra la descripción de una tabla concreta. |
| `\g [archivo]` | Ejecuta la última sentencia y envía el resultado a un archivo. |
| `\i archivo` | Ejecuta una o varias sentencias SQL desde un archivo. |
| `\w archivo` | Guarda la sentencia actual del buffer en un archivo. |
| `\o [archivo]` | Redirige la salida de la consulta a un archivo. |
| `\c base_datos [usuario]` | Cambia a otra base de datos y, si se indica, cambia de usuario. |
| `\conninfo` | Muestra información del usuario y la base de datos actuales. |
| `\q` | Sale de `psql`. |

# CONFIGURACION 

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