# 3. Gestión de bases de datos y objetos

## Organización lógica

En PostgreSQL, los objetos se organizan por niveles: el clúster contiene las bases de datos, y cada base de datos reúne esquemas con sus tablas y vistas.

### Bases de datos

Una **base de datos** agrupa esquemas y los objetos que contienen. Para trabajar con ellos, primero hay que conectarse a esa base de datos.

!!! quote "Sintaxis básica"

    | Operación | Sintaxis | Opciones |
    |---|---|---|
    | Crear | `CREATE DATABASE nombre`<br>`[ WITH ]`<br>`[ OWNER [=] propietario ]`<br>`[ TEMPLATE [=] plantilla ]`<br>`[ ENCODING [=] codificacion ]`<br>`[ TABLESPACE [=] tablespace ]`<br>`[ CONNECTION LIMIT [=] n ];` | `OWNER`: rol propietario (por defecto, el que ejecuta la sentencia).<br>`TEMPLATE`: base que se copia (por defecto `template1`; `template0` no tiene modificaciones locales).<br>`ENCODING`: codificación de caracteres.<br>`TABLESPACE`: tablespace predeterminado.<br>`CONNECTION LIMIT`: máximo de conexiones simultáneas.<br>Requiere ser superusuario o tener `CREATEDB`.<br>Las opciones omitidas toman valores predeterminados. |
    | Alterar | `ALTER DATABASE nombre`<br>`{ RENAME TO nuevo_nombre`<br>`\| OWNER TO nuevo_propietario`<br>`\| [ WITH ] CONNECTION LIMIT n };` | `RENAME TO`: cambia el nombre; hay que estar conectado a otra base de datos.<br>`OWNER TO`: cambia el propietario.<br>`CONNECTION LIMIT`: cambia el máximo de conexiones; `-1` indica que no hay límite. |
    | Borrar | `DROP DATABASE`<br>`[ IF EXISTS ] nombre;` | `IF EXISTS`: avisa en lugar de dar error si no existe.<br>Hay que estar conectado a **otra** base de datos (por ejemplo, `postgres`).<br>No debe haber otras conexiones activas. |

`CREATE DATABASE` y `DROP DATABASE` no pueden ejecutarse dentro de un bloque de transacción.

!!! warning "Borrado de bases de datos"

    `DROP DATABASE` borra la base de datos y todo su contenido. Haz una copia de seguridad si necesitas conservar los datos.

??? example "Ejemplo: Crear una base de datos y cambiar su propietario"

    Conectado a `postgres` como superusuario, crea `geodb` con las opciones predeterminadas y asigna su propiedad al rol `usubd`, creado en el capítulo anterior:

    ```sql
    -- Crear geodb con opciones predeterminadas
    CREATE DATABASE geodb;

    -- Cambiar el propietario de geodb
    ALTER DATABASE geodb OWNER TO usubd;
    ```

    En `psql`, conecta después a `geodb` como su propietario:

    ```text
    \c geodb usubd
    ```

    La base de datos `geo` ya existe. Si hubiera que crearla indicando opciones, sería:

    ```sql
    -- Crear una base de datos indicando plantilla, propietario y codificación
    CREATE DATABASE geo
        WITH TEMPLATE = template0
        OWNER = geo
        ENCODING = 'UTF8';
    ```

---

### Esquemas

Un **esquema** es un espacio de nombres que organiza los objetos de una base de datos (tablas, vistas, funciones, procedimientos, disparadores...). Toda base de datos incluye normalmente el esquema `public`. Para evitar ambigüedades, se puede indicar el esquema en el nombre del objeto, como en `public.poblacions`.

!!! quote "Sintaxis básica"

    | Operación | Sintaxis | Opciones |
    |---|---|---|
    | Crear | `CREATE SCHEMA`<br>`[ IF NOT EXISTS ] nombre`<br>`[ AUTHORIZATION propietario ];` | `IF NOT EXISTS`: avisa en lugar de dar error si ya existe.<br>`AUTHORIZATION`: rol propietario. |
    | Alterar | `ALTER SCHEMA nombre`<br>`{ RENAME TO nuevo_nombre`<br>`\| OWNER TO nuevo_propietario };` | `RENAME TO`: cambia el nombre.<br>`OWNER TO`: cambia el propietario. |
    | Borrar | `DROP SCHEMA`<br>`[ IF EXISTS ] nombre`<br>`[ CASCADE \| RESTRICT ];` | `IF EXISTS`: avisa en lugar de dar error si no existe.<br>`RESTRICT` (por defecto): rechaza el borrado si el esquema contiene objetos.<br>`CASCADE`: borra también el contenido y los objetos que dependen de él. |

Crear un esquema o mover una tabla a él no cambia su ubicación física.

??? example "Ejemplo: Crear y alterar esquemas"

    Conectados a `geodb`, crea los esquemas `administracio` y `estadisticas`. Para probar `ALTER SCHEMA` y `DROP SCHEMA` sin tocarlos, se usa un esquema temporal:

    ```sql
    -- Crear los esquemas de trabajo
    CREATE SCHEMA administracio;
    CREATE SCHEMA estadisticas;

    -- Crear un esquema temporal de prueba
    CREATE SCHEMA esquema_temporal;

    -- Cambiar su nombre
    ALTER SCHEMA esquema_temporal RENAME TO esquema_prueba;

    -- Asignar la propiedad al rol usugestor
    ALTER SCHEMA esquema_prueba OWNER TO usugestor;

    -- Borrar el esquema de prueba, que está vacío
    DROP SCHEMA esquema_prueba;
    ```

---

### Tablas

Las **tablas** almacenan los datos en filas y columnas y pertenecen a un esquema. Normalmente, el rol que crea la tabla pasa a ser su propietario.

!!! quote "Sintaxis básica"

    | Operación | Sintaxis | Opciones |
    |---|---|---|
    | Crear | `CREATE TABLE`<br>`[ IF NOT EXISTS ] [ esquema. ]nombre (`<br>`columna tipo_dato [ restricciones ] [, ...]`<br>`);` | `IF NOT EXISTS`: avisa en lugar de dar error si ya existe.<br>`esquema.`: esquema donde se crea.<br>`restricciones`: opcionales para cada columna. |
    | Alterar | `ALTER TABLE [ esquema. ]nombre`<br>`{ ADD COLUMN columna tipo_dato [ restricciones ]`<br>`\| ADD CONSTRAINT nombre_restriccion tipo_restriccion`<br>`\| RENAME TO nuevo_nombre`<br>`\| SET SCHEMA otro_esquema };` | `ADD COLUMN`: añade una columna; `restricciones` es opcional.<br>`ADD CONSTRAINT`: añade una restricción; `tipo_restriccion` puede ser `PRIMARY KEY`, `FOREIGN KEY`, `UNIQUE` o `CHECK`.<br>`RENAME TO`: cambia el nombre.<br>`SET SCHEMA`: mueve la tabla a otro esquema. |
    | Borrar | `DROP TABLE`<br>`[ IF EXISTS ] [ esquema. ]nombre [, ...]`<br>`[ CASCADE \| RESTRICT ];` | `IF EXISTS`: avisa en lugar de dar error si no existe.<br>`[, ...]`: varias tablas separadas por comas.<br>`RESTRICT` (por defecto): impide borrar si otros objetos dependen de la tabla.<br>`CASCADE`: borra también los objetos dependientes, como vistas o claves externas. |

??? example "Ejemplo: Crear, alterar y borrar tablas en geodb"

    Conectados a `geodb`, crea tres tablas, mueve una al esquema `administracio`, añade una columna y borra la de prueba:

    ```sql
    -- Crear las tablas
    CREATE TABLE public.notas_comarcas (
        comarca character varying(50) NOT NULL,
        observaciones text
    );

    CREATE TABLE estadisticas.resumen_comarcas (
        comarca character varying(50) NOT NULL,
        numero_poblaciones integer
    );

    CREATE TABLE public.tabla_prueba (
        descripcion text
    );

    -- Mover notas_comarcas al esquema administracio
    ALTER TABLE public.notas_comarcas SET SCHEMA administracio;

    -- Añadir una columna para la fecha de revisión de las notas
    ALTER TABLE administracio.notas_comarcas
    ADD COLUMN fecha_revision date;

    -- Borrar la tabla de prueba
    DROP TABLE public.tabla_prueba;
    ```

---

### Vistas

Una **vista** es una consulta guardada que se usa como una tabla. No guarda los datos: los obtiene cada vez de las **tablas base** (tablas u otras vistas) en las que se basa. Permite reutilizar consultas, mostrar solo las filas y columnas necesarias y limitar la información visible mediante permisos.

!!! quote "Sintaxis básica"

    | Operación | Sintaxis | Opciones |
    |---|---|---|
    | Crear o reemplazar | `CREATE [ OR REPLACE ] VIEW`<br>`[ esquema. ]nombre`<br>`[ ( columna [, ...] ) ]`<br>`AS consulta;` | `OR REPLACE`: reemplaza la vista si ya existe.<br>`( columna [, ...] )`: nombres de las columnas de la vista. |
    | Alterar | `ALTER VIEW [ IF EXISTS ] [ esquema. ]nombre`<br>`{ RENAME TO nuevo_nombre`<br>`\| OWNER TO nuevo_propietario`<br>`\| SET SCHEMA otro_esquema };` | `IF EXISTS`: avisa en lugar de dar error si no existe.<br>`RENAME TO`: cambia el nombre.<br>`OWNER TO`: cambia el propietario.<br>`SET SCHEMA`: mueve la vista a otro esquema. |
    | Borrar | `DROP VIEW`<br>`[ IF EXISTS ] [ esquema. ]nombre [, ...]`<br>`[ CASCADE \| RESTRICT ];` | `IF EXISTS`: avisa en lugar de dar error si no existe.<br>`RESTRICT` (por defecto): impide borrar si hay objetos dependientes.<br>`CASCADE`: borra también los objetos dependientes, como otras vistas. |

!!! warning "Modificar la consulta de una vista"

    `ALTER VIEW` no cambia la consulta de la vista. Para modificarla se utiliza `CREATE OR REPLACE VIEW`, y la nueva definición debe ser compatible con las columnas anteriores.

??? example "Ejemplo: Poblaciones a más de 700 metros"

    Conectados a `geo`, crea o actualiza una vista con las poblaciones situadas a más de 700 metros y consúltala como una tabla:

    ```sql
    -- Crear o reemplazar la vista
    CREATE OR REPLACE VIEW public.vista_mas_de_700 AS
    SELECT nom, comarca, altura
    FROM public.poblacions
    WHERE altura > 700;

    -- Consultar la vista
    SELECT * FROM public.vista_mas_de_700;
    ```

??? example "Ejemplo: Vistas en geodb"

    Conectados a `geodb`, crea una vista con las comarcas de más de diez poblaciones y otra con las notas ya revisadas. Después, cambia el nombre de la primera:

    ```sql
    -- Crear la vista de comarcas con más de diez poblaciones
    CREATE VIEW estadisticas.vista_comarcas_mas10 AS
    SELECT comarca, numero_poblaciones
    FROM estadisticas.resumen_comarcas
    WHERE numero_poblaciones > 10;

    -- Crear la vista de notas con fecha de revisión
    CREATE VIEW administracio.vista_notas_revisadas AS
    SELECT comarca, observaciones, fecha_revision
    FROM administracio.notas_comarcas
    WHERE fecha_revision IS NOT NULL;

    -- Cambiar el nombre de la primera vista
    ALTER VIEW estadisticas.vista_comarcas_mas10 RENAME TO vista_resumen_comarcas;
    ```

??? example "Ejemplo: Borrar una vista"

    Conectados a `geo`, crea una vista temporal y bórrala. La tabla base `poblacions` y sus datos permanecen:

    ```sql
    -- Crear una vista temporal
    CREATE VIEW public.vista_temporal AS
    SELECT nom, comarca, altura
    FROM public.poblacions
    WHERE altura <= 700;

    -- Borrar la vista temporal
    DROP VIEW public.vista_temporal;
    ```

---

## Organización física

### Tablespaces

Los esquemas organizan los objetos de forma **lógica**; los **tablespaces** definen ubicaciones **físicas** (directorios) donde PostgreSQL guarda los datos. Se crean a nivel de clúster y pueden ser la ubicación predeterminada de una base de datos o asignarse a tablas e índices. Así se pueden repartir los datos entre dispositivos, por ejemplo índices en un SSD y tablas en un disco de mayor capacidad. Los usuarios acceden a los objetos por sus nombres habituales, sin indicar el tablespace.

!!! quote "Sintaxis básica"

    | Operación | Sintaxis | Opciones |
    |---|---|---|
    | Crear | `CREATE TABLESPACE nombre`<br>`[ OWNER propietario ]`<br>`LOCATION 'directorio';` | `OWNER`: rol propietario (por defecto, el que ejecuta la sentencia).<br>`LOCATION`: ruta absoluta de un directorio existente, vacío y propiedad del usuario del sistema operativo que ejecuta PostgreSQL (normalmente `postgres`); no se puede cambiar después.<br>El nombre no puede empezar por `pg_`. |
    | Alterar | `ALTER TABLESPACE nombre`<br>`{ RENAME TO nuevo_nombre`<br>`\| OWNER TO nuevo_propietario`<br>`\| SET ( parametro = valor [, ...] ) };` | `RENAME TO`: cambia el nombre.<br>`OWNER TO`: cambia el propietario.<br>`SET`: ajusta parámetros de coste del planificador, como `random_page_cost`; no cambia la ubicación. |
    | Borrar | `DROP TABLESPACE`<br>`[ IF EXISTS ] nombre;` | `IF EXISTS`: avisa en lugar de dar error si no existe.<br>Debe estar **vacío** (no admite `CASCADE`): antes hay que mover o borrar sus objetos y las bases de datos que lo usen como predeterminado.<br>El directorio del sistema operativo no se borra. |

Solo un **superusuario** puede crear un tablespace; modificarlo o borrarlo, solo su propietario o un superusuario. Crear y borrar no pueden ejecutarse dentro de un bloque de transacción.

!!! warning "Tablespaces y copias de seguridad"

    Un tablespace forma parte del clúster: debe tenerse en cuenta en la estrategia de copias de seguridad. No uses directorios con datos existentes ni ubicaciones del sistema sin comprobar antes las consecuencias.

??? example "Ejemplo: Distribuir tablas en distintos tablespaces"

    Con un SSD y un HDD, un superusuario crea un tablespace en cada uno y coloca en ellos una tabla de `geo` y otra de `geodb`:

    ```sql
    -- Crear los tablespaces
    CREATE TABLESPACE ts_rapido
    LOCATION '/ssd/postgresql';

    CREATE TABLESPACE ts_gran_capacitat
    LOCATION '/hdd/postgresql';

    -- Colocar la tabla poblacions de geo en el SSD
    \c geo
    ALTER TABLE public.poblacions
    SET TABLESPACE ts_rapido;

    -- Colocar la tabla resumen_comarcas de geodb en el HDD
    \c geodb
    ALTER TABLE estadisticas.resumen_comarcas
    SET TABLESPACE ts_gran_capacitat;
    ```

    Las tablas siguen perteneciendo a sus esquemas originales. Los índices asociados no se trasladan automáticamente al mover la tabla.

??? example "Ejemplo: Alterar y borrar un tablespace"

    Para no modificar `ts_rapido`, que se usa más adelante, un superusuario crea un tablespace temporal en un directorio vacío, lo altera y lo borra:

    ```sql
    -- Crear un tablespace temporal
    CREATE TABLESPACE ts_temporal LOCATION '/ssd/temporal';

    -- Cambiar su nombre
    ALTER TABLESPACE ts_temporal RENAME TO ts_prueba;

    -- Asignar la propiedad al rol usubd
    ALTER TABLESPACE ts_prueba OWNER TO usubd;

    -- Indicar al planificador que los accesos aleatorios son baratos en un SSD
    ALTER TABLESPACE ts_prueba SET ( random_page_cost = 1.1 );

    -- Borrar el tablespace, que está vacío
    DROP TABLESPACE ts_prueba;
    ```

    El directorio `/ssd/temporal` sigue existiendo en el sistema operativo y puede borrarse manualmente.

---

## Actividades relacionadas

- [Actividad 4: Creación de una base de datos, un esquema y una tabla](00-actividades.md#actividad-4-creacion-de-una-base-de-datos-un-esquema-y-una-tabla).
- [Actividad 5: Creación de vistas](00-actividades.md#actividad-5-creacion-de-vistas).
- [Actividad 6: Consulta de las vistas del esquema](00-actividades.md#actividad-6-consulta-de-las-vistas-del-esquema).
- [Actividad 7: Creación de un tablespace](00-actividades.md#actividad-7-creacion-de-un-tablespace).
- [Actividad 8: Creación de una base de datos en un tablespace](00-actividades.md#actividad-8-creacion-de-una-base-de-datos-en-un-tablespace).
- [Actividad 9: Cambio del propietario de una base de datos](00-actividades.md#actividad-9-cambio-del-propietario-de-una-base-de-datos).

Algunas actividades también requieren los contenidos de roles, privilegios o copias de seguridad de los siguientes apartados.
