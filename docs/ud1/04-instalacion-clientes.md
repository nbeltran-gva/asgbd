# 4. Instalación de clientes

Un cliente de PostgreSQL es una aplicación que permite conectarse al servidor y trabajar con las bases de datos. El cliente no guarda la información de forma permanente; simplemente envía consultas al servidor y muestra los resultados.

En esta unidad se utilizarán dos tipos de clientes:

| Tipo de cliente | Ejemplo | Uso principal |
|---|---|---|
| Gráfico | `pgAdmin` | Administración visual de bases de datos. |
| Línea de comandos | `psql` | Ejecución de consultas y tareas administrativas desde el terminal. |

Antes de instalar un cliente, conviene conocer:

- la dirección del servidor;
- el puerto de conexión;
- el nombre de la base de datos;
- el usuario;
- el método de autenticación.

---

## Cliente `pgAdmin`

`pgAdmin` es la herramienta gráfica oficial para administrar PostgreSQL. Permite:

- registrar servidores;
- crear y borrar bases de datos;
- gestionar usuarios y permisos;
- ejecutar consultas SQL;
- visualizar objetos del SGBD.

### Instalación

1. En Windows, se instala mediante el instalador oficial de PostgreSQL.
2. En Ubuntu, se sigue la guía de `pgadmin.org`.

```bash
sudo apt update
sudo apt install pgadmin4
```

También puede instalarse la versión web de pgAdmin en el servidor y acceder desde el navegador.

### Conexión al servidor

Para crear una conexión en `pgAdmin`, normalmente se indican estos datos:

| Campo | Ejemplo local | Ejemplo remoto |
|---|---|---|
| Nombre | `PostgreSQL local` | `PostgreSQL servidor` |
| Servidor o dirección | `localhost` | IP o nombre DNS del servidor |
| Puerto | `5432` | `5432` o el puerto configurado |
| Base de datos | `postgres` | `postgres` o otra base autorizada |
| Usuario | `postgres` o usuario de trabajo | Usuario con permisos adecuados |
| Contraseña | La definida para el usuario | La definida para el usuario |

Si la conexión es correcta, el servidor aparecerá en el árbol de objetos.

!!! note
    En una conexión remota, además del cliente, es necesario que el servidor esté configurado para aceptar conexiones externas y que la red permita el acceso al puerto de PostgreSQL.

---

## Cliente `psql`

psql es el cliente de línea de comandos de PostgreSQL. Permite conectarse a un servidor PostgreSQL, ejecutar sentencias SQL y realizar tareas básicas de administración y mantenimiento de bases de datos.

!!! note "Recordatorio"
    Esta herramienta ya se utilizó durante la instalación del servidor PostgreSQL para verificar el estado del servicio y comprobar el funcionamiento de la instalación. En esta unidad se estudiará como cliente de acceso a bases de datos, tanto en conexiones locales como remotas.

### Instalación

1. En Windows, puede instalarse junto con PostgreSQL o mediante Stack Builder.

2. En Ubuntu, se ejecuta:

```bash
sudo apt update
sudo apt install postgresql-client
```

Comprobación:

```bash
psql --version
```

Ejemplo de salida:

```text
psql (PostgreSQL) 16.4
```

### Conexión al servidor

Los valores por defecto suelen ser:

- servidor: `localhost`
- puerto: `5432`
- base de datos: `postgres`
- usuario: `postgres`

Para conectarse con otros datos, se usan las opciones de `psql`.

| Opción | Descripción |
|---|---|
| `-d` | Nombre de la base de datos. |
| `-p` | Puerto del servidor PostgreSQL. |
| `-U` | Usuario con el que se conecta. |
| `-h` | Dirección del servidor o host. |
| `-W` | Solicita la contraseña antes de conectar. |
| `-?` | Muestra la ayuda del cliente. |

Ejemplo de conexión local:

```bash
psql -U alumno
```

```bash
psql -U alumno -d practicas
```

Ejemplo de conexión remota:

```bash
psql -h 192.168.1.50 -p 5432 -U alumno -d practicas -W
```

En este caso, `psql` intenta conectarse al servidor `192.168.1.50`, usando el puerto `5432`, el usuario `alumno` y la base de datos `practicas`.

### Comandos básicos de `psql`

`psql` incluye varios comandos internos que facilitan el trabajo con la sesión actual:

| Comando | Descripción |
|---|---|
| `\e` | Abre el editor para modificar la última sentencia SQL. |
| `\l` | Muestra las bases de datos disponibles. |
| `\d` | Muestra las tablas de la base de datos actual. |
| `\d nombre_tabla` | Muestra la descripción de una tabla concreta. |
| `\g [archivo]` | Ejecuta la última sentencia y la envía a un archivo. |
| `\i archivo` | Ejecuta sentencias SQL desde un archivo. |
| `\w archivo` | Guarda la sentencia actual del buffer en un archivo. |
| `\c base_datos [usuario]` | Cambia de base de datos y, si se indica, de usuario. |
| `\conninfo` | Muestra la información del usuario y la base de datos actuales. |
| `\password [usuario]` | Cambia la contraseña de un rol solicitándola de forma interactiva, sin mostrarla en pantalla. |
| `\du` | Lista los roles (usuarios) existentes. |
| `\dn` | Lista los esquemas de la base de datos actual. |
| `\dt` | Lista solo las tablas de la base de datos actual. |
| `\dt *.*` | Lista las tablas de todos los esquemas. |
| `\db` | Lista los tablespaces. |
| `\x` | Activa o desactiva la visualización ampliada (un campo por línea). |
| `\timing` | Activa o desactiva la medición del tiempo de ejecución de cada sentencia. |
| `\?` | Muestra la ayuda de los comandos internos de `psql`. |
| `\h sentencia` | Muestra la ayuda de una sentencia SQL, por ejemplo `\h CREATE TABLE`. |
| `\q` | Sale de `psql`. |

!!! tip
    Si se quiere comprobar rápidamente la conexión, basta con ejecutar:

```bash
psql -U alumno -d practicas
```

Y después una consulta sencilla:

```sql
SELECT current_user, current_database();
```

---

## Relación con la configuración del servidor

La instalación de un cliente no es suficiente para conectar desde otra máquina. El servidor debe estar preparado para aceptar conexiones desde red y debe existir una regla de acceso correcta en la configuración del servicio.

Para configurar el acceso desde red, los puertos y la autenticación, se revisará en la unidad de configuración del servidor.

---
