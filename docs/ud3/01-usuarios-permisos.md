# 1. Usuarios, roles y permisos



## 1. Introducción

Para poder proteger los datos entre los múltiples usuarios que acceden a una Base de Datos, los
SGBD utilizan la autenticación por usuarios.
En principio cada usuario sólo puede acceder a sus tablas (las crea y es el propietario). Pero también
se pueden dar permisos. Así pues, un usuario puede permitir la utilización de una tabla a otro
usuario, dándole diferentes grados de acceso: sólo consultar, o insertar, borrar, actualizar, o todos
los permisos a la vez, incluso que pueda otorgar permisos a otros usuarios.
Cuando muchos usuarios van a tener permisos similares es conveniente el uso de grupos de
usuarios. Así por ejemplo, si damos permiso de acceso a una tabla a un grupo de usuarios es como
si hubiéramos dado permiso a todos los usuarios de ese grupo facilitando mucho el trabajo del
DBA.
A partir de la versión 8.1 de postgres tanto los usuarios como los grupos se gestionan con el
concepto rol (ROLE). La diferencia entre ellos es que unos se pueden conectar (login) y son los
roles de entrada (equivalentes a los usuarios) y otros no se pueden conectar  (nologin) y son los
roles de grupo.
En la figura anterior sabemos que se está creando un rol de usuario porque tiene activada la opción
Can login? a YES. Si tuviera la opción Can login? a NO entonces sería un grupo.
También vemos que no puede crear otros roles ni puede crear BD.

## 2 Gestión de Roles. Utilización como usuarios

Un rol es una entidad capaz de recoger permisos y privilegios. Uno de esos permisos es el de
conexión (login). Podemos decir que los roles con el permiso LOGIN son los usuarios . Además
del permiso de conexión también puede tener permisos para crear tablas, vistas, bases de datos,
utilizarlos para hacer consultas o actualizaciones, etc.



Los roles no están incluidos en ninguna BD particular, son globales a toda la instalación
PostgreSQL. Tanto si pueden hacer login como si no, todos los roles se guardan el la tabla
pg_authid. También existen unas vistas de esta tabla para facilitar la consulta y administración:
- pg_roles, contiene todos los roles.
- pg_user, contiene los usuarios, es decir, los roles que pueden hacer login.
- pg_shadow, con contraseñas.
- pg_group, los roles que no pueden hacer login.
Por tanto, la primera forma de manejar los roles sería manipulando directamente las tablas o las
vistas anteriores, aunque esto no es muy recomendable.
Nosotros utilizaremos sentencias SQL para la gestión de los roles y también podremos gestionarlos
de forma gráfica con pgAdmin.
psql: CREATE ROLE, ALTER ROLE, DROP ROLE
Estas sentencias permite gestionar usuarios (login) y grupos (nologin). Tienen muchas opciones y
puedes consultar su sintaxis en la ayuda de PostgreSQL.
A continuación tienes algunos ejemplos sencillos de uso de estas sentencias:
Crea el usuario (login) geo1 sin contraseña:
CREATE ROLE geo1 LOGIN;
Crea el usuario (login) geo2 con la contraseña prueba:
CREATE ROLE geo2 LOGIN PASSWORD 'prueba2';
Modifica el rol geo1 y le asigna la contraseña prueba:
ALTER ROLE geo1 PASSWORD 'prueba1';
Modifica el rol geo1 y permite un máximo de 3 conexiones simultáneas:
ALTER ROLE geo1 CONNECTION LIMIT 3;
Elimina el rol geo:
DROP ROLE geo2;

## Herramientas Gráficas: pgAdmin

Desde pgadmin la creación, modificación y borrado de roles es muy sencilla. Además al finalizar la
creación del rol podemos ver la sentencia SQL que se ha ejecutado para la creación del mismo. A
continuación tienes un vídeo donde puedes ver la creación de roles con pgAdmin.
https://youtu.be/D57uSCKvCro
Debes conectarte desde el cliente para poder seguir las instrucciones del vídeo.

## 3. Gestión de roles como grupos

Un grupo es un rol que no se puede conectar (nologin). Los roles con el permiso NOLOGIN son
los grupos. Los grupos tienen una serie de permisos sobre tablas, bases de datos, etc. Un rol de
grupo se utiliza para que otros roles (en principio usuarios) puedan heredar sus permisos y así
facilitar el trabajo del DBA.
psql: CREATE ROLE, ALTER ROLE, DROP ROLE
La forma de crear un rol de grupo es la misma que para crear usuarios con la particularidad de que
siempre llevarán la opción NOLOGIN
Ejemplos:
Crea el grupo grupo1 sin usuarios
CREATE ROLE grupo1 NOLOGIN;
Crea el grupo2 y “mete” a geo1 en él.
CREATE ROLE grupo2 NOLOGIN ROLE geo1;
Herramientas Gráficas: pgAdmin
Igual que en el apartado anterior. Creamos los grupos con la opción NOLOGIN.

## 4. Permisos

Una vez que sabemos como se crean los usuarios y los grupos vamos a ver que tipo de privilegios y
permisos se les puede asignar. Los privilegios y permisos se pueden asignar desde psql mediante
sentencias SQL o también de una forma mucho más cómoda desde pgAdmin. Tanto si lo hacemos
por comandos como si lo hacemos de forma gráfica, al final se creará una sentencia SQL  que al
ejecutarse en la BD es la que finalmente otorgará o denegará los permisos.
psql: GRANT y REVOKE
Para dar permisos se utiliza la sentencia GRANT. Se pueden dar tres tipos de permisos.
Otorgar permisos
La sintaxis es:
GRANT { {SELECT|INSERT|UPDATE|DELETE|REFERENCES|TRIGGER} [,...] | ALL
[ PRIVILEGES ] }
ON {[ TABLE ] nombre_tabla [, ...] | ALL TABLES IN SCHEMA schema_name }
TO { nombre_usuario | GROUP nombre_grupo | PUBLIC } [, ...]
[ WITH GRANT OPTION ]



Sobre una tabla se pueden dar permisos sólo para seleccionar, o insertar, o modificar, o borrar, o
crear una clave externa, o crear un trigger, … o todos ( ALL ).
Se pueden dar permisos a un usuario (o más) o a un grupo, o a PUBLIC, es decir, todos los
usuarios.
Si ponemos la opción WITH GRANT OPTION, los usuarios a los que hemos dado permisos podrán
otorgar estos permisos a otros usuarios.
Cuando damos permiso a un grupo (al que pertenecen una serie de miembros), estos heredarán los
permisos únicamente si tienen el privilegio INHERIT.
Ejemplo:
GRANT SELECT, UPDATE ON comarques, poblacions TO GROUP g_geo;
Para hacer miembro de un rol de grupo a otro rol (normalmente un usuario)
GRANT rol_grupo TO rol_usuario;
Para poder otorgar permisos en la base de datos:
GRANT { { CREATE | CONNECT } [,...] | ALL [ PRIVILEGES ] }
ON DATABASE database_name [, ...]
TO { [ GROUP ] role_name | PUBLIC } [, ...] [ WITH GRANT OPTION ]
- CREATE: para crear nuevos esquemas.
- CONNECT: para permitir a un rol conectarse a la base de datos.
Para poder otorgar permisos en el esquema:
GRANT { { CREATE | USAGE } [,...] | ALL [ PRIVILEGES ] }
ON SCHEMA schema_name [, ...];
TO { [ GROUP ] role_name | PUBLIC } [, ...] [ WITH GRANT OPTION ]
- CREATE: para crear nuevos objetos en el esquema.
- USAGE: puede utilizar los objetos del esquema si tiene acceso a la base de datos.
Quitar permisos
Para quitar permisos se utiliza la sentencia REVOKE.
La sintaxis es:
REVOKE [ GRANT OPTION FOR ] { {SELECT|INSERT|UPDATE|DELETE|REFERENCES|TRIGGER}
[,...] |
ALL [ PRIVILEGES ] }
ON [ TABLE ] nombre_tabla [, ...]
FROM { nombre_usuario | GROUP nombre_grupo | PUBLIC } [, ...]
[ CASCADE | RESTRICT ]



Hemos de tener en cuenta que sólo el usuario que ha otorgado los permisos (o el superusuario)
puede quitar (revoke) permisos. En el caso CASCADE se quitan los permisos a todos los usuarios
que los han ido pasando por tener la opción WITH GRANT OPTION (RESTRICT es la opción por
defecto).
Para quitar un usuario de un grupo:
REVOKE rol_grupo FROM rol_usuario;
5 Herramientas Gráficas: pgAdmin
A continuación tienes un vídeo donde puedes ver como se otorgan y se quitan permisos de forma
gráfica.
https://youtu.be/dZz1JMuTe0E
Recuerda que esto debes hacerlo desde el cliente.
6 Ejemplo: Creamos base de datos y otorgamos
permisos a otro usuario
Si el usuario crea la base de datos, tendrá todos los privilegios por defecto de ésta. Pero podría darse
el caso que este quisiera darle acceso a otro usuario. A continuación explicamos cómo dar acceso a
otro usuario.
Lo siguiente lo haremos todo desde el usuario postgres (es decir, el superusuario) utilizando psql:
Creamos usuario al que pertenecerá la base de datos:
CREATE ROLE usudb LOGIN PASSWORD 'usudb';
Creamos base de datos:
CREATE DATABASE usudb;
Nos conectamos a la base de datos usudb:
\c usudb
Creamos tabla:
CREATE TABLE Beatles (id SERIAL PRIMARY KEY, name VARCHAR(100), height DECIMAL,
weight DECIMAL, instrument VARCHAR(100), birth_place VARCHAR(100), active_years
VARCHAR(100) );
Insertamos datos:
INSERT INTO Beatles (name, height, weight, instrument, birth_place,
active_years) VALUES ('John Lennon', 179, 70, 'Vocals, Guitar', 'Liverpool,
England', '1960-1970'), ('Paul McCartney', 180, 68, 'Vocals, Bass', 'Liverpool,
England', '1960-1970'), ('George Harrison', 178, 68, 'Vocals, Guitar',
'Liverpool, England', '1960-1970'), ('Ringo Starr', 173, 65, 'Vocals, Drums',
'Liverpool, England', '1962-1970');
Damos permiso para que usudb pueda conectarse a la base de datos:



GRANT CONNECT ON DATABASE usudb TO usudb;
Damos permiso para que usudb pueda utilizar el esquema:
GRANT USAGE, CREATE ON SCHEMA public TO usudb;
Damos permiso para que usudb tenga todos los privilegios sobre todas las tablas:
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO usudb;
Damos permiso para que usudb pueda utilizar secuencias (la clave primaria usa secuencias):
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO usudb;
7 Ejercicios
Realiza los siguientes ejercicios y adjunta las capturas de pantalla necesarias.

### Ejercicio 2.1

Desde pgAdmin. Crea 3 usuarios (usu1, usu2 y usu3) con las siguientes características:
- Con el mismo password que su nombre de usuario.
- La cuenta caduca el 31 de diciembre de este año.
- Límite de conexiones 2.
- Pueden crear bases de datos y roles.
- El resto de parámetros tomará los valores por defecto.
Adjunta la sentencia SQL de creación de uno de los usuarios anteriores.
Desde pgAdmin. Añade la posibilidad de que usu1 puede consultar la tabla instituts. Adjunta la
sentencia SQL.
Realiza las comprobaciones con psql (desde la Ubuntu Mate) para ver que todo funciona
correctamente. Para crear una base de datos puedes utilizar la sentencia: CREATE DATABASE
nombre_base_de_datos. Adjunta capturas.

### Ejercicio 2.2

Desde pgAdmin. Crea el grupo1 con las siguientes características:
- Puede consultar la tabla instituts.
- Puede consultar la tabla poblacions.
- Puede consultar y añadir datos en la tabla comarques (no modificar ni eliminar).
- Puede otorgar sus permisos de la tabla comarques a otros usuarios.
Adjunta la sentencia SQL de creación del grupo.
Haz que usu1 y usu2 sean miembros de este grupo. Adjunta las sentencias SQL.
Realiza las comprobaciones con psql (desde la Ubuntu Mate) para ver que todo funciona
correctamente (comprueba también que usu3 no tiene permisos del grupo1). Adjunta capturas.




### Ejercicio 2.3

Desde psql. Realiza los pasos de la sección 6 (Ejemplo: Creamos base de datos y otorgamos
permisos a otro usuario) pero con otro usuario, otra base de datos y otra tabla inventada. Muestra
los privilegios que el usuario tiene sobre la tabla.

### Ejercicio 2.4

Desde psql ejecuta estas dos consultas para visualizar estas vistas:
SELECT * FROM pg_user;
SELECT * FROM pg_group;
Ahora contesta a esta pregunta. ¿Qué información podemos obtener del campo grolist?
