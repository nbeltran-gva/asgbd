# 0. Introducción

## ¿Qué es un SGBD?

Un Sistema Gestor de Bases de Datos (SGBD) es un conjunto de programas que permiten almacenar, modificar, consultar y gestionar la información de una base de datos de forma segura, ordenada y eficiente.

En inglés, esta idea se conoce como *DBMS (Database Management System)*. Cuando el sistema es relacional, también se suele hablar de RDBMS.

Un SGBD no solo almacena información: también proporciona herramientas para:

- Definir la estructura de los datos.
- Insertar, actualizar y eliminar registros.
- Consultar la información mediante SQL.
- Mantener la integridad y la consistencia de los datos.
- Controlar la concurrencia de varios usuarios.
- Recuperar datos ante fallos o errores.

## Funciones principales de un SGBD

Un SGBD cumple varias funciones esenciales:

- DDL: define la estructura de la base de datos.
- DML: manipula los datos almacenados.
- DCL: controla permisos y privilegios.
- TCL: gestiona transacciones, confirmaciones y anulaciones.
- Integridad: garantiza que los datos sigan reglas y restricciones.
- Seguridad: controla quién puede acceder a cada información.
- Recuperación: permite restaurar la información si ocurre un problema.
- Independencia lógica y física: separa cómo se ve la información de cómo se almacena realmente.

## Clasificaciones de los SGBD

Los sistemas gestores de bases de datos pueden clasificarse según distintos criterios. 

### 1. Según el número de usuarios

- Monousuario: diseñados para que un solo usuario los utilice a la vez. Ejemplo: Access en entornos pequeños.
- Multiusuario: permiten que varios usuarios accedan simultáneamente. Ejemplos: MySQL, PostgreSQL, Oracle, SQL Server.

### 2. Según la arquitectura

- Centralizados: toda la gestión de la base de datos se realiza en un único servidor.
- Distribuidos: los datos se reparten entre varios servidores o nodos.
- Cliente-servidor: la aplicación cliente se conecta a un servidor que procesa la información.
- En la nube: se gestionan en infraestructura cloud, con alta disponibilidad y escalabilidad.

### 3. Según el modelo de datos

- Relacionales: organizan la información en tablas con filas y columnas. Ejemplos: PostgreSQL, MySQL, Oracle.
- No relacionales: almacenan datos en estructuras distintas a las tablas, como documentos, grafos o clave-valor. Ejemplos: MongoDB, Redis, Neo4j.
- SGBD Documentales: almacenan datos en documentos JSON o BSON. Ejemplo: MongoDB.
-  Grafos: modelan relaciones entre datos mediante nodos y aristas. Ejemplo: Neo4j.
- En memoria: guardan la información directamente en RAM para mayor velocidad. Ejemplo: Redis.
-  Orientados a objetos: integran conceptos propios de la programación orientada a objetos. Ejemplos: db4o, ObjectDB.
- Temporales: están optimizados para trabar con datos cronológicos. Ejemplo: TimescaleDB.

### 4. Según el propósito o carga de trabajo

- OLTP: orientados a transacciones rápidas y continuas. Ejemplos: MySQL, PostgreSQL.
- OLAP: orientados a análisis de grandes volúmenes de datos y consultas complejas. Ejemplos: BigQuery, Redshift.

## Factores para la elección del SGBD

La elección de un SGBD depende de las necesidades del proyecto y de los recursos disponibles. No existe un SGBD que sea el mejor para todas las situaciones. Algunos factores importantes son:

- **Modelo de datos:** debe adaptarse a la información que se quiere gestionar: relacional, documental, de grafos, clave-valor u otro.
- **Tipo de carga de trabajo:** hay que valorar si se realizarán principalmente transacciones (OLTP), análisis de datos (OLAP) o una combinación de ambos.
- **Volumen y crecimiento de los datos:** el SGBD debe poder almacenar la cantidad de información prevista y crecer sin perder rendimiento.
- **Rendimiento:** se deben considerar la velocidad de las consultas, el número de usuarios simultáneos y el tiempo de respuesta necesario.
- **Disponibilidad y recuperación:** en sistemas críticos son importantes la replicación, las copias de seguridad y la recuperación ante fallos.
- **Seguridad:** debe ofrecer autenticación, permisos, cifrado y mecanismos de auditoría adecuados.
- **Compatibilidad e integración:** conviene comprobar que sea compatible con los sistemas operativos, lenguajes, aplicaciones y herramientas que se utilizarán.
- **Coste y licencia:** hay que valorar el precio de las licencias, la infraestructura, el soporte y la formación del personal.
- **Administración y soporte:** también son importantes la documentación, la comunidad, el soporte técnico y la facilidad de mantenimiento.

Por ejemplo, para una aplicación bancaria se priorizarán la seguridad, la integridad, la disponibilidad y la gestión de transacciones. Para una aplicación que analiza grandes volúmenes de información, tendrán más peso el rendimiento analítico y la capacidad de escalado.

## Tipos de conexión a una Base de Datos

Para acceder a una base de datos, una aplicación o usuario debe establecer una conexión con el servidor del SGBD. Veamos los diferentes tipos de conexión, según el entorno y la forma de acceso:

### 1. Desde consola o línea de comandos

Se conecta directamente con herramientas como *psql, mysql o sqlplus*. Es muy útil para administradores y para ejecutar consultas rápidas desde terminal.

Ejemplos:

- psql -U usuario -d basededatos
- mysql -u usuario -p
- sqlplus usuario/password@servidor

### 2. Desde un entorno gráfico

Se usan herramientas visuales como *pgAdmin, DBeaver, phpMyAdmin o SQL Developer*. Son muy útiles para tareas administrativas y para usuarios que no trabajan con línea de comandos.

### 3. Desde un lenguaje de programación

Las aplicaciones se conectan a la base de datos mediante *drivers o APIs*, que permiten interactuar con el SGBD desde diferentes lenguajes de programación, como:

- JDBC para Java
- ODBC para aplicaciones multiplataforma
- psycopg2 para Python con PostgreSQL
- PDO para PHP
- SQLAlchemy para Python

Estas soluciones permiten que un programa envíe consultas SQL y procese los resultados.

### 4. Conexión local y remota

- Local: La aplicación y la base de datos se ejecutan en el mismo equipo o en la misma máquina. Es útil para pruebas, desarrollo o entornos pequeños.
- Remota: La aplicación se ejecuta en un equipo distinto al servidor de la base de datos. Se conecta a través de la red usando IP, nombre del host y puerto.
- TCP/IP: Es el tipo de conexión más habitual en entornos profesionales. El cliente utiliza el protocolo TCP/IP para conectarse al motor de base de datos mediante un puerto específico.
- SSH: en algunos entornos, la conexión se realiza de forma segura a través de SSH.

## Resumen

Un SGBD es el software que permite gestionar una base de datos de forma segura, eficiente y organizada. Su función principal es actuar como intermediario entre los datos y los usuarios o aplicaciones. Los SGBD se clasifican según el número de usuarios, la arquitectura, el modelo de datos y el tipo de carga de trabajo, y pueden conectarse desde consola, herramientas gráficas o desde lenguajes de programación.

---
---
!!! note "Actividad propuesta"
    Realiza la actividad **Ranking DBMS** disponible en [Actividades de la UD0](actividades.md#actividad-1-ranking-dbms).

