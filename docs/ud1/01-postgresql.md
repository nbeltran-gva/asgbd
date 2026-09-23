# 2. PostgreSQL: estructura y almacenamiento

## 1. Introducción

PostgreSQL es un sistema gestor de bases de datos relacional, muy utilizado en entornos profesionales por su estabilidad, seguridad y capacidad de gestión. Además, incorpora algunas características propias de los sistemas orientados a objetos, aunque no se trata de un SGBD puramente orientado a objetos.

Su principal ventaja es que combina un modelo relacional sólido con funcionalidades avanzadas, como:

- integridad referencial;
- restricciones;
- disparadores o triggers;
- transacciones;
- soporte del estándar SQL;
- tipos de datos personalizados.

PostgreSQL nació como un proyecto universitario en Berkeley y, con el paso del tiempo, se convirtió en un sistema open source muy importante. Su historia comenzó en 1986 con el proyecto Postgres, y en 1996 pasó a llamarse PostgreSQL. A lo largo de los años fue evolucionando hasta convertirse en una solución madura, estable y muy utilizada tanto en entornos pequeños como en instalaciones grandes y críticas.

Su evolución se ha basado en mejorar la robustez, la seguridad, la integridad de los datos y la capacidad de gestión avanzada, factores que lo convierten en una opción muy sólida para la administración de bases de datos.

## 2. Estructura y almacenamiento

### 2.1. Arquitectura básica

PostgreSQL sigue un modelo cliente-servidor. Esto significa que el servidor es el responsable de gestionar los datos, mientras que los clientes envían consultas y reciben los resultados.

La comunicación entre cliente y servidor se realiza normalmente mediante TCP/IP. Además, PostgreSQL puede gestionar varias conexiones simultáneas desde distintos clientes. Para cada conexión, el sistema crea un proceso del sistema operativo que mantiene la sesión activa hasta que el cliente termina la operación.

### 2.2. Subsistemas de PostgreSQL

En términos generales, PostgreSQL puede dividirse en cuatro subsistemas principales:

- **Gestor de procesos**: controla las conexiones de los clientes. *Por ejemplo, cuando una aplicación se conecta al servidor, PostgreSQL crea un proceso para atender esa sesión.*
- **Procesador de consultas**: analiza las sentencias SQL, genera un plan de ejecución y devuelve los resultados. *Por ejemplo, decide si una consulta debe utilizar un índice para localizar más rápido los registros.*
- **Utilidades**: realizan tareas de mantenimiento y administración. *Por ejemplo, `pg_dump` permite realizar una copia lógica de una base de datos y `psql` permite trabajar con ella desde la línea de comandos.*
- **Gestor de almacenamiento**: controla la caché, los buffers y el espacio físico en disco. *Por ejemplo, administra la escritura de los cambios realizados en una tabla y la recuperación de la información almacenada.*

Cada uno de estos subsistemas tiene una función concreta dentro del funcionamiento global del SGBD.

### 2.3. Componentes principales

Entender la lógica de la organización de los componentes de PostgreSQL ayuda a comprender como son las relaciones e interacciones entre los objetos que componen una base de datos.

#### Roles

Los roles son los usuarios o grupos de usuarios que pueden acceder a PostgreSQL. Un rol puede representar a una persona o a un conjunto de permisos compartidos.

!!! tip
    En PostgreSQL, el superusuario por defecto es `postgres`.

Los roles se gestionan a nivel de instancia del SGBD, no dentro de una base de datos concreta. Esto quiere decir que un usuario puede tener acceso a varias bases de datos si se le conceden los permisos adecuados.

Además, un rol puede pertenecer a otro rol para facilitar la administración de permisos. Esta idea es bastante útil cuando se quiere dar el mismo conjunto de permisos a varios usuarios.

#### Esquemas

Una base de datos PostgreSQL puede organizar los objetos en esquemas. Un esquema es un contenedor donde se almacenan elementos como tablas, vistas, funciones, índices, secuencias y disparadores (triggers).

!!! tip
    Por defecto, cada base de datos incluye el esquema `public`. 

Este esquema se utiliza normalmente para guardar los objetos creados por defecto, aunque también es posible crear otros esquemas para organizar mejor la información.

La ventaja de los esquemas es que permiten separar los objetos de la base de datos y mantener una estructura más ordenada.

#### Tablespaces

Los tablespaces permiten ubicar físicamente los datos de una base de datos o de ciertos objetos en discos o particiones distintas del principal. Se utilizan para organizar el almacenamiento según necesidades de rendimiento, capacidad o mantenimiento.

!!! exemple
    Por ejemplo, un administrador puede guardar una base de datos crítica en un disco más rápido o separar archivos de datos e índices en unidades distintas. Esto resulta útil cuando la carga de trabajo es elevada o cuando conviene optimizar el acceso a ciertos objetos.

Los tablespaces no cambian la lógica de la base de datos, pero sí modifican su ubicación física en el sistema de archivos.

Su uso suele estar relacionado con dos objetivos principales:

- Mantenimiento: si el disco principal se queda sin espacio, se puede crear un tablespace en otra partición o disco;
- Optimización: se pueden ubicar en discos SSD los datos más críticos y en discos más lentos los datos que se consultan con menos frecuencia.

De este modo, el administrador tiene mayor flexibilidad para controlar el rendimiento y la organización del almacenamiento.

## 3. Comparación breve con otro SGBD

En el entorno del software libre, PostgreSQL y MySQL son dos de los sistemas más conocidos. 

- PostgreSQL suele destacarse por su robustez, integridad y capacidad de gestión avanzada. 
- MySQL, en cambio, suele priorizar la velocidad y la simplicidad en entornos web.

No existe un SGBD “mejor” en todos los casos. La elección depende del tipo de proyecto, del volumen de datos, de la necesidad de seguridad y de la carga de trabajo que vaya a soportar el sistema.
