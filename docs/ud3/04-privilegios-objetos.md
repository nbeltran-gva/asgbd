# 4. Privilegios sobre objetos

Un **privilegio** determina qué operación puede realizar un rol sobre un objeto, como una base de datos, un esquema, una tabla o una vista. PostgreSQL utiliza `GRANT` para conceder privilegios y `REVOKE` para retirarlos.

Los ejemplos continúan la configuración del capítulo de [roles y membresías](02-roles-membresias.md): existen `usulector`, `usueditor`, `geo_lectura` y `geo_edicion`, y sus membresías están asignadas. También se parte de las tablas existentes en `geo`. Ejecuta las concesiones como propietario de los objetos (en estos ejemplos, `geo`) o con un rol autorizado. Las retiradas y concesiones alternativas cambian el estado; restablece los permisos indicados antes de continuar con las comprobaciones o pgAdmin.

Los privilegios pueden concederse a roles de grupo para administrarlos conjuntamente. Las [membresías entre roles](02-roles-membresias.md#gestion-de-membresias) determinan si sus miembros pueden heredar esos privilegios o activar el rol del grupo.

??? example "Ejemplo: Privilegios del grupo geo_lectura"

    Si `usulector` pertenece a `geo_lectura` y el grupo tiene `SELECT` sobre `public.poblacions`, la configuración de la membresía determina cómo puede utilizar ese privilegio.


!!! note "Recuerda"

    Los **privilegios efectivos** de un rol pueden proceder de concesiones directas, de membresías o de `PUBLIC`, que representa a todos los roles. Por ello, retirar una concesión no garantiza que el privilegio desaparezca si se recibe también por otra vía.

---

**Acceso a los objetos**

Los roles se definen en el clúster, no dentro de una base de datos. Pueden recibir privilegios sobre objetos situados en distintos niveles:

```text
Clúster de PostgreSQL
├── Roles
│   ├── usulector
│   ├── usueditor
│   ├── geo_lectura
│   │   └── Miembro: usulector
│   └── geo_edicion
│       └── Miembro: usueditor
└── Base de datos geo
    ├── CONNECT: permite conectarse a geo
    └── Esquema public
        ├── USAGE: permite acceder a los objetos del esquema
        └── Tabla poblacions
            └── SELECT: permite consultar sus datos
```

??? example "Ejemplo: Conceder privilegios a geo_lectura"

    se pueden conceder `CONNECT`, `USAGE` y `SELECT` a `geo_lectura`. La membresía puede permitir que `usulector` use esos privilegios, según su configuración. Los roles y sus membresías se comparten en todo el clúster; los privilegios se conceden sobre objetos concretos.

    Tener `SELECT` sobre una tabla no concede por sí solo `CONNECT` a la base de datos ni `USAGE` sobre el esquema. Para consultar la tabla por su nombre cualificado deben comprobarse los tres niveles.


??? example "Ejemplo: Perfiles para la base de datos geo"

    Los ejemplos utilizan la base de datos `geo`, el esquema `public` y las tablas `comarques`, `poblacions` e `instituts`. Se emplean los roles y las membresías de [Gestión de roles](02-roles-membresias.md):

    - `geo_lectura`: perfil de consulta, asignado a `usulector`.
    - `geo_edicion`: perfil de consulta, inserción y actualización, asignado a `usueditor`.

    Si has ejecutado los ejemplos de modificación o eliminación de roles, restablece los roles y las membresías necesarios antes de continuar.

## Conceder privilegios

La sentencia `GRANT` concede a uno o varios roles el permiso para realizar determinadas operaciones sobre un objeto. Para utilizarla hay que indicar **qué privilegios** se conceden, **sobre qué objeto** y **a qué roles**.

La siguiente sintaxis es una representación simplificada para bases de datos, esquemas, tablas y vistas. Para las vistas también se utiliza `TABLE`:

```sql
GRANT privilegio [, ...]
ON { DATABASE | SCHEMA | TABLE } nombre_objeto
TO nombre_rol [, ...];
```

El tipo de objeto determina qué privilegios se pueden conceder. Por ejemplo, `CONNECT` se aplica a una base de datos, mientras que `SELECT` se aplica a una tabla o vista. La siguiente tabla resume algunos de los privilegios más habituales:

| Objeto | Privilegio | Permite |
|---|---|---|
| DATABASE | `CONNECT` | Conectarse. |
| DATABASE | `CREATE` | Crear esquemas. |
| DATABASE | `TEMPORARY` | Crear tablas temporales. |
| SCHEMA | `USAGE` | Acceder a sus objetos si se tienen los privilegios necesarios. |
| SCHEMA | `CREATE` | Crear objetos. |
| TABLE | `SELECT` | Consultar datos. |
| TABLE | `INSERT` | Insertar datos. |
| TABLE | `UPDATE` | Modificar datos. |
| TABLE | `DELETE` | Eliminar datos. |
| VIEW | `SELECT` | Consultar los datos que muestra la vista. |
| VIEW | `INSERT` | Insertar datos a través de una vista modificable. |
| VIEW | `UPDATE` | Modificar datos a través de una vista modificable. |
| VIEW | `DELETE` | Eliminar datos a través de una vista modificable. |

Las operaciones de escritura sobre una vista requieren que esta sea modificable y que se cumplan los requisitos y permisos correspondientes.

??? example "Ejemplo: Conceder privilegios"

    Se conceden los permisos de conexión, acceso al esquema y consulta o edición a los grupos correspondientes.

    ```sql
    ---Conceder acceso a la base de datos `geo` a los dos perfiles: 
    GRANT CONNECT ON DATABASE geo TO geo_lectura, geo_edicion;

    --Permitir que ambos perfiles utilicen el esquema `public`:
    GRANT USAGE ON SCHEMA public TO geo_lectura, geo_edicion;

    ---Conceder consulta sobre las tablas al perfil `geo_lectura` 
    GRANT SELECT
    ON TABLE public.comarques, public.poblacions, public.instituts
    TO geo_lectura;

    ---Conceder consulta, inserción y actualización sobre las tablas al perfil `geo_edicion`
    GRANT SELECT, INSERT, UPDATE
    ON TABLE public.comarques, public.poblacions, public.instituts
    TO geo_edicion;
    ```


### Concesiones amplias y `PUBLIC`

PostgreSQL permite conceder todos los privilegios aplicables a un objeto con `ALL PRIVILEGES`, aplicar una concesión a todas las tablas existentes de un esquema con `ALL TABLES IN SCHEMA` o conceder privilegios a todos los roles mediante `PUBLIC`.

??? example "Ejemplo: Las siguientes sentencias son alternativas independientes, no pasos de..."

    Las siguientes sentencias son **alternativas independientes**, no pasos de la práctica anterior:

    ```sql
    -- Conceder todos los privilegios ALL PRIVILEGES de tabla sobre comarques 
    GRANT ALL PRIVILEGES ON TABLE public.comarques TO geo_edicion;

    -- Conceder consulta sobre todas las tablas (ALL TABLES) existentes del esquema
    GRANT SELECT ON ALL TABLES IN SCHEMA public TO geo_lectura;

    -- Conceder consulta sobre poblacions a todos los roles (PUBLIC)
    GRANT SELECT ON TABLE public.poblacions TO PUBLIC;
    ```

    - La primera concesión incluye `DELETE`. 
    - La segunda afecta a las tablas existentes en ese momento, no a las futuras. 
    - La tercera concede `SELECT` a todos los roles, aunque para acceder también se necesitan los permisos correspondientes sobre la base de datos y el esquema.


### Delegar una concesión

La opción `WITH GRANT OPTION` permite al destinatario conceder a otros el privilegio recibido; no lo convierte en propietario del objeto.

??? example "Ejemplo: Delegar el privilegio SELECT"

    Como propietario de `poblacions` o rol autorizado, concede a `usulector` permiso de consulta con opción de concederlo:

    ```sql
    GRANT SELECT ON TABLE public.poblacions TO usulector WITH GRANT OPTION;
    ```

    Después, conectado como `usulector`, puede conceder ese privilegio a otro rol:

    ```sql
    GRANT SELECT ON TABLE public.poblacions TO usueditor;
    ```


## Retirar privilegios

`REVOKE` retira una concesión concreta. El destinatario puede conservar el mismo privilegio si lo recibe por otra concesión, `PUBLIC`, una membresía o por ser propietario del objeto.

Sintaxis básica:

```sql
REVOKE privilegio [, ...]
ON { DATABASE | SCHEMA | TABLE } nombre_objeto [, ...]
FROM nombre_rol [, ...];
```

??? example "Ejemplo: Retirar privilegios"

    Conectado a `geo` como el rol que realizó la concesión o como otro rol autorizado:

    ```sql
    -- Retirar la concesión de conexión al perfil de lectura
    REVOKE CONNECT ON DATABASE geo FROM geo_lectura;

    -- Retirar la concesión de uso del esquema
    REVOKE USAGE ON SCHEMA public FROM geo_lectura;

    -- Retirar la concesión de actualización sobre poblacions
    REVOKE UPDATE ON TABLE public.poblacions FROM geo_edicion;
    ```

    Retirar `CONNECT` no cierra las sesiones ya establecidas. 
    Retirar `USAGE` no elimina los privilegios sobre las tablas del esquema, aunque puede impedir acceder a ellas mediante su nombre.


### Retirar la opción de concesión

Para retirar la capacidad de conceder un privilegio sin retirar el privilegio en sí, se utiliza la opción `GRANT OPTION FOR`:

Sintaxis básica:

```sql
REVOKE GRANT OPTION FOR privilegio [, ...]
ON { DATABASE | SCHEMA | TABLE } nombre_objeto [, ...]
FROM nombre_rol [, ...] [ CASCADE | RESTRICT ];
```

- `RESTRICT`, la opción predeterminada, impide la retirada si hay concesiones dependientes.
- `CASCADE` retira también las concesiones dependientes.


??? example "Ejemplo: Retirar la opción de concesión"

    Se retira a `usulector` la posibilidad de delegar `SELECT`, sin quitarle el permiso para consultar la tabla.

    ```sql
    REVOKE GRANT OPTION FOR SELECT
    ON TABLE public.poblacions
    FROM usulector;
    ```

    Esta sentencia retira la opción de concesión de `SELECT` a `usulector`, pero mantiene esa concesión de `SELECT`. Si `usulector` ya ha concedido el privilegio a otros roles, existen concesiones dependientes:


## Consultar privilegios efectivos

PostgreSQL ofrece funciones que comprueban los **privilegios efectivos de un rol**:

| Función | Comprobación |
|---|---|
| `has_database_privilege` | Privilegios sobre una base de datos, como `CONNECT`. |
| `has_schema_privilege` | Privilegios sobre un esquema, como `USAGE`. |
| `has_table_privilege` | Privilegios sobre una tabla, como `SELECT` o `UPDATE`. |

Devuelven `true` o `false` e incluyen los privilegios recibidos por membresía. Comprueba los tres niveles: que `has_table_privilege` devuelva `true` no demuestra por sí solo que el rol pueda conectarse o acceder al esquema.

??? example "Ejemplo: Comprobar el acceso de usulector a public.poblacions"

    Comprobar el acceso de `usulector` a `public.poblacions`:

    ```sql
    SELECT has_database_privilege('usulector', 'geo', 'CONNECT') AS puede_conectar,
           has_schema_privilege('usulector', 'public', 'USAGE') AS puede_usar_esquema,
           has_table_privilege('usulector', 'public.poblacions', 'SELECT') AS puede_consultar;
    ```


??? example "Ejemplo: Comparar los privilegios de los dos usuarios sobre la tabla"

    Comparar los privilegios de los dos usuarios sobre la tabla:

    ```sql
    SELECT
        has_table_privilege('usulector', 'public.poblacions', 'SELECT') AS usulector_consulta,
        has_table_privilege('usulector', 'public.poblacions', 'UPDATE') AS usulector_actualiza,
        has_table_privilege('usueditor', 'public.poblacions', 'SELECT') AS usueditor_consulta,
        has_table_privilege('usueditor', 'public.poblacions', 'UPDATE') AS usueditor_actualiza,
        has_table_privilege('usueditor', 'public.poblacions', 'DELETE') AS usueditor_elimina;
    ```


Si están vigentes los perfiles iniciales, sus membresías permiten heredar los permisos y los usuarios no reciben privilegios adicionales por otras vías, como `PUBLIC`, propiedad o superusuario:

| Comprobación | Resultado esperado |
|---|---|
| `usulector` puede consultar | `true` |
| `usulector` puede actualizar | `false` |
| `usueditor` puede consultar | `true` |
| `usueditor` puede actualizar | `true` |
| `usueditor` puede eliminar | `false` |

Los ejemplos de `REVOKE` y de concesiones amplias modifican estos resultados. Si no coinciden con lo esperado, revisa las concesiones, las membresías y los permisos de `PUBLIC`.



**Conceder acceso a las vistas**

Una vista normal comprueba por defecto los permisos sobre las tablas subyacentes usando los del propietario de la vista. Por ello, quien la consulta puede no necesitar `SELECT` directo sobre las tablas originales.

??? example "Ejemplo: Acceder a una vista sin acceso directo a la tabla"

    Ejecuta este ejemplo como superusuario `postgres`, conectado a `geo`. Si estos roles ya existen por haber realizado el ejemplo anteriormente, no vuelvas a crearlos. El nuevo usuario tendrá acceso a la vista, pero no a la tabla `poblacions`:

    ```sql
    CREATE ROLE geo_solo_vistas NOLOGIN;
    CREATE ROLE usuvisor LOGIN PASSWORD 'Cambiar_En_Practicas_2026';

    GRANT geo_solo_vistas TO usuvisor;
    GRANT CONNECT ON DATABASE geo TO geo_solo_vistas;
    GRANT USAGE ON SCHEMA public TO geo_solo_vistas;
    GRANT SELECT ON public.vista_mas_de_700 TO geo_solo_vistas;
    ```


El propietario de la vista debe poder consultar la tabla base. Comprueba que `usuvisor` no recibe `SELECT` sobre ella por otra concesión, `PUBLIC` u otra membresía; de lo contrario, la vista no limitará su acceso directo. Verifica los permisos conectándote como `usuvisor`.

Como ampliación, la opción `security_invoker` de PostgreSQL modifica cómo se comprueban los permisos sobre las tablas subyacentes.


## Actividades relacionadas

- [Actividad 1: Creación de usuarios y concesión de permisos](00-actividades.md#actividad-1-creacion-de-usuarios-y-concesion-de-permisos).
- [Actividad 2: Creación de un grupo y asignación de permisos](00-actividades.md#actividad-2-creacion-de-un-grupo-y-asignacion-de-permisos).
- [Actividad 4: Creación de una base de datos y concesión de permisos](00-actividades.md#actividad-4-creacion-de-una-base-de-datos-y-concesion-de-permisos).
- [Actividad 11: Creación de vistas y gestión de permisos](00-actividades.md#actividad-11-creacion-de-vistas-y-gestion-de-permisos).
