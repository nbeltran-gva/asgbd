# 2. Bases de datos, esquemas y tablespaces



## 1. Introducción

Una Base de Datos es un lugar donde puede haber uno o más esquemas, y en cada esquema se
pueden crear muchos objetos.
Por deformación del lenguaje solemos llamar Base de Datos al propio Sistema Gestor de BD pero
este uso del término BD es incorrecto.
En Oracle hablamos de Instancia y dentro de cada instancia puede haber muchas bases de datos o
esquemas. Incluso podemos poner más de una instancia de Oracle en marcha en el mismo servidor.
En Postgres, el término correcto es CLUSTER DE BASES DE DATOS. Dentro de nuestro cluster
hemos creado la BD geo y dentro de geo tenemos un esquema (public) donde hemos creado las
tablas. También podemos poner más de un Cluster en marcha, aunque eso sí, tendría que escuchar
por otro puerto.
Nosotros vamos a trabajar con un único cluster, que se pone en marcha de forma automática cuando
iniciamos el servidor.
2 Creación, modificación y eliminación de Bases de
Tanto si creamos la base de datos desde psql como si lo hacemos desde una herramienta gráfica ,
el resultado final es una sentencia SQL que dará origen a la nueva Base de Datos. La sintaxis de
esta sentencia es la siguiente:
CREATE DATABASE nombre
[ [ WITH ] [ OWNER [=] nombre_propietario ]
[ TEMPLATE [=] template ]
[ ENCODING [=] encoding ]
[ TABLESPACE [=] tablespace ]
[ CONNECTION LIMIT [=] num_conn ] ]
En principio el propietario de la Base de Datos será el usuario que la crea. Para crear una Base de
datos, Postgres hace una copia de una base de datos existente, si no especificamos nada utilizará una
plantilla vacía (template0 o template1). También se puede especificar el Tablespace donde se
guardarán los objetos de la Base de Datos.
Los parámetros que no se indiquen expresamente en la consulta tomarán el valor por defecto. Así
pues la sentencia más simple de creación de BD es:
CREATE DATABASE prueba;
Para modificar una base de datos se utiliza la sentencia:
ALTER DATABASE
Para eliminar una base de datos se utiliza la sentencia



DROP DATABASE
A continuación tienes un vídeo donde puedes ver la creación/modificación/borrado de BD.
https://www.youtube.com/watch?v=0CeFpgG1op4
Recuerda hacerlo desde el cliente.

## 3. Esquemas

En una Base de Datos, como mínimo hay un esquema. La mayor parte de las veces este esquema
será public (pero no siempre tiene que ser así). En cada esquema se pueden crear diferentes objetos:
tablas, vistas, funciones, triggers, etc.
Nosotros vamos a utilizar el esquema public que se crea por defecto y no vamos a profundizar en
este tema.

## 4. Tablespaces

De forma lógica los objetos de todos los usuarios se organizan en Bases de Datos y dentro de éstas
en Esquemas. Dentro de los esquemas tenemos las tablas, funciones, triggers, etc.
Pero de forma física, todos los datos se guardan en el mismo lugar. En la instalación automática en
Ubuntu, este lugar es:
/var/lib/postgresql/16/main
Para  poder  guardar  los  datos  físicamente  de  una  forma  ordenada  disponemos  de  los
TABLESPACES. Literalmente son espacios de tablas, lugares donde poder guardar las tablas y
otros objetos. De esta forma podemos añadir tablespaces y asignar un tablespace diferente para cada
usuario. Así mejoraríamos la seguridad, los backups, etc.
Pero todo esto es a nivel físico. Un usuario no notará la diferencia entre tener guardado un objeto en
un tablespace o en otro.
La sintaxis es la siguiente:
CREATE TABLESPACE nombre [ OWNER usuari ] LOCATION 'directorio'
donde el nombre del tablespace no puede empezar por  pg_ ya que está reservado para los
tablespaces del sistema.
Si no lo indicamos expresamente, el propietario del tablespace será el usuario que lo crea. El
directorio donde se crea el tablespace tiene que existir, estar vacío y su propietario tiene que ser el
superusuario (postgres).
5 Ejercicios
Realiza los siguientes ejercicios y adjunta las capturas de pantalla necesarias.




### Ejercicio 2.5

Crea un tablespace nuevo que se llame prueba. Adjunta la sentencia SQL.
- En la ruta /var/lib/postgresql/16/main/data2
- Recuerda crear el directorio y cambiar el propietario y el grupo.

### Ejercicio 2.6

Crea una BD que se llame geo2 igual que la base de datos geo y que utilice el tablespace del
ejercicio anterior. El propietario tiene que ser usu2.
Adjunta la sentencia SQL que se genera.

### Ejercicio 2.7

Haz que el propietario de geo2 sea usu1.
Adjunta la sentencia SQL que se genera.
