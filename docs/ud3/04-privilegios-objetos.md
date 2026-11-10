# 4. Privilegios sobre objetos

Un **privilegio** es el permiso para realizar una operación (consultar, insertar, conectarse…) sobre un objeto: base de datos, esquema, tabla o vista. 

Se conceden con `GRANT` y se retiran con `REVOKE`.

Los privilegios pueden concederse a roles de grupo; sus miembros los usan según las [membresías entre roles](02-roles-membresias.md#gestion-de-membresias).

## Niveles de acceso

Los privilegios se conceden por separado en cada nivel. Por ejemplo para consultar una tabla se necesita:

1. `CONNECT` sobre la base de datos.
2. `USAGE` sobre el esquema que contiene la tabla.
3. `SELECT` sobre la tabla.

```text
Clúster de PostgreSQL
├── Roles (geo_lectura, geo_edicion, usulector, usueditor…)
└── Base de datos geo ............ CONNECT
    └── Esquema public ........... USAGE
        └── Tabla poblacions ..... SELECT
```
??? example "Ejemplo: Perfiles para la base de datos geo"

    Los ejemplos usan la base de datos `geo`, el esquema `public` y las tablas `comarques`, `poblacions` e `instituts`, con los roles de [Gestión de roles](02-roles-membresias.md):

    - `geo_lectura`: consulta, asignado a `usulector`.
    - `geo_edicion`: consulta, inserción y actualización, asignado a `usueditor`.

    Si has modificado o eliminado estos roles en ejemplos anteriores, restablécelos antes de continuar.

## Privilegios efectivos

Un rol puede recibir un privilegio de forma directa, por una membresía o a través de `PUBLIC` (todos los roles). 

Por eso, retirar una concesión no garantiza que el privilegio desaparezca si se recibe también por otra vía.

## Conceder y retirar privilegios

`GRANT` concede a uno o varios roles permiso para realizar operaciones sobre un objeto, y `REVOKE` lo retira. En ambas hay que indicar **qué privilegios**, **sobre qué objeto** y **a qué roles**.

!!! quote "Sintaxis básica"

    | Operación | Sintaxis | Opciones |
    |---|---|---|
    | Conceder | `GRANT { privilegio [, ...] \| ALL [ PRIVILEGES ] }`<br>`ON { DATABASE \| SCHEMA \| TABLE \| ALL TABLES IN SCHEMA } objeto [, ...]`<br>`TO { rol \| PUBLIC } [, ...]`<br>`[ WITH GRANT OPTION ];` | `WITH GRANT OPTION`: permite al destinatario conceder a otros el privilegio recibido.<br>No lo convierte en propietario del objeto.<br>`ALL PRIVILEGES`: todos los privilegios aplicables al objeto.<br>`ALL TABLES IN SCHEMA`: todas las tablas existentes del esquema, no las futuras.<br>`PUBLIC`: todos los roles. |
    | Retirar | `REVOKE { privilegio [, ...] \| ALL [ PRIVILEGES ] }`<br>`ON { DATABASE \| SCHEMA \| TABLE \| ALL TABLES IN SCHEMA } objeto [, ...]`<br>`FROM { rol \| PUBLIC } [, ...];` | Retira una concesión concreta.<br>El rol puede conservar el privilegio si lo recibe por otra vía (`PUBLIC`, membresía o propiedad). |
    | Retirar solo la opción de conceder | `REVOKE GRANT OPTION FOR { privilegio [, ...] \| ALL [ PRIVILEGES ] }`<br>`ON { DATABASE \| SCHEMA \| TABLE \| ALL TABLES IN SCHEMA } objeto [, ...]`<br>`FROM { rol \| PUBLIC } [, ...]`<br>`[ CASCADE \| RESTRICT ];` | Mantiene el privilegio y retira solo la capacidad de delegarlo.<br>`RESTRICT` (por defecto): falla si existen concesiones dependientes.<br>`CASCADE`: retira también las concesiones dependientes. |

    Las vistas se tratan como tablas (`TABLE`).


#### Tabla de privilegios

El objeto determina **qué privilegios** se pueden conceder:

| DATABASE | Descripción | SCHEMA | Descripción | TABLE / VIEW | Descripción |
|---|---|---|---|---|---|
| `CONNECT` | Conectarse. | `USAGE` | Acceder a sus objetos (si se tienen sus privilegios). | `SELECT` | Consultar datos. |
| `CREATE` | Crear esquemas. | `CREATE` | Crear objetos. | `INSERT` | Insertar datos. |
| `TEMPORARY` | Crear tablas temporales. | | | `UPDATE` | Modificar datos. |
| | | | | `DELETE` | Eliminar datos. |

En una vista, `INSERT`, `UPDATE` y `DELETE` solo funcionan si la vista es modificable.

??? example "Ejemplo: Conceder privilegios"

    ```sql
    -- Acceso a la base de datos y al esquema para los dos perfiles
    GRANT CONNECT ON DATABASE geo TO geo_lectura, geo_edicion;
    GRANT USAGE ON SCHEMA public TO geo_lectura, geo_edicion;

    -- Consulta para el perfil de lectura
    GRANT SELECT
    ON TABLE public.comarques, public.poblacions, public.instituts
    TO geo_lectura;

    -- Consulta, inserción y actualización para el perfil de edición
    GRANT SELECT, INSERT, UPDATE
    ON TABLE public.comarques, public.poblacions, public.instituts
    TO geo_edicion;
    ```

??? example "Ejemplo: Retirar privilegios"

    ```sql
    -- Retirar la conexión y el uso del esquema al perfil de lectura
    REVOKE CONNECT ON DATABASE geo FROM geo_lectura;
    REVOKE USAGE ON SCHEMA public FROM geo_lectura;

    -- Retirar la actualización sobre poblacions al perfil de edición
    REVOKE UPDATE ON TABLE public.poblacions FROM geo_edicion;
    ```

    Retirar `CONNECT` no cierra las sesiones ya abiertas. Retirar `USAGE` no elimina los privilegios sobre las tablas, pero impide acceder a ellas por su nombre.

### Concesiones amplias

Permiten conceder varios privilegios u objetos a la vez con `ALL PRIVILEGES` y `ALL TABLES IN SCHEMA`, o conceder a todos los roles con `PUBLIC`.

??? example "Ejemplo: Concesiones amplias (alternativas independientes)"

    ```sql
    -- Todos los privilegios de tabla sobre comarques (incluye DELETE)
    GRANT ALL PRIVILEGES ON TABLE public.comarques TO geo_edicion;

    -- Consulta sobre todas las tablas existentes del esquema
    GRANT SELECT ON ALL TABLES IN SCHEMA public TO geo_lectura;

    -- Consulta sobre poblacions para todos los roles (PUBLIC)
    GRANT SELECT ON TABLE public.poblacions TO PUBLIC;
    ```

    Con `PUBLIC` siguen siendo necesarios `CONNECT` y `USAGE`.

### Delegar y retirar la delegación

Con `WITH GRANT OPTION`, un rol puede conceder a otros el privilegio que ha recibido. 
Con `REVOKE GRANT OPTION FOR` retira esa capacidad sin quitarle el privilegio.

??? example "Ejemplo: Delegar y retirar la delegación de SELECT"

    ```sql
    -- Como propietario de poblacions
    GRANT SELECT ON TABLE public.poblacions 
    TO usulector 
    WITH GRANT OPTION;

    -- Conectado como usulector: concede el privilegio a otro rol
    GRANT SELECT ON TABLE public.poblacions 
    TO usueditor;

    -- Retirar a usulector la capacidad de delegar, manteniendo su SELECT
    REVOKE GRANT OPTION FOR SELECT
    ON TABLE public.poblacions
    FROM usulector CASCADE;
    ```

    Sin `CASCADE`, la última sentencia falla porque `usulector` ya concedió el privilegio a `usueditor`.

## Consultar privilegios efectivos

Estas funciones devuelven `true` o `false` e incluyen los privilegios recibidos por membresía:

| Función | Comprueba |
|---|---|
| `has_database_privilege` | Privilegios sobre una base de datos (`CONNECT`…). |
| `has_schema_privilege` | Privilegios sobre un esquema (`USAGE`…). |
| `has_table_privilege` | Privilegios sobre una tabla (`SELECT`, `UPDATE`…). |

Hay que comprobar los tres niveles: que `has_table_privilege` sea `true` no garantiza que el rol pueda conectarse o acceder al esquema.

??? example "Ejemplo: Comprobar privilegios"

    ```sql
    -- Acceso de usulector a public.poblacions
    SELECT has_database_privilege('usulector', 'geo', 'CONNECT') AS puede_conectar,
           has_schema_privilege('usulector', 'public', 'USAGE') AS puede_usar_esquema,
           has_table_privilege('usulector', 'public.poblacions', 'SELECT') AS puede_consultar;

    -- Comparar usulector y usueditor
    SELECT
        has_table_privilege('usulector', 'public.poblacions', 'SELECT') AS usulector_consulta,
        has_table_privilege('usulector', 'public.poblacions', 'UPDATE') AS usulector_actualiza,
        has_table_privilege('usueditor', 'public.poblacions', 'SELECT') AS usueditor_consulta,
        has_table_privilege('usueditor', 'public.poblacions', 'UPDATE') AS usueditor_actualiza,
        has_table_privilege('usueditor', 'public.poblacions', 'DELETE') AS usueditor_elimina;
    ```

    Con los perfiles iniciales (sin `PUBLIC`, propiedad ni superusuario), la segunda consulta devuelve:

    | usulector_consulta | usulector_actualiza | usueditor_consulta | usueditor_actualiza | usueditor_elimina |
    |:---:|:---:|:---:|:---:|:---:|
    | `true` | `false` | `true` | `true` | `false` |

## Acceso a través de vistas

Una vista normal consulta las tablas con los permisos de **su propietario**. Por eso, quien la consulta no necesita `SELECT` directo sobre las tablas originales.

??? example "Ejemplo: Acceder a una vista sin acceso a la tabla"

    Como `postgres`, conectado a `geo` (si los roles ya existen, no los vuelvas a crear):

    ```sql
    CREATE ROLE geo_solo_vistas NOLOGIN;
    CREATE ROLE usuvisor LOGIN PASSWORD 'Cambiar_En_Practicas_2026';

    GRANT geo_solo_vistas TO usuvisor;
    GRANT CONNECT ON DATABASE geo TO geo_solo_vistas;
    GRANT USAGE ON SCHEMA public TO geo_solo_vistas;
    GRANT SELECT ON public.vista_mas_de_700 TO geo_solo_vistas;
    ```

    `usuvisor` puede consultar la vista, pero no `poblacions`, siempre que no reciba `SELECT` sobre ella por otra concesión, `PUBLIC` u otra membresía. Compruébalo conectándote como `usuvisor`.

!!! tip "Ampliación"

    La opción `security_invoker` hace que la vista compruebe los permisos de quien la consulta en lugar de los del propietario.

## Ejemplo completo: base de datos con acceso para otro usuario

Quien crea una base de datos tiene todos sus privilegios por defecto. Para que otro usuario pueda trabajar en ella hay que concedérselos: conexión, uso del esquema y acceso a las tablas y a sus secuencias.

??? example "Ejemplo: Crear una base de datos y dar acceso a otro usuario"

    Como superusuario `postgres`, desde `psql`:

    ```sql
    -- Crear el usuario al que se dará acceso y la base de datos
    CREATE ROLE usudb LOGIN PASSWORD 'usudb';
    CREATE DATABASE usudb;

    -- Conectarse a la base de datos
    \c usudb

    -- Crear la tabla e insertar datos
    CREATE TABLE Beatles (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        height DECIMAL,
        weight DECIMAL,
        instrument VARCHAR(100),
        birth_place VARCHAR(100),
        active_years VARCHAR(100)
    );

    INSERT INTO Beatles (name, height, weight, instrument, birth_place, active_years) VALUES
        ('John Lennon', 179, 70, 'Vocals, Guitar', 'Liverpool, England', '1960-1970'),
        ('Paul McCartney', 180, 68, 'Vocals, Bass', 'Liverpool, England', '1960-1970'),
        ('George Harrison', 178, 68, 'Vocals, Guitar', 'Liverpool, England', '1960-1970'),
        ('Ringo Starr', 173, 65, 'Vocals, Drums', 'Liverpool, England', '1962-1970');

    -- Permitir la conexión a la base de datos
    GRANT CONNECT ON DATABASE usudb TO usudb;

    -- Permitir usar el esquema y crear objetos en él
    GRANT USAGE, CREATE ON SCHEMA public TO usudb;

    -- Todos los privilegios sobre las tablas existentes del esquema
    GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO usudb;

    -- Usar las secuencias (la clave primaria SERIAL las utiliza)
    GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO usudb;
    ```

    Sin el permiso sobre las secuencias, `usudb` no podría insertar filas en una tabla con clave `SERIAL`.


## Actividades relacionadas

- [Actividad 10: Concesión de privilegios a un usuario](00-actividades.md#actividad-10-concesion-de-privilegios-a-un-usuario).
- [Actividad 11: Concesión de privilegios a un grupo](00-actividades.md#actividad-11-concesion-de-privilegios-a-un-grupo).
- [Actividad 12: Consulta de privilegios efectivos](00-actividades.md#actividad-12-consulta-de-privilegios-efectivos).
- [Actividad 13: Retirada de privilegios](00-actividades.md#actividad-13-retirada-de-privilegios).
- [Actividad 14: Privilegios sobre vistas](00-actividades.md#actividad-14-privilegios-sobre-vistas).

