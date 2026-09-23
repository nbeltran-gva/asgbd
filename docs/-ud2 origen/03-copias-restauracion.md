# 3. Copias de seguridad y restauración



## 1. Introducción

Esta tarea tan fundamental del DBA es muy sencilla de hacer en Postgres y se puede planificar con
un script que se ejecute periódicamente.
Se puede decir que existen tres formas de hacer el backup:
- Con el programa pg_dump.
- De forma gráfica con pgAdmin.
- Copiando directamente los ficheros.
También existe la posibilidad de realizar un PITR (Point in Time Recovery)  que consiste en la
recuperación del sistema hasta un momento concreto (parecido a la recuperación de Oracle en el
modo ARCHIVELOG). Para poder hacer una recuperación en el tiempo, es necesario que
PostgreSQL guarde todos los cambios que se realicen en el sistema en unos ficheros llamados WAL
(Write Ahead Log - información sobre las transacciones realizadas). Este tipo de recuperación es
muy avanzada y no la vamos a ver en este curso.
2 Actualizando aplicaciones cliente
Es posible que pgAdmin os de problemas con las aplicaciones cliente que tenéis instaladas (por
ejemplo: pg_dump o pg_restore). Esto es debido a que al instalar pgAdmin en Ubuntu Mate, como
dependencias, haya instalado las aplicaciones cliente de los repositorios de la distribución de la
versión 14. Para solucionar este problema añadiremos los repositorios de PostgreSQL e
instalaremos las aplicaciones cliente de la versión que tenemos en la Ubuntu Server (en nuestro
caso la 16). Para ello, en la Ubuntu Mate, haremos lo siguiente:
sudo apt install curl ca-certificates
sudo install -d /usr/share/postgresql-common/pgdg
sudo curl -o /usr/share/postgresql-common/pgdg/apt.postgresql.org.asc --fail
https://www.postgresql.org/media/keys/ACCC4CF8.asc
sudo sh -c 'echo "deb
[signed-by=/usr/share/postgresql-common/pgdg/apt.postgresql.org.asc]
https://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" >
/etc/apt/sources.list.d/pgdg.list'
sudo apt update
sudo apt purge postgres-*
sudo apt -y install postgresql-client-16
3 Copia de seguridad con pg_dump
Básicamente consiste en generar un fichero de texto con las consultas SQL necesarias para rehacer
la Base de Datos tal y como estaba en el momento de ejecutar el pg_dump.



El programa pg_dump se encuentra en la misma ruta ( /usr/lib/postgresql/16/bin ) que el resto de
programas de postgres y sus opciones principales son las siguientes:
- -a, sólo guarda los datos.
- -s, Sólo guarda la estructura.
- --inserts, utiliza la sentencia INSERT para los datos (si no utilizará COPY).
- --column-inserts, incluye los nombres de las columnas en las sentencias.
- -f fichero, envía el resultado a un fichero.
- -F formato, indica el formato de salida ( c custom, d directory, t tar, p plain text).
- -n nombreBD, sólo copia la BD especificada.
- -t nombreTabla Sólo copia la tabla especificada.
- --help, muestra la ayuda con todas las opciones (igual que -? ).
Además, también tenemos las habituales opciones de conexión: -h (host), -p (puerto), -U usuario y -
W.
A continuación tienes algunos ejemplos de uso del programa pg_dump:
Se conecta con el usuario geo y hace una copia de seguridad de toda la base de datos geo. La guarda
en el fichero geo.sql
pg_dump -U geo geo > geo.sql
Esta vez sólo copia la estructura de la base de datos geo.
pg_dump -s -U geo geo > geo.sql
Sólo copia los datos utilizando sentencias INSERT
pg_dump -a --inserts -U geo geo > geo.sql
Sólo copia la estructura de las tablas comarques e instituts.
pg_dump -s -t comarques -t instituts -U geo geo > geo.sql
Una variante de pg_dump es pg_dumpall que hace la copia de seguridad de todas las BD  del
sistema. Este programa habrá que ejecutarlo como postgres para tener acceso a todas las BD.
También guarda otros objetos que no pertenecen a ninguna BD como son los usuarios y los grupos.
El inconveniente es que hay que introducir la contraseña del usuario postgres tantas veces como BD
haya en el sistema.
Muestra la ayuda con todas las opciones del programa:
pg_dumpall -?



4 Restauración del fichero generado con pg_dump
Si el fichero de salida no tiene ningún formato  (no hemos utilizado la opción -F), entonces lo
ejecutaremos desde psql ya que son sentencias SQL. Desde fuera (sin entrar en psql) se puede hacer
de dos maneras:
psql nombre_bd < fichero
o
psql -f fichero nombre_bd
También se puede hacer desde dentro de psql con la opción \i fichero
Para que este tipo de restauración funcione tanto la Base de Datos como el usuario deben existir.
Combinando el programa pg_dump con psql se puede “pasar” la información de una BD a otra:
pg_dump bd1 | psql bd
o incluso a otra BD que esté en otro servidor
pg_dump bd1 | psql -h host bd
Si el fichero de salida tenía algún formato (porque hemos utilizado la opción -F), entonces la
restauración se realizará con el programa pg_restore.
Las principales opciones de pg_restore son:
- -a, sólo restaura los datos.
- -s, sólo restaura la estructura.
- -d nombreBD, Se conecta a la BD y restaura directamente en ella.
- -F formato, Indica el formato del fichero de entrada.
- -t nombretabla, Restaura la tabla especificada.
Además, también tenemos las habituales opciones de conexión: -h (host), -p (puerto), -U (usuario)
y -W.
Por ejemplo:
pg_restore -U postgres -d dvdrental D:/backup/dvdrental.tar
5 Copia de seguridad desde pgAdmin
Hacer copias de seguridad desde pgAdmin es muy sencillo. Realmente estaremos ejecutando
pg_dump pero desde un entorno gráfico, sin necesidad de conocer la sintaxix de todas las opciones
que nos ofrece pg-dump.
A continuación tienes un vídeo donde puedes ver la creación de copias de seguridad y restauración
desde pgAdmin.
https://www.youtube.com/watch?v=YKCAuic0mD0



6 Ejercicios
Adjunta las capturas de pantalla necesarias.

### Ejercicio 2.8

Con pgAdmin, crea una copia de seguridad de la estructura de la Base de Datos geo. Utiliza esta
copia de seguridad para restaurar o crear una nueva BD que se llame “geo_nueva”.

### Ejercicio 2.9

Con pgAdmin, traspasa los datos de la tabla comarques de la BD geo a la tabla comarques de la BD
geo_nueva.

### Ejercicio 2.10

Utilizando las herramientas de backup de la línea de comandos crea una copia de la DB geo en la
BD “geo_nueva2”.
