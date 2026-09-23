# 3. Instalación del servidor y del cliente

Tablespaces
Un espacio de tablas o tablespace es un espacio de almacenamiento para objetos o bases de datos.
Los tablespaces son utilizados por los administradores con distintos propósitos:
a) Mantenimiento: si el disco duro, donde se ha creado la instancia de PostgreSQL, se queda sin
espacio se puede crear un tablespace en otro disco o partición.
b) Optimización: Se pueden crear tablespaces en discos SSD para un acceso más rápido a los datos
más críticos y otros en discos más lentos que tengan datos a los cuales se accede con menos
frecuencia.

## 3. Instalación del servidor

PostgreSQL se puede instalar en diversos sistemas operativos (Linux, Windows, OS). En estos
apuntes veremos la instalación en Linux, concretamente en la máquina virtual Ubuntu Server.
En Linux existen varias formas de instalar PostgreSQL, por paquetes, descargando el código fuente,
etc.
Los repositorios por defecto de Ubuntu contienen paquetes Postgres, así que podemos instalarlo
fácilmente utilizando apt. Si realizamos la instalación de esta forma no tendremos la última versión
del sistema gestor.
A continuación tienes los comandos para instalar postgres desde el terminal:
sudo apt-get update
sudo apt-get install postgresql
Para instalar la última versión en Ubuntu Server utilizaremos el siguiente enlace:
https://www.postgresql.org/download/linux/ubuntu/
El procedimiento de instalación creó un usuario llamado postgres, para poder conectar al servidor
debemos cambiar a la cuenta postgres
sudo -i -u postgres
Ahora ya se puede acceder a la consola de PostgreSQL
psql
También se puede acceder directamente a la consola de PostgreSQL con el siguiente comando:
sudo -u postgres psql
Durante el proceso de instalación se ha creado un usuario postgres que será el propietario de todo
PostgreSQL.
De momento, en la base de datos sólo existe un usuario que también se llama postgres que será el
DBA.




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
