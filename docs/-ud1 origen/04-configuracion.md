# 4. Configuración y administración del servicio


## 4. Instalación del cliente

El cliente oficial de Postgres es pgAdmin. Este cliente tiene una versión desktop y una versión
web.
4.1 Cliente Windows
A continuación tienes un vídeo donde puedes ver la instalación de pgAdmin en Windows. Sigue
este vídeo si deseas utilizar como cliente una máquina real o virtual con Windows.
Instalar pgAdmin4 en Windows
4.2 Cliente Linux
Instalaremos el cliente pgAdmin en una Ubuntu Mate.
Para instalar la última versión del pgAdmin seguiremos los pasos del siguiente enlace:
https://www.pgadmin.org/download/
Podemos instalar la versión web en el servidor para poder conectarnos con un navegador.

## 5. Ficheros de configuración

Básicamente son dos los ficheros de configuración de PostgreSQL. En nuestra instalación estos
ficheros se encuentran en
/etc/postgres/16/main
- postgresql.conf: En este fichero se encuentran la mayor parte de los parámetros de
configuración del servidor.
- pg_hba.conf: Desde aquí se pueden controlar las conexiones al servidor. Podemos permitir
o denegar las conexiones desde determinadas IPs, de usuarios, etc
Para poder editar estos ficheros, no tendremos ningún problema en el caso de Windows, pero si
tenemos el servidor en una máquina de Linux, tendremos que hacerlo desde un usuario con
permisos. Tendremos que conectar como superusuario (sudo su), y después utilizar un editor como
nano o vi.
NOTA: Si después de modificar algún fichero de configuración, éste tiene algún error (es
sintácticamente incorrecto) PostgreSQL no podrá arrancar de nuevo. Por esta razón es  MUY
IMPORTANTE hacer una  copia de seguridad  de los ficheros de configuración  ANTES de
realizar cualquier cambio.
5.1 postgresql.conf
Vamos a ver algunos parámetros de este fichero. Los parámetros que llevan delante  # están
comentados y por lo tanto se toma el valor por defecto. Cuando modificamos algún parámetro de



los ficheros de configuración, como mínimo tendremos que hacer un reload del servidor aunque en
algunos casos no será suficiente y tendremos que hacer un restart.
Algunos parámetros y sus descripciones son:
- hba_file, lugar donde se encuentra el fichero pg_hba.conf.
- listen_addresses, lista de IPs desde las que se admiten conexiones.
- localhost, sólo admite conexiones locales (por defecto).
- *, permite conexiones desde cualquier IP.
- port, puerto de escucha del servidor (por defecto 5432).
- max_connections, número máximo de conexiones (excepto para DBA).
- superuser_reserved_connections, número de conexiones reservadas para el
DBA; así pues, el máximo de conexiones para el resto de usuarios es: max_connections
- superuser_reserved_connections.
- authentication_timeout, tiempo máximo para autenticar a un usuario.
- ssl, habilita las conexiones ssl.
- password_encryption determina si la contraseña está encriptada (por defecto on).
Es de especial importancia el parámetro listen_addresses, que marca los lugares desde
donde nos podemos conectar al servidor.
La opción localhost únicamente permite conexiones desde el propio servidor mientras que la
opción asterisco permite las conexiones desde cualquier dirección IP.
5.2 pg_hba.conf
Este fichero de configuración guarda los usuarios que se pueden conectar al servidor, a qué bases de
datos se pueden conectar, el tipo de autenticación, etc. Vamos a verlo con más detalle.
En cada línea del fichero hay una serie de campos:
Tipo de conexión => Base de Datos => Usuario => Dirección IP => Máscara IP =>
Método autenticación
Tipo de conexión
- LOCAL, la conexión se realiza desde la misma máquina donde está el servidor. Se realiza
utilizando sockets Unix. Además del usuario de BD, también será necesario el usuario del
SO que es quien realiza la solicitud de conexión.
- HOST, indica conexiones externas por TCP/IP. Para poder habilitar este tipo de conexiones
tenemos que asegurarnos que en el fichero postgresql.conf haya un asterisco para el
parámetro listen_addresses.



Base de Datos
- ALL, se permite conectar a todas las Bases de Datos.
- SAMEUSER, se refiere a la Base de Datos con el mismo nombre de usuario.
- SAMEROLE, se refiere a la Base de Datos con el mismo nombre que un rol de grupo al que
pertenece el usuario. También se puede utilizar el sinónimo SAMEGROUP.
Usuario
- ALL, se refiere a todos los usuarios.
Si no es ALL, se interpretará como el nombre de un usuario, o más de uno separado por comas.
Dirección y Máscara IP
Con estos dos datos (dirección IP y máscara de red) podemos especificar las direcciones IP que
pueden conectarse al servidor. Se puede indicar una sola dirección IP o un rango de direcciones IP.
La máscara se puede indicar de la forma tradicional (por ejemplo: 255.255.255.0) o también con el
prefijo (por ejemplo: /24).
Para indicar una sola dirección IP escribiremos la dirección IP con máscara 32. Por ejemplo para la
dirección 192.168.1.23 escribiremos una de las dos opciones:
192.168.1.23 255.255.255.255
192.168.1.23/32
Para indicar un rango de direcciones utilizaremos la direción de red y la máscara correspondiente.
Por ejemplo para cualquier equipo de la red 10.0.0.0/8 escribiremos una de las dos opciones:
10.0.0.0 255.0.0.0
10.0.0.0/8
Método de autenticación
- TRUST, la conexión siempre se acepta sin realizar ninguna comprobación, sin proporcionar
contraseña.
- REJECT, la conexión siempre se rechaza.
- PASSWORD, obliga al cliente a proporcionar una contraseña. Estas contraseñas viajan por la
red en texto plano y son fácilmente atacadas.
- MD5, igual que el anterior pero la contraseña viaja cifrada por MD5.
- SCRAM-SHA-256, la contraseña viaja cifrada por SCRAM-SHA-256.
- PEER, el usuario del SO y de PostgreSQL tienen que ser idénticos.
Ejemplos
Aquí tienes algunos ejemplos de líneas que se pueden poner en el fichero pg_hba.conf y su
explicación:



Línea 82: permite la conexión desde el servidor a cualquier usuario a cualquier BD con contraseña.
Línea 83: permite la conexión desde la IP 192.168.1.26 al usuario postgres a la BD postgres con
contraseña.
Línea 84: permite la conexión desde cualquier IP al usuario user1 a la BD user1 con contraseña.
5.3 Iniciar y parar el servidor
Existen varias formas de iniciar y parar el servidor.
Automática
La mayor parte de las veces, tanto la puesta en marcha como la parada del servidor se realiza de
forma automática cuando arrancamos o paramos el servidor.
Comandos del Sistema Operativo
sudo service postgresql status
- start, inicia el servidor
- stop, para el servidor
- restart, reinicia el servidor (lo para y lo vuelve a iniciar)
- status, muestra información del estado del servidor
Utilizando pg_ctl
Es un script que se encuentra junto a todos los ejecutables de PostgreSQL (en la carpeta bin).
Además de las opciones anteriores (start, stop, …) se pueden añadir más opciones como la
ubicación de la BD, la forma de parar, el número máximo de conexiones, etc.
- -D, indica la carpeta donde se ubica la BD
- -m, indica la forma de parar la BD
- s (smart) espera a que todos los usuarios estén desconectados
- f (fast) descarta las transacciones, desconecta a los usuarios y apaga el servidor
- i (inmediate) para el servidor de forma inmediata. Después se tendrá que recuperar
la BD.
Ejemplos de uso
Cambiamos al usuario postgres



sudo su postgres
Nos movemos a la carpeta de instalación donde se encuentran los ejecutables
cd /usr/lib/postgresql/16/bin
Reiniciamos la BD que está en la carpeta /var/lib/postgresql/16/main
./pg_ctl -D /var/lib/postgresql/16/main restart
Paramos la BD que está en /var/lib/postgresql/16/main esperando la desconexión de usuarios.
./pg_ctl -D /var/lib/postgresql/16/main -m s stop
Iniciamos la BD que está en la carpeta /var/lib/postgresql/16/main
./pg_ctl -D /var/lib/postgresql/16/main restart

## 6. Entornos de trabajo

6.1 psql
El cliente más sencillo sin entorno gráfico es psql. Este programa nos permite realizar cualquier
tipo de operación sobre las bases de datos de postgres.
Para iniciar psql desde el servidor escribimos:
sudo -u postgres psql
Los datos de la conexión que utiliza plsql por defecto son:
- server: localhost
- puerto: 5432
- base de datos: postgres
- usuario: postgres
También podemos conectar con otros usuarios, base de datos, puertos, etc especificando la opción
correcta al llamar al programa psql. Aquí tienes algunas opciones:
-? Ayuda
-d nombre_bd Nombre de la Base de datos
-p puerto Puerto de conexión del servidor
-U nombre Nombre del Usuario
-h ip/url Conexión remota
-W Para que solicite obligatoriamente la contraseña
Una vez dentro del programa (ya hemos conectado con psql) ya podemos escribir los comandos que
necesitemos.
Las sentencias SQL pueden ocupar más de una línea y tienen que terminar con punto y coma.
Con las flechas del cursos se puede recuperar la sentencia anterior (únicamente una línea).
