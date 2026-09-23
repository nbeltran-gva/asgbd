# 2. PostgreSQL: estructura y almacenamiento


## 1. Introducción

Definido de forma rápida, PostgreSQL es un SGBD Relacional que incorpora conceptos de objetos.
Al ser un SGBD relacional, significa que soporta perfectamente la integridad referencial, las
restricciones, disparadores o triggers, transacciones, etc. Además ofrece soporte prácticamente total
al estandar SQL 92 / SQL 3.
Intenta ser muy flexible permitiendo tipos de datos nuevos creados por el usuario, operadores
nuevos, etc.
Y sobretodo, incorpora también conceptos de BD orientadas a objetos. No es un SGBD
completamente orientado a objetos, sino que incorpora algunos conceptos como la herencia y las
clases.
El origen de PostgreSQL fue un proyecto de la Universidad de Berkeley. El nombre de Postgres se
creó en 1986. En 1987 se lanzó la primera versión que fue mejorando hasta llegar a la versión 4. En
1994 se lanzó un “descendiente” de Postgres de dominio público y código abierto que e denominó
Postgre95. Este nombre no podía tener futuro y en 1996 se cambió a PostgreSQL. La primera
versión de PostgreSQL fue la 6.0 para continuar con la secuencia del proyecto original de la
Universidad.
En Linux, o mejor dicho, en el mundo del software libre, e utilizan principalmente dos SGBD:
PostgreSQL  y MySQL:
- PostgreSQL se puede definir como “más serio”, y, aunque no llega a ser tan rápido como
MySQL, puede ser perfectamente un SGBD para sitios o empresas realmente grandes y que
necesiten entornos seguros.
- En MySQL se intenta, por encima de todo, que sea muy rápido y que gaste pocos recursos.
Para conseguir esto incluso sacrifica (en algunos casos) cosas impensables como la
integridad referencial, transacciones, etc. MySQL se ha impuesto en la creación de páginas
web (junto con Apache, PHP y Perl) donde se busca sobretodo la velocidad.
Existen muchas comparativas en Internet de SGBDs, y normalmente, la conclusión no es que uno
sea mejor que otro, sino que depende de lo que se quiera hacer. ¿Qué necesitamos, velocidad o
potencia?




## 2. Estructura y almacenamiento


### 2.1. Arquitectura básica

PostgreSQL utiliza un modelo cliente-servidor, donde los clientes y el servidor pueden estar en
distintos hosts. La comunicación entre ambos se realiza via TCP/IP. PostgreSQL puede gestionar
múltiples conexiones desde un solo cliente. El mecanismo de gestión de conexiones se realiza
mediante forking de procesos, es decir, por cada nueva conexión el sistema operativo genera un
nuevo proceso cuya vida dura desde la apertura de la conexión hasta su finalización.

### 2.2. Subsistemas PostgreSQL

Siguiendo las directrices de un modelo cliente-servidor, PostgreSQL puede dividirse en 4
subsistemas: gestor de procesos, procesador de consultas o  queries, utilidades y gestor del
almacenamiento. A continuación se muestra una figura que describe la arquitectura general de
PostgreSQL:



El gestor de procesos  se encarga de gestionar las conexiones de los distintos clientes, haciendo
forking de procesos y terminándolos cuando el cliente haya finalizado de operar.
La gestión de las consultas es la tarea principal del procesador de consultas . Cuando un cliente
envía una consulta/query a PostgreSQL, la query es analizada, se genera un plan de ejecución y
finalmente la query se ejecuta y se devuelven los resultados al cliente.
El subsistema utilities proporciona métodos de bajo nivel para el mantenimiento de la base de datos
como, liberar espacio de almacenamiento, actualización de estadísticas del sistema, etc.
Por último el gestor de almacenamiento  gestiona la memoria cache, los buffers de disco, o la
gestión del espacio de almacenamiento.

### 2.3. Componentes de PostgreSQL

Entender la lógica de la organización de los componentes de PostgreSQL ayuda a comprender como
son las relaciones e interacciones entre los objetos que componen una base de datos.
Roles
Los roles pertenecen a una instancia de PostgreSQL y no a una base de datos. Un rol poder ser un
usuario o un grupo de usuarios. El concepto de rol aglutina los conceptos de usuarios y grupos,
como en Unix. Las versiones antiguas de PostgreSQL mantienen este paradigma, que ha cambiado
en las versiones actuales. Es por ello que los comandos CREATE USER y CREATE GROUP se
mantienen por retrocompatibilidad, pero en las versiones nuevas se recomienda utilizar CREATE
ROLE.
Cuando se crea una instancia de PostgreSQL, por defecto se crea el rol de superusuario postgres,
con el cual podemos crear y modificar otros roles. Un rol puede ser miembro de otro rol, para
simplificar el acceso y gestión de los permisos. Por ejemplo, podríamos crear un rol con el atributo
no login, también conocido como group y permitirle que pueda acceder a determinados objetos de
nuestra base de datos, de manera que si necesitásemos que un nuevo rol tuviese los mismos
permisos que el anterior rol que creamos, simplemente con asignarle el grupo al nuevo rol sería
suficiente.
### Esquemas
Una base de datos PostgreSQL podría ser considerada como un contenedor para un esquema de
bases de datos. Los esquemas se utilizan para organizar los objetos de una base de datos . Un
esquema contiene todos los objetos de base de datos, como tablas, vistas, funciones, índices,
secuencias, triggers, etc. Los objetos de una base de datos, pueden ser reusados entre distintos
esquemas sin que haya conflictos.
Por defecto, siempre hay un esquema denominado public en cada base de datos. Todos los usuarios,
por defecto, pueden acceder a este esquema implícitamente.


### Tablespaces
Un espacio de tablas o tablespace es un espacio de almacenamiento para objetos o bases de datos.
Los tablespaces son utilizados por los administradores con distintos propósitos:
a) Mantenimiento: si el disco duro, donde se ha creado la instancia de PostgreSQL, se queda sin
espacio se puede crear un tablespace en otro disco o partición.
b) Optimización: Se pueden crear tablespaces en discos SSD para un acceso más rápido a los datos
más críticos y otros en discos más lentos que tengan datos a los cuales se accede con menos
frecuencia.