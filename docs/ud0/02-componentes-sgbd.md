# 2. Componentes de una base de datos

Generalmente los SGBD se componen de varios elementos bien diferenciados entre ellos:

1. Lenguajes
2. El diccionario de datos
3. Mecanismos de seguridad e integridad
4. Factor humano

---

## 2.1. Lenguajes

Los lenguajes del SGBD nos permiten crear las tablas, realizar las consultas sobre los datos, crear diferentes restricciones y en general permiten realizar todas las operaciones posibles sobre el sistema gestor. Entre otras tareas deben permitir:

* **DDL (Data Definition Language / Lenguaje de Definición de Datos):** Crear la estructura de la base de datos, incluyendo todos los objetos que puede incluir la misma (tablas, vistas, usuarios, procedimientos, funciones, triggers, etc.).
* **DML (Data Manipulation Language / Lenguaje de Manipulación de Datos):** Consultar y manipular la información almacenada en la base de datos. Sentencias `SELECT`, `UPDATE`, `INSERT`, `DELETE`, etc.
* **DCL (Data Control Language / Lenguaje de Control de Datos):** Asignar privilegios a usuarios, confirmar o abortar transacciones, etc.

!!! info "Lenguajes de Cuarta Generación (4GL)"
    En algunos casos, los SGBD también incluyen un lenguaje de cuarta generación (4GL) para RAD (Desarrollo Rápido de Aplicaciones).  
    *Ejemplos:* Asistentes de Access, Oracle Developer Suite, etc.

---

## 2.2. El Diccionario de Datos

El diccionario de datos contiene toda la información sobre los datos de la BD, es decir, los **metadatos** (datos acerca de los datos) de la base de datos. Esto incluye:

* La definición de todos los objetos existentes en la base de datos: tablas con sus columnas, vistas, procedimientos, triggers, índices, etc.
* La ubicación física de los objetos y el espacio asignado a los mismos.
* Los privilegios y roles asignados a los usuarios.
* Las restricciones de las tablas.
* Estadísticas de uso de la base de datos.
* Información del consumo de recursos actual.
* Información de los usuarios.
* Y un larguísimo etcétera...

---

## 2.3. Mecanismos de Seguridad e Integridad

Un SGBD debe proporcionar utilidades que permitan:

* La realización de copias de seguridad de los datos y la restauración de las mismas.
* Garantizar la protección de los datos ante accesos no autorizados.
* Implantar restricciones de integridad de los datos para evitar daños accidentales de los datos.
* Recuperar la base de datos hasta un estado consistente en caso de error del sistema o cualquier otro imprevisto.
* Controlar el acceso concurrente de los usuarios para evitar errores de integridad.

---

## 2.4. El Factor Humano

Un SGBD siempre va a tener distintas categorías de usuarios:

* **Usuarios finales:** Podrán acceder a la información sobre la que le hayan sido concedidos privilegios.
* **Programadores:** Realizan aplicaciones sobre los objetos de la base de datos para facilitar su trabajo a los usuarios finales.
* **Administradores o DBAs:** Garantizan el correcto funcionamiento de la base de datos y gestionan todos sus recursos. Tienen el nivel más alto de privilegios y responsabilidades legales en caso de que los datos tengan algún tipo de protección. Su objetivo es que la base de datos esté siempre disponible y con un rendimiento óptimo.

!!! tip "Enfoque del módulo"
    En este módulo nos vamos a centrar en realizar tareas propias del **DBA**.
