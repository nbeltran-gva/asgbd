# 4. Configuración base de datos

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


---

Entorno de trabajo en `psql`

A continuación tienes un vídeo donde puedes ver la forma de conectar y algunos ejemplos de
utilización de psql : https://youtu.be/1raopEYJpio
Para seguir los pasos del vídeo en nuestro servidor sin interfaz gráfica debes seguir los siguientes
pasos:
Descarga el fichero sql mediante wget.
wget https://pastebin.com/raw/UexT4J4w -O dades_geo.sql
Inicia sesión en psql
sudo -u postgres psql
Una vez dentro de psql ejecuta los comandos que se muestran en el vídeo. La única diferencia es
que probablemente el fichero se tenga que importar cambiando la ruta donde se ha descargado.
\i /home/admin01/dades_geo.sql
Esta ejecución además nos crea un usuario geo con contraseña “geo”. Sin embargo, si intentamos
entrar con “psql -U geo”, nos dice que el método de autentificación está fallando. Para resolver este
problema tendremos que editar el fichero “/etc/postgresql/16/main/pg_hba.conf” y cambiar el método de autenticación:

sudo nano /etc/postgresql/16/main/pg_hba.conf


La línea siguiente que se encuentra en este fichero:
local all postgres peer
La cambiaremos por:
local all postgres scram-sha-256
local geo geo scram-sha-256
Por otro lado, ya que hemos cambiado también el método de autenticación del usuario “postgres”
vamos a ponerle una contraseña. Para ello entraremos en postgresql con psql:
sudo -u postgres psql
12
IES El Caminàs ASGBD
Y ejecutaremos la sentencia sql:
ALTER USER postgres PASSWORD ‘postgres’;
Reiniciaremos el servicio para que se apliquen los cambios:
sudo service postgresql restart