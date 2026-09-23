# 1. Configuración de conexiones

Los ficheros principales de configuración se encuentran normalmente en `/etc/postgresql/16/main`. La ruta puede cambiar según la versión instalada.

## Selección del motor y de las herramientas

El motor de base de datos se selecciona según los requisitos de explotación: volumen de información, número de conexiones, compatibilidad, seguridad, disponibilidad de herramientas y experiencia del equipo administrador. 

En esta unidad se utiliza PostgreSQL porque ofrece un motor relacional robusto, herramientas de consola y gráficas, buena documentación y una licencia adecuada para las prácticas.

Las herramientas cliente se eligen según la tarea que se vaya a realizar:

| Herramienta | Uso principal |
|---|---|
| `psql` | Ejecutar consultas, comprobar conexiones y automatizar tareas desde la terminal. |
| pgAdmin | Administrar el servidor mediante una interfaz gráfica y consultar su configuración. |
| `pg_isready` | Comprobar rápidamente si el servidor acepta conexiones. |

La herramienta cliente debe utilizar una versión compatible con el servidor y disponer de los datos de conexión, el usuario y el método de autenticación previstos.

## `postgresql.conf`

Contiene la mayor parte de los parámetros del servidor. Los parámetros precedidos por `#` están comentados y utilizan el valor predeterminado.

Los parámetros más importantes para implantar el acceso son:

- `listen_addresses`: direcciones desde las que se admiten conexiones;
- `localhost`: limita las conexiones al propio servidor;
- `*`: permite conexiones desde cualquier dirección configurada;
- `port`: puerto de escucha, normalmente `5432`;
- `max_connections`: número máximo de conexiones;
- `authentication_timeout`: tiempo máximo para autenticar un usuario;
- `ssl`: habilita conexiones SSL;
- `password_encryption`: define cómo se almacenan las contraseñas.

Para permitir conexiones externas hay que revisar especialmente `listen_addresses`. No conviene utilizar `*` sin controlar también las reglas de autenticación y las restricciones de red.

## `pg_hba.conf`

Controla qué usuarios pueden conectarse, a qué bases de datos, desde qué direcciones y con qué autenticación. Cada línea contiene:

```text
tipo_de_conexion  base_de_datos  usuario  direccion_ip  mascara  autenticacion
```

### Tipos de conexión

- `local`: conexión desde el servidor mediante sockets Unix;
- `host`: conexión externa mediante TCP/IP.

Se puede autorizar una IP concreta, como `192.168.1.23/32`, o una red completa, como `10.0.0.0/8`. Los métodos de autenticación habituales incluyen `reject`, `password`, `scram-sha-256` y `peer`.

El orden de las líneas es importante: PostgreSQL aplica la primera regla que coincide. Por este motivo, una regla demasiado amplia situada antes que otra más específica puede producir un resultado distinto del esperado.

## Aplicar cambios

Después de modificar un fichero de configuración hay que recargar o reiniciar el servicio. En caso de duda, comprueba primero la sintaxis y conserva la copia anterior.

```bash
sudo service postgresql status
sudo service postgresql restart
```

Un ejemplo de reglas para una conexión local autenticada sería:

```text
local all postgres scram-sha-256
local geo geo scram-sha-256
```

Para que `postgres` pueda autenticarse con contraseña se puede establecer una:

```sql
\password postgres
```

El comando solicita la nueva contraseña sin mostrarla en pantalla. En un entorno real se debe utilizar una contraseña robusta, limitar el uso del superusuario y no incluir credenciales en materiales públicos o scripts compartidos.

## Características por defecto de las bases de datos

Al crear una base de datos conviene revisar sus características por defecto, como la plantilla utilizada, la codificación y la configuración regional. Estas propiedades afectan a la forma de almacenar y comparar los datos.

Se pueden consultar algunos valores del servidor con:

```sql
SHOW server_encoding;
SHOW lc_collate;
SHOW lc_ctype;
```

Para una base de datos de prácticas se puede especificar una codificación adecuada desde su creación:

```sql
CREATE DATABASE practicas
	WITH TEMPLATE template0
	ENCODING 'UTF8';
```

La codificación y la configuración regional deben decidirse antes de crear la base de datos, porque cambiarlas posteriormente puede requerir migrar la información.

## Parámetros de las conexiones

Además del puerto y de las direcciones de escucha, es necesario revisar los límites y tiempos asociados a las conexiones:

| Parámetro | Función |
|---|---|
| `max_connections` | Define el número máximo de conexiones simultáneas al servidor. |
| `authentication_timeout` | Establece el tiempo máximo permitido para completar la autenticación. |
| `statement_timeout` | Limita el tiempo de ejecución de una sentencia. El valor `0` significa sin límite. |
| `idle_in_transaction_session_timeout` | Cierra una sesión que permanece inactiva dentro de una transacción durante demasiado tiempo. |

Desde un cliente también se puede establecer un tiempo máximo para conectar:

```bash
psql "host=192.168.1.50 port=5432 dbname=practicas user=alumno connect_timeout=5"
```

Los valores deben adaptarse a la carga de trabajo. Un número excesivo de conexiones puede agotar la memoria del servidor y unos tiempos demasiado bajos pueden provocar cortes en operaciones legítimas.
