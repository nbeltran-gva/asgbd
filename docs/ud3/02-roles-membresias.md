# 2. Roles y membresías de roles

En PostgreSQL, los **roles** identifican a los usuarios y gestionan sus permisos. Un rol puede ser un **usuario** (puede iniciar sesión) o un **grupo** (reúne privilegios y tiene otros roles como miembros).

| Apartado | Sentencias o comandos | Función |
|---|---|---|
| Gestión de roles | `CREATE ROLE` / `ALTER ROLE` / `DROP ROLE` | Crear, modificar o eliminar roles. |
| Gestión de membresías | `GRANT` / `REVOKE` | Asignar o retirar una membresía entre roles. |
| Activación de roles | `SET ROLE` / `RESET ROLE` | Activar otro rol o recuperar el inicial. |
| Consulta de roles | `\du`, `pg_roles`, `pg_auth_members` | Consultar roles y membresías. |

!!! info "Roles y clúster"

    Los roles y sus membresías se comparten en todo el clúster: no pertenecen a una base de datos concreta.

## Gestión de roles

!!! quote "Sintaxis básica"

    | Operación | Sintaxis | Opciones |
    |---|---|---|
    | Crear | `CREATE ROLE nombre`<br>`[ [ WITH ] atributo [ ... ] ];` | `LOGIN` / `NOLOGIN`: permite o impide iniciar sesión (por defecto `NOLOGIN`).<br>`PASSWORD 'clave'`: establece la contraseña; no concede `LOGIN` por sí sola.<br>`SUPERUSER`: privilegios de superusuario.<br>`CREATEDB`: permite crear bases de datos.<br>`CREATEROLE`: permite administrar roles.<br>`INHERIT` / `NOINHERIT`: herencia predeterminada de las membresías (por defecto `INHERIT`).<br>`CONNECTION LIMIT n`: máximo de conexiones simultáneas (`-1` sin límite).<br>`VALID UNTIL 'fecha'`: caducidad de la contraseña, no del rol.<br>Todos los atributos son `NO...` por defecto. |
    | Modificar | `ALTER ROLE nombre`<br>`{ [ WITH ] atributo [ ... ]`<br>`\| RENAME TO nuevo_nombre`<br>`\| SET parametro = valor`<br>`\| RESET parametro };` | Admite los mismos atributos que `CREATE ROLE`.<br>`RENAME TO`: cambia el nombre.<br>`SET` / `RESET`: fija o elimina un parámetro de configuración para las sesiones del rol. |
    | Borrar | `DROP ROLE`<br>`[ IF EXISTS ] nombre [, ...];` | `IF EXISTS`: avisa en lugar de dar error si no existe.<br>El rol no debe tener objetos ni privilegios (ver más abajo). |

`CREATE USER` equivale a `CREATE ROLE ... LOGIN`; `ALTER USER` y `DROP USER` son equivalentes a `ALTER ROLE` y `DROP ROLE`.

??? example "Ejemplo: Crear los roles de la unidad"

    Ejecútalo una sola vez, con un rol autorizado para crear roles. Estos roles se usan en los capítulos siguientes.

    ```sql
    -- Usuarios de lectura y de edición
    CREATE ROLE usulector LOGIN PASSWORD 'Usulector_2026';
    CREATE ROLE usueditor LOGIN PASSWORD 'Usueditor_2026';

    -- Grupos de lectura y de edición
    CREATE ROLE geo_lectura NOLOGIN;
    CREATE ROLE geo_edicion NOLOGIN;

    -- Propietario de geodb
    CREATE ROLE usubd LOGIN PASSWORD 'Usubd_2006';

    -- Usuario que puede crear bases de datos
    CREATE ROLE usuadmin CREATEDB LOGIN PASSWORD 'Admin_2026';

    -- Usuario que puede administrar roles
    CREATE ROLE usugestor CREATEROLE LOGIN PASSWORD 'Gestor_2026';
    ```

??? example "Ejemplo: Modificar y borrar un rol temporal"

    Se usa un rol temporal para no alterar los roles de la unidad.

    ```sql
    -- Crear el rol temporal
    CREATE ROLE rol_temporal;

    -- Permitir iniciar sesión y establecer contraseña
    ALTER ROLE rol_temporal LOGIN PASSWORD 'Temporal_2026';

    -- Permitir crear bases de datos y limitar las conexiones
    ALTER ROLE rol_temporal CREATEDB CONNECTION LIMIT 5;

    -- Fijar la caducidad de la contraseña
    ALTER ROLE rol_temporal VALID UNTIL '2027-06-30';

    -- Fijar y eliminar un parámetro de sesión
    ALTER ROLE rol_temporal SET work_mem = '16MB';
    ALTER ROLE rol_temporal RESET work_mem;

    -- Cambiar el nombre y borrar el rol
    ALTER ROLE rol_temporal RENAME TO rol_temporal_bd;
    DROP ROLE rol_temporal_bd;
    ```

### Borrar roles con dependencias

- **Si es miembro de un grupo**, al borrarlo desaparece su membresía; el grupo y sus privilegios permanecen.
- **Si posee objetos o tiene privilegios**, hay que resolverlo antes de borrarlo. En **cada base de datos** donde tenga objetos o privilegios, conectado con los permisos adecuados:

    1. `REASSIGN OWNED BY rol TO otro_rol;` transfiere la propiedad de sus objetos.
    2. `DROP OWNED BY rol;` retira sus privilegios y borra los objetos que aún le pertenezcan.

    Después, ya sin dependencias, `DROP ROLE rol;`.

??? example "Ejemplo: Borrar un rol que tiene objetos (escenario hipotético)"

    Supón que `usulector` posee objetos y que existe `usugestor`. No lo ejecutes sobre los roles de práctica si no tienen esas dependencias.

    ```sql
    -- En cada base de datos afectada
    REASSIGN OWNED BY usulector TO usugestor;
    DROP OWNED BY usulector;

    -- Una vez resueltas todas las dependencias
    DROP ROLE usulector;
    ```

## Gestión de membresías

Una **membresía** indica que un rol es miembro de otro. Por ejemplo, `usulector` puede ser miembro de `geo_lectura`: así, los privilegios de consulta se conceden al grupo y no a cada usuario.

En PostgreSQL 16 o posterior, cada membresía tiene tres opciones: el miembro puede **heredar** los privilegios del grupo (`INHERIT`), **activarlo** con `SET ROLE` (`SET`) o **administrar** la membresía (`ADMIN`).

!!! quote "Sintaxis básica"

    | Operación | Sintaxis | Opciones |
    |---|---|---|
    | Asignar | `GRANT rol_grupo`<br>`TO rol_miembro`<br>`[ WITH { ADMIN \| INHERIT \| SET } { TRUE \| FALSE } [, ...] ];` | `ADMIN`: el miembro puede conceder o retirar la membresía a otros roles.<br>`INHERIT`: el miembro hereda los privilegios del grupo.<br>`SET`: el miembro puede activar el grupo con `SET ROLE`.<br>Las opciones se aplican solo a esta membresía. |
    | Retirar | `REVOKE rol_grupo`<br>`FROM rol_miembro;` | Elimina la membresía, pero no los roles ni los privilegios recibidos por otras vías. |

??? example "Ejemplo: Asignar y retirar membresías"

    ```sql
    -- Asignar los perfiles de lectura y edición
    GRANT geo_lectura TO usulector;
    GRANT geo_edicion TO usueditor;

    -- Asignar con opciones explícitas (PostgreSQL 16 o posterior)
    GRANT geo_lectura TO usulector
        WITH ADMIN FALSE, INHERIT TRUE, SET TRUE;

    -- Retirar la membresía de edición
    REVOKE geo_edicion FROM usueditor;

    -- Restablecerla para los ejemplos siguientes
    GRANT geo_edicion TO usueditor;
    ```

## Activación de roles

`SET ROLE` cambia el rol activo durante la sesión sin abrir otra conexión. PostgreSQL comprueba los permisos con el rol activo; el usuario de la sesión (`session_user`) no cambia.

!!! quote "Sintaxis básica"

    | Operación | Sintaxis | Opciones |
    |---|---|---|
    | Activar | `SET ROLE nombre_rol;` | El usuario necesita una membresía con `SET TRUE` (PostgreSQL 16 o posterior).<br>Un superusuario puede activar cualquier rol. |
    | Desactivar | `RESET ROLE;` | Recupera el rol inicial de la sesión. |

??? example "Ejemplo: Activar y restablecer un rol"

    Como administrador, permite a `usulector` activar `geo_lectura`. En versiones anteriores a PostgreSQL 16, usa solo `GRANT geo_lectura TO usulector;`.

    ```sql
    GRANT geo_lectura TO usulector WITH SET TRUE;
    ```

    Conectado a `geo` como `usulector`:

    ```sql
    SELECT session_user, current_user;  -- usulector / usulector
    SET ROLE geo_lectura;
    SELECT session_user, current_user;  -- usulector / geo_lectura
    RESET ROLE;
    SELECT session_user, current_user;  -- usulector / usulector
    ```

Activar `geo_lectura` no concede acceso a las tablas por sí solo: los privilegios deben haberse concedido antes a ese rol.

## Consulta de roles 

PostgreSQL permite consultar los roles mediante vistas y comandos de consola. Hay tres formas para realizar las consultas

| Tipo | Consulta | Información |
|---|---|---|
| **1. Vistas del catálogo del sistema** | `pg_roles` | Roles y atributos. No muestra las contraseñas. |
| | `pg_auth_members` | Membresías: qué roles son miembros de otros. |
| | `pg_user` y `pg_group` | Vistas de compatibilidad: usuarios con `LOGIN` y grupos con sus miembros. |
| | `pg_authid` | Información interna de autenticación; acceso restringido. |
| **2. Metacomandos de `psql`** | `\du` | Roles y sus atributos. |
| | `\dp` o `\z` | Privilegios sobre tablas, vistas y secuencias. |
| **3. Identidad de la sesión** | `session_user` | Rol con el que se inició la sesión. |
| | `current_user` | Rol activo, cuyos privilegios se aplican (cambia con `SET ROLE`). |

??? example "Ejemplo: Consultar los atributos de los roles"

    La consulta muestra cada rol y señala si tiene atributos de superusuario, creación de bases de datos o administración de roles, y si puede iniciar sesión.

    ```sql
    -- Atributos de todos los roles
    SELECT rolname, rolsuper, rolcreatedb, rolcreaterole, rolcanlogin
    FROM pg_roles
    ORDER BY rolname;
    ```

??? example "Ejemplo: Consultar roles y membresías"

    La consulta muestra a qué roles pertenecen `usulector` y `usueditor`.

    ```sql
    -- Roles de los que usulector y usueditor son miembros
    SELECT miembro.rolname AS miembro, rol_concedido.rolname AS rol_concedido
    FROM pg_auth_members AS m
    JOIN pg_roles AS rol_concedido ON rol_concedido.oid = m.roleid
    JOIN pg_roles AS miembro ON miembro.oid = m.member
    WHERE miembro.rolname IN ('usulector', 'usueditor')
    ORDER BY miembro.rolname, rol_concedido.rolname;
    ```

??? example "Ejemplo: Consultar roles y privilegios con metacomandos"

    En `psql`, el primero muestra los atributos del rol `usulector` y el segundo los privilegios de la tabla `public.poblacions`:

    ```text
    \du usulector
    \dp public.poblacions
    ```

??? example "Ejemplo: Consultar la identidad de la sesión"

    ```sql
    SELECT session_user, current_user;
    ```
    
## Actividades relacionadas

- [Actividad 1: Creación de usuarios](00-actividades.md#actividad-1-creacion-de-usuarios).
- [Actividad 2: Creación de un grupo y membresías](00-actividades.md#actividad-2-creacion-de-un-grupo-y-membresias).
- [Actividad 3: Consulta de usuarios y grupos del sistema](00-actividades.md#actividad-3-consulta-de-usuarios-y-grupos-del-sistema).
