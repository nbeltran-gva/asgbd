# 1. Control de acceso y organización lógica

Un SGBD debe proteger la información frente a accesos no autorizados y permitir que cada persona realice únicamente las operaciones necesarias. En PostgreSQL, el control de acceso se organiza mediante **roles**, **privilegios** y la **propiedad de los objetos**.

Para comprender cómo se aplica, primero conoceremos la organización de PostgreSQL y después veremos cómo se identifican los usuarios y se determinan sus permisos.

## Organización lógica de PostgreSQL

### Clúster y bases de datos

Un **clúster** es el conjunto de bases de datos gestionadas por una instancia de PostgreSQL. Puede contener varias bases de datos; cada conexión trabaja con una de ellas.

Los **roles** y los **tablespaces** se comparten en todo el clúster. Los roles identifican usuarios y grupos; los tablespaces indican ubicaciones físicas donde se pueden almacenar datos.

### Esquemas y objetos

Cada base de datos contiene **esquemas**, que organizan sus objetos:

- Una **tabla** almacena datos en filas y columnas.
- Una **vista** es una consulta guardada que se puede utilizar como una tabla.
- También existen otros objetos, como secuencias y funciones.

Un mismo nombre de tabla puede existir en esquemas diferentes. Por eso se puede indicar el esquema antes del nombre: `public.poblacions`.

??? example "Ejemplo: Organización de la base de datos geo"

    En los ejemplos de la unidad, la base de datos `geo` contiene estas tablas y esta vista en el esquema `public`:

    ```text
    Clúster PostgreSQL
    ├── Rol: geo (propietario)
    └── Base de datos: geo
        └── Esquema: public
            ├── Tabla: comarques
            ├── Tabla: poblacions
            ├── Tabla: instituts
            └── Vista: vista_mas_de_700
    ```

    El rol `geo` pertenece al clúster y es propietario de la base de datos y de los objetos de estos ejemplos. En el capítulo de roles se crearán los usuarios y grupos que practicarán el acceso a esos objetos.

### Organización lógica y almacenamiento físico

Los esquemas organizan los objetos **lógicamente**. Los datos se almacenan **físicamente** en archivos del servidor; los tablespaces permiten utilizar otras ubicaciones de almacenamiento.

## Autenticación y autorización

El control de acceso comprende dos procesos:

1. La **autenticación** verifica **quién** se conecta. En PostgreSQL, la conexión se realiza con un rol que tenga `LOGIN`; el método de autenticación se configura, por ejemplo, en `pg_hba.conf`. No determina por sí sola qué puede hacer ese rol.
2. La **autorización** determina **qué** puede hacer el rol una vez conectado. En ella intervienen los privilegios, la propiedad de los objetos y, según el caso, la membresía en otros roles.

??? example "Ejemplo: Autenticación y autorización"

    PostgreSQL valida la contraseña de `usulector` para autenticarlo y, una vez conectado, comprueba si tiene permiso para consultar las tablas `comarques`, `poblacions` e `instituts`.

    | Proceso | Pregunta | Ejemplo sobre la BD `geo` |
    |---|---|---|
    | Autenticación | ¿Quién eres? | Validar la contraseña de `usulector`. |
    | Autorización | ¿Qué puedes hacer? | Comprobar si `usulector` puede consultar las tablas `comarques`, `poblacions` e `instituts` de la base de datos `geo`. |

### Roles y autenticación

En PostgreSQL, los **roles** se utilizan para identificar a los usuarios y gestionar sus permisos. Aunque normalmente hablamos de *usuarios* y *grupos*, PostgreSQL considera que ambos son tipos de roles.

1. Un rol con `LOGIN` puede conectarse al servidor PostgreSQL y se utiliza como **usuario**. `LOGIN` permite intentar conectarse, pero no verifica la identidad: esa comprobación depende del método de autenticación configurado, por ejemplo, en `pg_hba.conf`.
2. Un rol con `NOLOGIN` no puede conectarse directamente y se utiliza como **grupo de permisos**.

??? example "Ejemplo: Usuario y rol de grupo"

    El usuario `usulector` puede conectarse a la base de datos `geo` y recibir privilegios de consulta a través del rol de grupo `geo_lectura`, del que es miembro.

    | Tipo de rol | Pregunta | Ejemplo sobre la BD `geo` |
    |---|---|---|
    | Usuario (`LOGIN`) | ¿Quién puede conectarse? | `usulector` puede iniciar sesión en PostgreSQL y conectarse a la base de datos `geo`. |
    | Grupo (`NOLOGIN`) | ¿Cómo se agrupan los privilegios? | `geo_lectura` agrupa los privilegios de consulta sobre las tablas `comarques`, `poblacions` e `instituts`. Si `usulector` pertenece a ese rol y hereda sus privilegios, podrá consultar esas tablas. |

Un rol puede ser miembro de otro rol y heredar sus privilegios, si la membresía está configurada para permitirlo.

#### Rol inicial superusuario

En una instalación estándar, PostgreSQL crea un rol inicial con el atributo de superusuario `SUPERUSER`. Por defecto, este rol se llama `postgres`, aunque se puede elegir otro nombre al inicializar el clúster. Al ser un superusuario, tiene amplios privilegios de administración:

- Puede realizar operaciones administrativas en el clúster y omitir la mayoría de las comprobaciones de permisos de PostgreSQL.
- Se utiliza para tareas de instalación y administración, como gestionar roles y privilegios o realizar tareas de mantenimiento.
- No debe utilizarse como cuenta habitual de una aplicación ni para el trabajo diario.

### Privilegios y autorización

La **autorización** determina qué operaciones puede realizar un rol sobre los objetos, como bases de datos, esquemas, tablas, vistas, secuencias y funciones. Cada tipo de objeto admite distintos privilegios.

- El **propietario** de un objeto puede administrarlo y conceder privilegios sobre él.
- Los **privilegios** permiten realizar operaciones concretas. Un rol puede recibirlos directamente o, según la configuración de la membresía, heredarlos de otro rol.

??? example "Ejemplo: Privilegio de consulta"

    Si `usulector` tiene el privilegio `SELECT` sobre la tabla `poblacions`, puede consultarla. Ese privilegio no le permite administrar la tabla como su propietario ni consultar automáticamente las demás tablas.

## Principio de mínimo privilegio

Cada usuario debe disponer únicamente de los privilegios necesarios para su función.

| Perfil de usuario | Operaciones previstas sobre las tablas de la base de datos |
|---|---|
| Consulta | Consultar información, sin modificarla. |
| Edición | Consultar, insertar y actualizar datos. |
| Administración | Gestionar objetos y privilegios cuando sea necesario. |
