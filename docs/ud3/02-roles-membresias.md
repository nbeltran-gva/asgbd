# 2. Roles y membresías de roles

En PostgreSQL, los **roles** se utilizan para identificar a los usuarios y gestionar sus permisos. 

En este apartado aprenderás a realizar las siguientes acciones:

| Acción | Sentencia o comando | Función |
|---|---|---|
| Gestión de roles | `CREATE ROLE` / `ALTER ROLE` / `DROP ROLE` | Crear, modificar o eliminar roles. |
| Gestión de membresías | `GRANT` / `REVOKE` | Asignar o retirar una membresía entre roles. |
| Activación de roles | `SET ROLE` / `RESET ROLE` | Activar otro rol o recuperar el rol inicial de la sesión. |
| Consulta de roles | `\du` | Mostrar los roles desde `psql`. |


## Gestión de roles

### Crear roles

!!! quote "Sintaxis básica"

    ```sql
    CREATE ROLE nombre_rol
        [ [ WITH ] atributos [ ... ] ];
    ```

#### Atributos principales

| Atributos | Función | Valor predeterminado |
|---|---|---|
| `LOGIN` / `NOLOGIN` | Permite o impide iniciar sesión. | `NOLOGIN` |
| `PASSWORD 'contraseña'` | Establece la contraseña del rol para los métodos de autenticación que la utilizan. No concede por sí sola el atributo `LOGIN`. | Sin contraseña |
| `SUPERUSER` / `NOSUPERUSER` | Concede o impide privilegios de superusuario. | `NOSUPERUSER` |
| `CREATEDB` / `NOCREATEDB` | Permite o impide crear bases de datos. | `NOCREATEDB` |
| `CREATEROLE` / `NOCREATEROLE` | Permite o impide administrar roles. | `NOCREATEROLE` |
| `INHERIT` / `NOINHERIT` | Establece el comportamiento de herencia predeterminado del rol respecto a las membresías. | `INHERIT` |
| `CONNECTION LIMIT` | Limita las conexiones simultáneas. | `-1` (sin límite específico) |
| `VALID UNTIL` | Establece la caducidad de la contraseña, no la caducidad del rol. | Sin caducidad |

??? example "Ejemplo: Crear roles"

    Ejecuta este bloque una sola vez, con un rol autorizado para crear roles. Estos usuarios y grupos se utilizarán en los ejemplos de membresías y privilegios de los capítulos siguientes.

    ```sql
    -- Crear el usuario de solo lectura y asignarle una contraseña.
    CREATE ROLE usulector LOGIN PASSWORD 'Usulector_2026';

    -- Crear el usuario de edición y asignarle una contraseña.
    CREATE ROLE usueditor LOGIN PASSWORD 'Usueditor_2026';

    -- Crear el grupo que reunirá los privilegios de consulta.
    CREATE ROLE geo_lectura NOLOGIN;

    -- Crear el grupo que reunirá los privilegios de edición.
    CREATE ROLE geo_edicion NOLOGIN;

    -- Crear el usuario que será propietario de geodb.
    CREATE ROLE usubd LOGIN PASSWORD 'Usubd_2006';
  
    -- Crear el usuario con permiso para crear bases de datos.
    CREATE ROLE usuadmin CREATEDB LOGIN PASSWORD 'Admin_2026';

    -- Crear el usuario con permiso para administrar roles.
    CREATE ROLE usugestor CREATEROLE LOGIN PASSWORD 'Gestor_2026';
    ```


### Modificar roles

Permite cambiar los atributos y las características de un rol existente. 

!!! quote "Sintaxis básica"

    ```sql
    ALTER ROLE nombre_rol
        [ [ WITH ] atributos [ ... ] ];
    ```

Para cambiar sus atributos puedes usar muchas de las mismas opciones vistas en `CREATE ROLE`, como `LOGIN`, `NOLOGIN`, `CREATEDB` o `NOCREATEDB`.

??? example "Ejemplo: Modificar roles"

    Ejecuta este ejemplo con un superusuario o con un rol autorizado para crear y modificar roles. Utiliza un rol temporal para no cambiar los atributos de `usulector`, `usueditor` ni los grupos que se necesitan en los apartados posteriores.

    ```sql
    -- Crear un rol temporal para probar sus modificaciones.
    CREATE ROLE rol_temporal;

    -- Habilitar el inicio de sesión y establecer una contraseña.
    ALTER ROLE rol_temporal LOGIN PASSWORD 'Temporal_2026';
    -- Deshabilitar el inicio de sesión.
    ALTER ROLE rol_temporal NOLOGIN;
    -- Volver a habilitar el inicio de sesión.
    ALTER ROLE rol_temporal LOGIN;
    -- Permitir la creación de bases de datos.
    ALTER ROLE rol_temporal CREATEDB;
    -- Retirar el permiso para crear bases de datos.
    ALTER ROLE rol_temporal NOCREATEDB;
    -- Permitir la administración de roles.
    ALTER ROLE rol_temporal CREATEROLE;
    -- Retirar el permiso para administrar roles.
    ALTER ROLE rol_temporal NOCREATEROLE;
    -- Limitar a cinco las conexiones simultáneas del rol.
    ALTER ROLE rol_temporal CONNECTION LIMIT 5;
    -- Establecer la fecha de caducidad de la contraseña.
    ALTER ROLE rol_temporal VALID UNTIL '2027-06-30';
    -- Establecer work_mem para las sesiones de este rol.
    ALTER ROLE rol_temporal SET work_mem = '16MB';
    -- Eliminar la configuración de work_mem establecida para el rol.
    ALTER ROLE rol_temporal RESET work_mem;
    -- Cambiar el nombre del rol.
    ALTER ROLE rol_temporal RENAME TO rol_temporal_bd;
    -- Eliminar el rol temporal al terminar las pruebas.
    DROP ROLE rol_temporal_bd;
    ```


### Borrar roles

Borra un rol del clúster PostgreSQL.

!!! quote "Sintaxis básica"

    ```sql
    DROP ROLE [IF EXISTS] nombre_rol [, ...];
    ```

#### Roles sin dependencias

??? example "Ejemplo: Eliminar un rol sin dependencias"

    Eliminar un rol temporal que no tiene dependencias:

    ```sql
    -- Crear un rol temporal para el ejemplo.
    CREATE ROLE rol_temporal;

    -- Eliminar el rol temporal, que no tiene dependencias.
    DROP ROLE rol_temporal;
    ```

#### Roles con membresía

Cuando un rol pertenece a otro, existe una **membresía** entre ambos. Si se elimina el rol miembro, PostgreSQL elimina automáticamente esa membresía, pero el grupo y sus posibles privilegios permanecen.

??? example "Ejemplo: Eliminar un miembro de un grupo"

    El rol temporal se hace miembro de `geo_lectura` y después se elimina. El grupo y sus privilegios permanecen:

    ```sql
    -- Crear un rol temporal que pueda iniciar sesión.
    CREATE ROLE rol_temporal LOGIN;

    -- Hacer que el rol temporal sea miembro del grupo de lectura.
    GRANT geo_lectura TO rol_temporal;

    -- Eliminar el miembro temporal; la membresía desaparece con él.
    DROP ROLE rol_temporal;
    ```

    Comprueba que `geo_lectura` sigue existiendo mediante la vista `pg_roles`:

    ```sql
    -- Comprobar que el grupo de lectura sigue existiendo.
    SELECT rolname FROM pg_roles WHERE rolname = 'geo_lectura';
    ```


!!! info "Recuerda"

    Los roles y sus membresías se comparten en todo el clúster; no pertenecen exclusivamente a la base de datos `geo`.

#### Roles con dependencias

Si un rol posee objetos (es propietario) o tiene privilegios concedidos, es necesario resolver esas dependencias antes de eliminarlo.  En esos casos, puede ser necesario reasignar la propiedad y revocar los privilegios antes de eliminarlo.

Para **conservar sus objetos**, sigue estos pasos:

1. **Reasignar la propiedad** a un rol existente con `REASSIGN OWNED BY`.
2. **Retira los privilegios y dependencias correspondientes (elimina objetos que pertenecen al rol)** con `DROP OWNED BY`.
3. Repite los dos pasos anteriores en cada base de datos donde el rol tenga objetos o privilegios. 
4. Cuando se hayan resuelto todas sus dependencias, **elimina el rol** con `DROP ROLE`.

Las dos primeras sentencias se ejecutan conectado a cada base de datos afectada y se necesitan los permisos adecuados para ejecutar ambas operaciones:

??? example "Ejemplo: Eliminar el rol conservando sus objetos"

    Eliminar el rol `usulector` conservando sus objetos.

    Este es un escenario hipotético: no ejecutes estas sentencias sobre los roles de práctica si no tienen esas dependencias. Supongamos que `usulector` es propietario de objetos y tiene privilegios concedidos, y que existe `usugestor`. En cada base de datos afectada, transferimos los objetos de `usulector` a `usugestor` y retiramos sus privilegios y otras dependencias:

    ```sql
    -- Cambiar la propiedad de los objetos de un rol
    REASSIGN OWNED BY usulector TO usugestor;

    -- Retirar los privilegios y dependencias del rol en la base de datos actual
    DROP OWNED BY usulector;
    ```

    Una vez resueltas todas las dependencias en las bases de datos del clúster, eliminamos el rol:

    ```sql
    -- Eliminar el rol después de resolver sus dependencias.
    DROP ROLE usulector;
    ```


### Utilizar ROLE o USER

En PostgreSQL, los usuarios y los grupos son roles. Por ello:

- `CREATE USER` admite los mismos atributos que `CREATE ROLE`.
-  La diferencia es que `CREATE USER` utiliza `LOGIN` por defecto, mientras que `CREATE ROLE` utiliza `NOLOGIN`.
- `ALTER USER` es equivalente a `ALTER ROLE`: ambos permiten modificar los atributos de un rol existente.
- `DROP USER` es equivalente a `DROP ROLE`: ambos eliminan el rol, siempre que no existan dependencias que lo impidan.

Por tanto, estas dos sentencias son equivalentes. Ejecuta solo una y utiliza un nombre de rol que todavía no exista:

```sql
-- Crear un usuario nuevo; CREATE USER permite iniciar sesión por defecto.
CREATE USER nuevo_usuario;
```

O, de forma equivalente:

```sql
-- Crear el mismo tipo de rol con la sintaxis alternativa.
CREATE ROLE nuevo_usuario LOGIN;
```


## Gestión de membresías

Una **membresía** indica que un rol es miembro de otro.

> Por ejemplo, `usulector` puede ser miembro del rol de grupo `geo_lectura`. Así, los privilegios de consulta se pueden conceder al grupo en lugar de asignarlos individualmente a cada usuario.

> Según la configuración de la membresía, `usulector` podrá **heredar** los privilegios de `geo_lectura` o **activarlo** para trabajar con ese rol. En PostgreSQL 16 o posterior, las opciones `INHERIT` y `SET` controlan, respectivamente, estas posibilidades para cada membresía.

Los roles y sus membresías se comparten en todo el clúster, aunque los privilegios se conceden sobre objetos concretos.

### Asignar membresía

Un administrador autorizado puede conceder una membresía con `GRANT`:

!!! quote "Sintaxis básica"

    ```sql
    GRANT rol_grupo TO rol_miembro;
    ```

??? example "Ejemplo: Asignar membresía"

    Asignar los perfiles de lectura a `usulector` y de edición a `usueditor`:

    ```sql
    -- Asignar el grupo de lectura al usuario.
    GRANT geo_lectura TO usulector;

    -- Asignar el grupo de edición al usuario.
    GRANT geo_edicion TO usueditor;
    ```

#### Atributos 

En PostgreSQL 16 o posterior, `GRANT` permite configurar estas opciones para cada membresía:

| Opción | Función |
|---|---|
| `ADMIN` | Permite al miembro conceder o retirar la membresía a otros roles. |
| `INHERIT` | Permite al miembro heredar automáticamente los privilegios del rol concedido. |
| `SET` | Permite al miembro activar el rol concedido mediante `SET ROLE`. |

Cada opción admite `TRUE` o `FALSE`:

??? example "Ejemplo: Configurar opciones de membresía"

    Se configura la membresía para que `usulector` herede y pueda activar `geo_lectura`, pero no administrarla.

    ```sql
    -- Asignar el grupo con opciones explícitas de administración, herencia y activación.
    GRANT geo_lectura TO usulector
    WITH ADMIN FALSE, INHERIT TRUE, SET TRUE;
    ```

    En esta membresía, `usulector` hereda los privilegios de `geo_lectura` y puede activarlo, pero no recibe la opción de administrarlo. La configuración se aplica a la relación entre ambos roles, no a todas las membresías de `usulector`.

### Retirar una membresía

Para retirar la pertenencia de un rol a otro se utiliza `REVOKE` sin indicar un objeto. Esta operación elimina la membresía, pero no los roles ni los privilegios recibidos directamente o por otras vías:

!!! quote "Sintaxis básica"

    ```sql
    REVOKE rol_grupo FROM rol_miembro;
    ```

??? example "Ejemplo: Retirar membresía"

    Retirar a `usueditor` del grupo `geo_edicion`:

    ```sql
    -- Retirar a usueditor la membresía en el grupo de edición.
    REVOKE geo_edicion FROM usueditor;
    ```

    Para continuar con los ejemplos que utilizan este perfil, restablece la membresía:

    ```sql
    -- Restablecer la membresía de edición para los siguientes ejemplos.
    GRANT geo_edicion TO usueditor;
    ```


## Activación de roles

### Activar roles

`SET ROLE` permite cambiar el rol activo durante una sesión sin abrir una nueva conexión. PostgreSQL comprueba los permisos usando el rol seleccionado y sus privilegios efectivos; el usuario de la sesión (`session_user`) no cambia.

!!! quote "Sintaxis básica"

    ```sql
    -- Activar el rol especificado en la sesión.
    SET ROLE nombre_rol;
    ```

Para activar un rol, el usuario de la sesión debe tener una membresía que permita cambiar a él. En PostgreSQL 16 o posterior, la opción `SET` de la membresía controla esta posibilidad. Un superusuario puede activar cualquier rol. Activar otro rol puede limitar o ampliar los privilegios disponibles.

### Desactivar roles

`RESET ROLE` restablece el rol configurado al iniciar la conexión; si no hay uno configurado, vuelve al rol de la sesión:

!!! quote "Sintaxis básica"

    ```sql
    -- Recuperar el rol activo inicial de la sesión.
    RESET ROLE;
    ```

??? example "Ejemplo: Activar y restablecer un rol"

    El usuario `usulector` activa temporalmente el rol `geo_lectura` para consultar la base de datos `geo` y después recupera su rol inicial.

    Como administrador autorizado, comprueba que existen `usulector` y `geo_lectura` y concede la membresía. En PostgreSQL 16 o posterior, asegúrate de que la opción `SET` esté habilitada:

    ```sql
    -- Permitir a usulector activar el rol de lectura (PostgreSQL 16 o posterior).
    GRANT geo_lectura TO usulector WITH SET TRUE;
    ```

    Esta sintaxis es para PostgreSQL 16 o posterior. En versiones anteriores, utiliza esta alternativa:

    ```sql
    -- Asignar la membresía con las opciones predeterminadas de la versión.
    GRANT geo_lectura TO usulector;
    ```

    Conéctate a `geo` como `usulector`. Suponiendo que no hay un rol inicial configurado, consulta la identidad de la sesión antes y después de activar `geo_lectura`:

    ```sql
    -- Mostrar el usuario de conexión y el rol activo inicialmente.
    SELECT session_user, current_user;

    -- Activar el rol de lectura durante esta sesión.
    SET ROLE geo_lectura;

    -- Comprobar que cambió el rol activo, pero no el de conexión.
    SELECT session_user, current_user;

    -- Desactivar el rol de lectura y recuperar el rol inicial.
    RESET ROLE;

    -- Verificar que se restableció el rol activo inicial.
    SELECT session_user, current_user;
    ```

    Los resultados esperados de las consultas son, en orden: `usulector / usulector`, `usulector / geo_lectura` y `usulector / usulector`.

Activar `geo_lectura` no concede por sí solo acceso a las tablas: los privilegios deben haberse concedido previamente al rol activo.

## Consulta de roles

PostgreSQL permite consultar los roles mediante vistas y comandos de consola.

#### Vistas del catálogo del sistema

PostgreSQL guarda información sobre los roles y sus membresías en catálogos del sistema. Estas vistas y tablas permiten consultar sus atributos y relaciones mediante SQL.

| Vista o catálogo | Información |
|---|---|
| `pg_roles` | Información general de los roles, incluidos sus atributos. No muestra las contraseñas. |
| `pg_auth_members` | Membresías: qué roles son miembros de otros roles. |
| `pg_user` | Vista de compatibilidad que muestra información de los roles que pueden iniciar sesión. |
| `pg_group` | Vista de compatibilidad para consultar grupos y sus miembros. |
| `pg_authid` | Catálogo con información interna de autenticación. Su acceso está restringido. |

??? example "Ejemplo: Consultar los atributos de los roles"

    La consulta muestra cada rol y señala si tiene atributos de superusuario, creación de bases de datos o administración de roles, y si puede iniciar sesión.

    ```sql
    -- Mostrar el nombre y algunos atributos de todos los roles.
    SELECT rolname, rolsuper, rolcreatedb, rolcreaterole, rolcanlogin
    FROM pg_roles
    ORDER BY rolname;
    ```

??? example "Ejemplo: Consultar las membresías de los usuarios"

    La consulta muestra a qué roles pertenecen `usulector` y `usueditor`.

    ```sql
    -- Mostrar los roles de los que usulector y usueditor son miembros.
    SELECT miembro.rolname AS miembro, rol_concedido.rolname AS rol_concedido
    FROM pg_auth_members AS m
    JOIN pg_roles AS rol_concedido ON rol_concedido.oid = m.roleid
    JOIN pg_roles AS miembro ON miembro.oid = m.member
    WHERE miembro.rolname IN ('usulector', 'usueditor')
    ORDER BY miembro.rolname, rol_concedido.rolname;
    ```

#### Metacomandos de `psql`

En `psql`, se pueden utilizar estos metacomandos para consultar roles y privilegios sobre objetos:

| Metacomando | Información |
|---|---|
| `\du` | Muestra los roles y sus atributos. |
| `\dp` | Muestra los privilegios de acceso a tablas, vistas y secuencias. |
| `\z` | Muestra la misma información que `\dp`. |

??? example "Ejemplo: Consultar los privilegios de una tabla"

    En `psql`, muestra los privilegios asignados a la tabla `public.poblacions`:

    ```text
    \dp public.poblacions
    ```

??? example "Ejemplo: Consultar los roles"

    En `psql`, muestra los atributos del rol `usulector`:

    ```text
    \du usulector
    ```

??? example "Ejemplo: Consultar privilegios con `\z`"

    En `psql`, muestra los privilegios de la tabla `public.poblacions`. Este metacomando ofrece la misma información que `\dp`:

    ```text
    \z public.poblacions
    ```


#### Identidad de la sesión

PostgreSQL permite identificar el rol con el que se inició la sesión y el rol activo cuyos privilegios se aplican. Para consultarlos, ejecuta:

!!! quote "Identidad sesión"

    ```sql
    SELECT session_user, current_user;
    ```

- `session_user`: identifica el rol con el que se inició la sesión.
- `current_user`: identifica el rol cuyos privilegios se utilizan en ese momento. Puede cambiar, por ejemplo, al ejecutar `SET ROLE`.

??? example "Ejemplo: Organización de la base de datos geo"

    El diagrama muestra los roles y sus membresías en el clúster, junto con los objetos de la base de datos `geo`:

    ```text
    Instancia PostgreSQL
    └── Clúster
        ├── Roles
        │   ├── geo (propietario de la base de datos geo)
        │   ├── geo_lectura (NOLOGIN)
        │   │   └── Miembro: usulector (LOGIN)
        │   ├── geo_edicion (NOLOGIN)
        │   │   └── Miembro: usueditor (LOGIN)
        │   ├── usubd (LOGIN)
        │   ├── usuadmin (LOGIN, CREATEDB)
        │   └── usugestor (LOGIN, CREATEROLE)
        └── Base de datos: geo
            └── Esquema: public
                ├── Tabla: comarques
                ├── Tabla: poblacions
                ├── Tabla: instituts
                └── Vista: vista_mas_de_700
    ```


## Actividades relacionadas

- [Actividad 1: Creación de usuarios y concesión de permisos](00-actividades.md#actividad-1-creacion-de-usuarios-y-concesion-de-permisos).
- [Actividad 2: Creación de un grupo y asignación de permisos](00-actividades.md#actividad-2-creacion-de-un-grupo-y-asignacion-de-permisos).
- [Actividad 3: Consulta de usuarios y grupos del sistema](00-actividades.md#actividad-3-consulta-de-usuarios-y-grupos-del-sistema).
