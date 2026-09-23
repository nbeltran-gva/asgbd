# 5. Entornos de trabajo

También existen comandos propios de psql que podemos utilizar:
\e Invoca un editor para editar la última sentencia
\l Listado de las bases de datos
\d Listado de las tablas
\d tabla : Descripción de la tabla
\g [fichero] : Ejecuta la sentencia SQL y envía el resultado a un fichero
\i fichero : Ejecuta la sentencias (o sentencias) SQL del fichero
\w fichero : Guarda la sentencia del buffer en un fichero
\c base de datos [usuario] : Nos conectamos a la base de datos con el usuario
\conninfo Información del usuario y la base de datos a la que estamos conectados
\q Salir de psql
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
problema tendremos que editar el fichero “/etc/postgresql/16/main/pg_hba.conf” y cambiar el
método de autenticación:
sudo nano /etc/postgresql/16/main/pg_hba.conf
La línea siguiente que se encuentra en este fichero:
local all postgres peer
La cambiaremos por:
local all postgres scram-sha-256
local geo geo scram-sha-256
Por otro lado, ya que hemos cambiado también el método de autenticación del usuario “postgres”
vamos a ponerle una contraseña. Para ello entraremos en postgresql con psql:
sudo -u postgres psql



Y ejecutaremos la sentencia sql:
ALTER USER postgres PASSWORD ‘postgres’;
Reiniciaremos el servicio para que se apliquen los cambios:
sudo service postgresql restart
6.2 pgAdmin
pgAdmin es el entorno oficial de trabajo de postgres. Es un entorno gráfico muy intuitivo y que nos
permite realizar todas las tareas necesarias en la Base de Datos.
A continuación tienes un vídeo donde puedes ver la forma de conectar y algunos ejemplos de
utilización de pgAdmin : https://youtu.be/drp6CmbYpQg.
