# Soluciones de las actividades de introducción

Estas soluciones son orientativas. El ranking, las versiones y algunas características pueden cambiar con el tiempo. Las respuestas deben justificarse utilizando documentación técnica fiable y deben relacionarse con el caso planteado.

## Actividad 1. Ranking de SGBD

### 1. ¿Cuántos SGBD hay en el ranking?

El número total debe consultarse directamente en [DB-Engines Ranking](https://db-engines.com/en/ranking), porque la clasificación se actualiza periódicamente. En la entrega se debe indicar la fecha de consulta.

### 2. De los cinco primeros, ¿cuántos son de código abierto?

La respuesta depende de la fecha de consulta y de los sistemas que ocupen las primeras posiciones. No hay que confundir que un producto tenga una edición gratuita con que sea completamente de código abierto. Se debe comprobar la licencia de cada sistema.

Como criterio general:

- PostgreSQL es un proyecto de código abierto con licencia PostgreSQL.
- MySQL dispone de una edición comunitaria de código abierto y otras ediciones comerciales.
- Oracle Database y Microsoft SQL Server son productos comerciales, aunque puedan ofrecer ediciones gratuitas o de evaluación.

### 3. ¿A qué empresa pertenecen los dos primeros?

La respuesta debe obtenerse del ranking y contrastarse con las páginas oficiales de cada producto. En la tabla final se deben diferenciar el nombre del proyecto, la organización que lo desarrolla y la empresa que lo comercializa o presta soporte.

### 4. Sistemas operativos compatibles

Una matriz orientativa para algunos SGBD conocidos es:

| SGBD | Linux | Windows | macOS | Nube o servicios gestionados |
|---|---:|---:|---:|---:|
| PostgreSQL | Sí | Sí | Sí | Sí |
| MySQL / MariaDB | Sí | Sí | Sí | Sí |
| Microsoft SQL Server | Sí | Sí | No como servidor principal tradicional | Sí |
| Oracle Database | Sí | Sí, según edición | No como servidor principal habitual | Sí |
|

La tabla definitiva debe elaborarse con los siete sistemas que aparezcan en el ranking consultado y con sus versiones actuales.

### 5. Modelos de datos

| SGBD | Modelo principal | Otros modelos o extensiones |
|---|---|---|
| PostgreSQL | Relacional | Tipos personalizados, JSON, espacial mediante PostGIS y búsqueda de texto |
| MySQL / MariaDB | Relacional | JSON y extensiones específicas del producto |
| Microsoft SQL Server | Relacional | XML, JSON, espacial y análisis |
| Oracle Database | Relacional | Objetos, XML, JSON, espacial y otros servicios especializados |
|

El modelo principal es el criterio más importante para esta actividad. Una base de datos relacional organiza la información en tablas relacionadas mediante claves y restricciones.

### 6. Recomendación para una pequeña empresa

Una recomendación razonable sería PostgreSQL o MariaDB, dependiendo de los requisitos concretos. Para una aplicación de ventas con clientes, productos, pedidos y facturación se propone PostgreSQL porque:

- utiliza un modelo relacional adecuado para datos estructurados;
- ofrece transacciones e integridad referencial;
- permite gestionar usuarios, roles y permisos;
- dispone de herramientas de administración;
- puede ejecutarse en Linux y Windows;
- no exige pagar una licencia por servidor.

La respuesta no debe limitarse a decir que un SGBD es el mejor. Debe relacionar la decisión con el tamaño de la empresa, el presupuesto, el equipo técnico, la carga de trabajo, la seguridad y el crecimiento previsto.

## Actividad 2. Arquitectura ANSI/SPARC

Para el ejemplo se elige una biblioteca.

### Nivel externo

Representa las vistas que necesitan los diferentes tipos de usuario:

| Usuario | Información que necesita |
|---|---|
| Lector | Catálogo, disponibilidad de ejemplares y préstamos propios |
| Bibliotecario | Altas de libros, préstamos, devoluciones y usuarios |
| Dirección | Estadísticas, libros más prestados y usuarios activos |
| Administrador del SGBD | Configuración, copias, permisos y estado del sistema |

Cada usuario ve solo la información necesaria para su función. El nivel externo no describe cómo se guardan físicamente los datos.

### Nivel conceptual

Describe la estructura lógica común de toda la base de datos:

- `Libro`: título, ISBN, editorial y año.
- `Ejemplar`: identificador, estado y ubicación.
- `Usuario`: identificador, nombre y contacto.
- `Prestamo`: fecha de préstamo, fecha prevista de devolución y fecha real.
- `Autor`: nombre y nacionalidad.

Relaciones principales:

- un libro puede tener varios ejemplares;
- un libro puede tener uno o varios autores;
- un usuario puede realizar varios préstamos;
- cada préstamo relaciona un usuario con un ejemplar.

### Nivel interno

Define cómo se almacenan y protegen los datos:

- tablas e índices en el almacenamiento del SGBD;
- índice sobre ISBN para acelerar las búsquedas;
- índice sobre el identificador del usuario para localizar sus préstamos;
- copias de seguridad periódicas;
- control de permisos sobre tablas y vistas;
- registros de actividad y espacio de almacenamiento suficiente.

### Respuestas

1. El nivel externo muestra vistas adaptadas a cada usuario; el conceptual define toda la estructura lógica de la base de datos.
2. La independencia lógica permite modificar la estructura interna o añadir elementos sin tener que cambiar todas las vistas de los usuarios.
3. Separar los datos de su almacenamiento físico permite cambiar discos, índices o métodos de organización sin modificar las aplicaciones.
4. En la biblioteca, el lector observa sus préstamos, el bibliotecario gestiona operaciones y el SGBD mantiene tablas, relaciones, índices y archivos físicos.

## Actividad 3. Trabajo práctico: equipo DBA

### 1. Arquitectura del SGBD

La solución puede representarse con tres niveles:

```text
Usuarios y aplicaciones
          |
     Nivel externo
          |
     Nivel conceptual
          |
       Nivel interno
          |
Almacenamiento y sistema operativo
```

El nivel externo contiene las vistas, el conceptual organiza entidades y relaciones y el interno gestiona archivos, índices, páginas, memoria y almacenamiento.

### 2. Componentes principales

| Componente | Función |
|---|---|
| Motor del SGBD | Procesa consultas y gestiona los datos |
| Gestor de almacenamiento | Administra archivos, páginas, buffers e índices |
| Procesador de consultas | Analiza SQL y crea planes de ejecución |
| Gestor de transacciones | Garantiza confirmaciones, anulaciones y concurrencia |
| Catálogo | Guarda metadatos sobre tablas, usuarios y permisos |
| Herramientas cliente | Permiten administrar y consultar el sistema |
| Sistema de seguridad | Controla autenticación, autorización y auditoría |

### 3. Modelos de explotación

| Modelo | Características | Uso adecuado |
|---|---|---|
| Centralizado | Un servidor concentra los datos y el procesamiento | Organizaciones pequeñas o sistemas sencillos |
| Cliente-servidor | Los clientes solicitan servicios al servidor | Aplicaciones corporativas y web |
| Distribuido | Los datos se reparten entre varios nodos | Organizaciones con sedes o necesidades de disponibilidad |
| En la nube | El proveedor gestiona parte de la infraestructura | Proyectos que necesitan elasticidad y servicios gestionados |

Para una empresa pequeña con una aplicación web se propone inicialmente un modelo cliente-servidor sobre PostgreSQL en Linux. Puede ampliarse posteriormente con copias, replicación o servicios gestionados si aumentan las necesidades.

### 4. Tareas principales del DBA

- instalar y actualizar el SGBD;
- crear bases de datos, tablas y estructuras necesarias;
- administrar usuarios, roles y permisos;
- realizar copias de seguridad y pruebas de restauración;
- monitorizar el rendimiento y el espacio disponible;
- revisar registros y resolver incidencias;
- aplicar actualizaciones de seguridad;
- documentar la configuración y los cambios;
- planificar la disponibilidad y la recuperación.

### 5. Recomendación final

Se recomienda PostgreSQL en un servidor Linux con un modelo cliente-servidor. La solución debe incluir:

- PostgreSQL como motor relacional;
- pgAdmin y `psql` como herramientas cliente;
- usuarios separados para administración y aplicaciones;
- copias de seguridad periódicas;
- control de permisos y conexiones;
- monitorización de espacio, memoria y sesiones;
- documentación de la instalación y de las operaciones realizadas.

## Actividad 4. PostgreSQL y MySQL

### Tabla comparativa orientativa

| Criterio | PostgreSQL | MySQL |
|---|---|---|
| Licencia | Código abierto con licencia PostgreSQL | Edición comunitaria de código abierto y ediciones comerciales |
| Sistemas operativos | Linux, Windows y macOS | Linux, Windows y macOS |
| Herramientas | `psql`, pgAdmin y herramientas externas | Cliente de consola, MySQL Workbench y herramientas externas |
| Usuarios y permisos | Roles, privilegios, autenticación y políticas de acceso | Usuarios, privilegios, roles y autenticación |
| Copias y recuperación | `pg_dump`, `pg_restore`, copias físicas y herramientas externas | `mysqldump`, `mysqlpump`, copias físicas y herramientas externas |
| Rendimiento | Muy completo en consultas complejas, transacciones y extensibilidad | Muy utilizado en aplicaciones web y cargas de lectura frecuentes |
| Escalabilidad | Escalado vertical, replicación y soluciones externas | Replicación, clústeres y servicios gestionados |
| Compatibilidad | Amplia compatibilidad con lenguajes y aplicaciones | Amplia compatibilidad con lenguajes y aplicaciones |
| Administración | Potente, pero puede requerir más conocimientos | Suele resultar sencillo para proyectos web habituales |

### Recomendación

Para una empresa que gestiona clientes, productos, pedidos y facturación se propone PostgreSQL cuando se priorizan la integridad, las transacciones, la seguridad y la posibilidad de realizar consultas complejas. MySQL puede ser una buena opción si el equipo ya lo conoce, la aplicación está diseñada para él o se prioriza una administración sencilla en un entorno web.

La conclusión correcta depende del caso. La comparación debe terminar indicando qué requisitos han tenido más peso y qué compromisos implica la elección.

## Criterios de corrección

Una solución completa debe:

- utilizar conceptos correctos de SGBD y arquitectura;
- diferenciar modelo de datos, arquitectura y modelo de explotación;
- justificar las elecciones con requisitos concretos;
- incluir fuentes y fecha de consulta en los rankings;
- relacionar la teoría con tareas reales del DBA;
- presentar tablas, diagramas y conclusiones claras.
