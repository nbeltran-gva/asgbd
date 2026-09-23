# 1. Arquitectura de un SGBD

Arquitectura de un Sistema Gestor de Bases de Datos
Índice de contenidos:
1.Arquitectura en niveles de las bases de datos.
2.Componentes de una base de datos.
3.Modelos de explotación de las bases de datos.
4.Tareas de un DBA.



1. Arquitectura en niveles de las bases de datos.
El cómite ANSI/SPARC define en 1975 una arquitectura para los sistemas gestores de
bases de datos.
Consta de tres niveles:
- Nivel externo o de visión: Se compone de las distintas aplicaciones basadas en
vistas de la base de datos. Es lo que ven los usuarios finales.
- Nivel conceptual: Se compone de las distintas tablas con sus atributos. Es el nivel
que conocen los programadores.
- Nivel interno o físico: Define qué discos y archivos componen la base de datos y
qué hay en cada uno de ellos. Sólo acceden a este nivel los administradores.
Veamos esta arquitectura con una imagen:
La ventaja de esta arquitectura en niveles es que proporciona independencia lógica y
física de los datos respecto a las aplicaciones:
- Independencia lógica: Se pueden realizar cambios en el nivel conceptual (añadir
tablas o atributos) sin que sea necesario reescribir todas las aplicaciones.
- Independencia física: Es posible modificar la ubicación de los ficheros que
contienen los datos sin que se vean afectadas las aplicaciones.



Arquitectura de un Sistema Gestor de BDIES El Caminàs

## 2. Componentes de una base de datos

Generalmente los SGBD se componen de varios elementos bien diferenciados entre ellos:
- Lenguajes.
- El diccionario de datos.
- Mecanismos de seguridad e integridad.
- Factor humano.
Veamos con detalle cada uno de ellos.
2.1.- Lenguajes.
Los lenguajes del SGBD nos permiten crear las tablas, realizar las consultas sobre los
datos, crear diferentes restricciones y en general se permiten realizar todas las
operaciones posibles sobre el sistema gestor. Entre otras tareas deben permitir:
- Crear la estructura de la base de datos, incluyendo todos los objetos que puede
incluir la misma (tablas, vistas, usuarios, procedimientos, funciones, triggers, etc.).
Este tipo de operaciones corresponden al Lenguaje de Definición de datos (DDL).
- Consultar y manipular la información almacenada en la base de datos. Sentencias
SELECT, UPDATE, INSERT, DELETE, etc. Este tipo de operaciones corresponden
al Lenguaje de Manipulación de Datos (DML).
- Asignar privilegios a usuarios, confirmar o abortar transacciones, etc. Este tipo de
operaciones corresponden al Lenguaje de Control de Datos (DCL).
- En algunos casos, también incluyen un lenguaje de cuarta generación (4GL) para
RAD (desarrollo rápido de aplicaciones). Ej: Asistentes de Access, Oracle
Developer Suite, etc.
2.2.- El diccionario de datos.
El diccionario de datos contiene toda la información sobre los datos de la BD, es decir, los
metadatos (datos acerca de los datos) de la base de datos, esto es:
- La definición de todos los objetos existentes en la base de datos: tablas con sus
columnas, vistas, procedimientos, triggers, índices, etc...
- La ubicación física de los objetos y el espacio asignado a los mismos.
- Los privilegios y roles asignados a los usuarios.



Arquitectura de un Sistema Gestor de BDIES El Caminàs
- Las restricciones de las tablas.
- Estadísticas de uso de la base de datos.
- Información del consumo de recursos actual.
- Información de los usuarios.
- Y un larguísimo etcétera...
2.3.- Mecanismos de seguridad e integridad.
Un SGBD debe proporcionar utilidades que permitan:
- La realización de copias de seguridad de los datos y la restauración de las mismas.
- Garantizar la protección de los datos ante accesos no autorizados.
- Implantar restricciones de integridad de los datos para evitar daños accidentales de
los datos.
- Recuperar la base de datos hasta un estado consistente en  caso de error del
sistema o cualquier otro imprevisto.
- Controlar el acceso concurrente de los usuarios para evitar errores de integridad.
2.4.- El factor humano.
Un SGBD siempre va a tener distintas categorías de usuarios:
- Usuarios finales:  Podrán acceder a la información sobre la que le hayan sido
concedidos privilegios.
- Programadores: Realizan aplicaciones sobre los objetos de la base de datos para
facilitar su trabajo a los usuarios finales.
- Administradores o DBAs:  Garantizan el correcto funcionamiento de la base de
datos y gestionan todos sus recursos. Tienen el nivel más alto de privilegios y
responsabilidades legales en caso de que los datos tengan algún tipo de
protección. Su objetivo es que la base de datos está siempre disponible y con un
rendimiento óptimo.
En este módulo nos vamos a centrar en realizar tareas propias del DBA.



Arquitectura de un Sistema Gestor de BDIES El Caminàs

## 3. Modelos de explotación de las bases de datos

Hay multitud de tipos de Sistemas gestores de Base de Datos. Cada empresa,
universidad o corporación necesita almacenar sus datos y acceder a ellos de una forma
diferente. Es por eso que existen diferentes Sistemas gestores De Bases de Datos que se
pueden utilizar o implantar de diferentes formas:
- Monopuesto: La base de datos se encuentra en una máquina y es explotada
desde la misma máquina. Típico en SGBD de escritorio: Access.
- Cliente/Servidor: El SGBD está en una máquina pero se accede a él desde
muchas usando, por lo general, distintas aplicaciones.
- BD distribuida: La base de datos está en distintas máquinas que trabajan
colaborativamente para dar servicio a los clientes.
- Tres capas: Cliente → Servidor web → Servidor de BD.
En este módulo vamos a utilizar mayoritariamente el modelo cliente/servidor y veremos en
el último tema del módulo algunas características y aspectos de los Sistemas gestores de
bases de datos distribuidos.



Arquitectura de un Sistema Gestor de BDIES El Caminàs

## 4. Tareas de un DBA

Como ya hemos explicado anteriormente, el DBA (o Administrador de la Base de Datos)
es el usuario con más privilegios y por tanto el más importante del sistema gestor.
Entre las tareas que debe realizar el DBA se encuentran las siguientes:
- Decidir el SGBD idóneo, instalarlo y configurarlo inicialmente.
- Supervisar diseño lógico de la BD.
- Realizar diseño físico de la BD: Estructura de almacenamiento.
- Crear y mantener cuentas de usuario.
- Colaborar en la formación de usuarios y programadores.
- Detectar y resolver problemas de rendimiento de la BD usando herramientas de
monitorización.
- Realizar copias de seguridad, migraciones, importaciones y exportaciones,
auditorias de seguridad, etc...
- Recuperar instancias dañadas.
- Etc.
En este módulo realizaremos la mayoría de las tareas que debe conocer un DBA en los
sistemas gestores de PostgreSQL y MySQL.
Ten en cuenta que el módulo sólo consta de 3 horas semanales, así que algunas de esas
tareas las veremos de una forma muy superficial.
