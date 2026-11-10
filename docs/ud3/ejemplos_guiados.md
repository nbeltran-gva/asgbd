# Ejemplos guiados: `geo` y `geodb`

Esta guía reúne, en orden, los cambios de los ejemplos de [Gestión de bases de datos y objetos](03-basesdatos-objetos.md). Se trabaja con dos bases de datos del mismo clúster: `geo`, que ya existe, y `geodb`, que crearemos durante la práctica.

## Antes de comenzar

- Utiliza un entorno de prácticas y una cuenta administradora con acceso al servidor.
- La base de datos `geo` debe contener las tablas `public.comarques`, `public.poblacions` y `public.instituts`. La tabla `poblacions` debe tener las columnas `nom`, `comarca` y `altura`.
- La guía se puede realizar de forma independiente o después del capítulo de roles. Si seguiste ese capítulo, `usubd` ya existe; créalo solo si aún no existe. `geodb` y los objetos nuevos no deben existir antes de ejecutar sus sentencias de creación. Comprueba el estado antes de continuar y no elimines objetos existentes sin revisarlos.
- Las conexiones deben estar permitidas por `pg_hba.conf`. Usa la contraseña del ejemplo solo en prácticas y cámbiala en un entorno real.
- Los comandos `psql` que aparecen en la terminal se ejecutan **fuera** de `psql`; las sentencias SQL, dentro de la sesión indicada. En pgAdmin, abre la herramienta de consultas de la base de datos correspondiente.

## 1. Crear el rol y la base de datos

Conéctate como superusuario `postgres` a la base de datos administrativa `postgres`. Por ejemplo, desde la terminal:

```bash
psql -U postgres -d postgres
```

Si `usubd` no existe —por ejemplo, si realizas la guía de forma independiente— créalo como superusuario:

```sql
CREATE ROLE usubd LOGIN PASSWORD 'Usubd_2006';
```

Después, todavía conectado como `postgres`, ejecuta cada sentencia por separado, sin envolverlas en una transacción:

```sql
CREATE DATABASE geodb;

ALTER DATABASE geodb OWNER TO usubd;
```

- `usubd` es un rol que puede iniciar sesión. Si ya se creó en el capítulo de roles, no vuelvas a ejecutar `CREATE ROLE`.
- `postgres` crea `geodb` y después asigna su propiedad a `usubd`.
- Como propietario, `usubd` puede crear esquemas en `geodb`. No puede crear otras bases de datos solo por ser propietario de esta: no tiene el atributo `CREATEDB`.

Para comprobar la propiedad, ejecuta en `psql`:

```text
\l geodb
```

Sal de la sesión con `\q` antes de abrir la siguiente conexión.

## 2. Crear esquemas en `geodb`

Desde la terminal, conéctate como `usubd`:

```bash
psql -U usubd -d geodb
```

Dentro de esta sesión, crea los esquemas:

```sql
CREATE SCHEMA administracio;
CREATE SCHEMA estadisticas;
```

Comprueba que aparecen junto a `public`:

```text
\dn
```

## 3. Crear y modificar tablas en `geodb`

Continúa conectado a `geodb` como `usubd`:

```sql
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
```

Mueve la tabla de notas al esquema `administracio` y añade una columna:

```sql
ALTER TABLE public.notas_comarcas SET SCHEMA administracio;

ALTER TABLE administracio.notas_comarcas
ADD COLUMN fecha_revision date;
```

Elimina únicamente la tabla creada para practicar la eliminación:

```sql
DROP TABLE public.tabla_prueba;
```

Comprueba las tablas que permanecen:

```text
\dt administracio.*
\dt estadisticas.*
```

## 4. Crear y modificar vistas en `geodb`

Sin cambiar de conexión, crea una vista sobre cada una de las tablas anteriores:

```sql
CREATE VIEW estadisticas.vista_comarcas_mas10 AS
SELECT comarca, numero_poblaciones
FROM estadisticas.resumen_comarcas
WHERE numero_poblaciones > 10;

CREATE VIEW administracio.vista_notas_revisadas AS
SELECT comarca, observaciones, fecha_revision
FROM administracio.notas_comarcas
WHERE fecha_revision IS NOT NULL;
```

Cambia el nombre de la primera vista y consulta ambas:

```sql
ALTER VIEW estadisticas.vista_comarcas_mas10
RENAME TO vista_resumen_comarcas;

SELECT * FROM estadisticas.vista_resumen_comarcas;
SELECT * FROM administracio.vista_notas_revisadas;
```

Las consultas pueden devolver cero filas si las tablas no contienen datos que cumplan las condiciones. Sal de `psql` con `\q`.

## 5. Crear y eliminar vistas en `geo`

Desde la terminal, conéctate a `geo` como `geo` o como otro rol autorizado. El rol debe poder consultar `public.poblacions`, crear vistas en `public` y ser propietario de la vista existente `vista_mas_de_700` para reemplazarla; un superusuario también puede hacerlo:

```bash
psql -U geo -d geo
```

La vista `vista_mas_de_700` ya forma parte del estado inicial. Actualízala con una definición compatible y crea otra para las poblaciones situadas a 700 metros o menos:

```sql
CREATE OR REPLACE VIEW public.vista_mas_de_700 AS
SELECT nom, comarca, altura
FROM public.poblacions
WHERE altura > 700;

CREATE VIEW public.vista_hasta_700 AS
SELECT nom, comarca, altura
FROM public.poblacions
WHERE altura <= 700;
```

Si la vista existente `vista_mas_de_700` tiene columnas incompatibles con esta definición, `CREATE OR REPLACE VIEW` fallará: revisa su definición antes de modificarla. Consulta ambas vistas:

```sql
SELECT * FROM public.vista_mas_de_700;
SELECT * FROM public.vista_hasta_700;
```

Finalmente, elimina solo la vista creada para este ejemplo:

```sql
DROP VIEW public.vista_hasta_700;
```

La tabla `public.poblacions`, sus datos y la vista `public.vista_mas_de_700` permanecen. La eliminación puede fallar si existen objetos dependientes. Sal con `\q`.

## 6. Organización lógica resultante

Tras los pasos anteriores, los objetos principales quedan así:

```text
Clúster PostgreSQL
├── Base de datos: geo
│   └── Esquema: public
│       ├── Tabla: comarques
│       ├── Tabla: poblacions
│       ├── Tabla: instituts
│       └── Vista: vista_mas_de_700
└── Base de datos: geodb (propietario: usubd)
    ├── Esquema: public
    ├── Esquema: administracio
    │   ├── Tabla: notas_comarcas
    │   └── Vista: vista_notas_revisadas
    └── Esquema: estadisticas
        ├── Tabla: resumen_comarcas
        └── Vista: vista_resumen_comarcas
```

## 7. Tablespaces: práctica opcional

Los siguientes pasos modifican el almacenamiento físico. Realízalos solo si dispones de dos ubicaciones adecuadas y autorización para administrarlas; no son necesarios para los pasos anteriores.

!!! warning "Preparación de los directorios"

    En el servidor, `/ssd/postgresql` y `/hdd/postgresql` deben ser rutas absolutas existentes y vacías, situadas en los dispositivos elegidos y accesibles para el usuario del sistema que ejecuta PostgreSQL. Adapta las rutas a tu entorno. No utilices directorios con datos existentes.

Conectado como superusuario `postgres`, crea los tablespaces fuera de un bloque de transacción:

```sql
CREATE TABLESPACE ts_rapido LOCATION '/ssd/postgresql';
CREATE TABLESPACE ts_gran_capacitat LOCATION '/hdd/postgresql';
```

Manteniendo la sesión de superusuario, conéctate a `geo` para mover `poblacions`:

```text
\c geo
```

```sql
ALTER TABLE public.poblacions SET TABLESPACE ts_rapido;
```

Conéctate después a `geodb` y mueve la tabla de resumen:

```text
\c geodb
```

```sql
ALTER TABLE estadisticas.resumen_comarcas SET TABLESPACE ts_gran_capacitat;
```

Para que `usubd` pueda crear una tabla en `ts_rapido`, concede el privilegio necesario desde la sesión de superusuario:

```sql
GRANT CREATE ON TABLESPACE ts_rapido TO usubd;
```

Sal con `\q`, vuelve a conectarte a `geodb` como `usubd` y crea la tabla:

```bash
psql -U usubd -d geodb
```

```sql
CREATE TABLE administracio.registro_consultas (
    fecha date,
    descripcion text
)
TABLESPACE ts_rapido;
```

Los esquemas de las tablas no cambian al moverlas de tablespace. Los índices asociados no se trasladan automáticamente. Tras esta práctica opcional, `registro_consultas` también aparece en el esquema `administracio`.

## Ejemplo integrador: roles, membresías y activación

Este ejemplo reúne la concesión de privilegios, la asignación de una membresía y la activación temporal de un rol. Utiliza PostgreSQL 16 o posterior y complementa los ejemplos de organización de objetos de esta guía.

!!! warning "Antes de comenzar"

    Trabaja en un entorno de prácticas. La base de datos `geo` y la tabla `public.poblacions` deben existir. Los roles `usulector` y `geo_lectura` pueden haberse creado en el capítulo de [roles y membresías](02-roles-membresias.md): comprueba su estado y créalos solo si faltan.

    Ejecuta las operaciones administrativas con un superusuario o con un rol que tenga permisos suficientes para crear roles, conceder privilegios y asignar la membresía. La conexión de `usulector` debe estar permitida por `pg_hba.conf`.

### 1. Crear los roles

Conectado a `geo` como administrador, crea los roles solo si aún no existen:

```sql
-- Crear el usuario de ejemplo solo si todavía no existe.
CREATE ROLE usulector LOGIN PASSWORD 'Usulector_2026';

-- Crear el grupo de lectura solo si todavía no existe.
CREATE ROLE geo_lectura NOLOGIN;
```

`usulector` puede iniciar sesión; `geo_lectura` se utiliza para agrupar permisos. La contraseña es solo para prácticas y debe sustituirse en un entorno real.

### 2. Conceder permisos al grupo

En la misma conexión administrativa, concede al grupo los permisos necesarios para consultar la tabla:

```sql
-- Conceder al grupo permiso para conectarse a geo.
GRANT CONNECT ON DATABASE geo TO geo_lectura;

-- Conceder al grupo permiso para acceder a los objetos del esquema public.
GRANT USAGE ON SCHEMA public TO geo_lectura;

-- Conceder al grupo permiso para consultar la tabla poblacions.
GRANT SELECT ON TABLE public.poblacions TO geo_lectura;
```

`CONNECT` permite acceder a la base de datos, `USAGE` permite acceder al esquema y `SELECT` permite consultar la tabla. Consulta [Privilegios sobre objetos](04-privilegios-objetos.md) para ampliar este tema.

### 3. Asignar la membresía

Con la misma conexión, haz que `usulector` sea miembro de `geo_lectura`:

```sql
-- Hacer miembro al usuario con opciones explícitas de la membresía.
GRANT geo_lectura TO usulector
WITH ADMIN FALSE, INHERIT TRUE, SET TRUE;
```

- `INHERIT TRUE` permite a `usulector` utilizar automáticamente los privilegios heredables del grupo.
- `SET TRUE` permite a `usulector` activar `geo_lectura`; no lo activa automáticamente.
- `ADMIN FALSE` no le concede la opción de administrar esa membresía.

Estas opciones se aplican a la relación entre `usulector` y `geo_lectura`. Otros privilegios, membresías o la opción de administración concedida por otra vía pueden afectar a lo que `usulector` puede hacer.

### 4. Consultar y activar el rol

Desde una terminal, abre una sesión en `geo` como `usulector`:

```bash
psql -U usulector -d geo
```

Suponiendo que no hay un rol inicial configurado, ejecuta:

```sql
-- Mostrar el usuario conectado y el rol activo antes de activar el grupo.
SELECT session_user, current_user;

-- Consultar poblacions con los privilegios heredados del grupo.
SELECT * FROM public.poblacions;

-- Activar el rol de grupo durante la sesión.
SET ROLE geo_lectura;

-- Comprobar el rol activo tras el cambio.
SELECT session_user, current_user;

-- Consultar poblacions con geo_lectura como rol activo.
SELECT * FROM public.poblacions;

-- Volver al rol inicial de la sesión.
RESET ROLE;

-- Confirmar que se ha recuperado el rol inicial.
SELECT session_user, current_user;
```

Al activar `geo_lectura`, PostgreSQL utiliza los privilegios efectivos de ese rol; no suma automáticamente todos los privilegios propios de `usulector`. Con `INHERIT TRUE`, la primera consulta puede funcionar sin activar el grupo.

### 5. Retirar la membresía

Como administrador, puedes retirar temporalmente la membresía:

```sql
-- Retirar temporalmente la membresía de usulector en geo_lectura.
REVOKE geo_lectura FROM usulector;
```

Esto no elimina los roles ni los privilegios concedidos al grupo. `usulector` podría conservar acceso a la tabla por permisos directos, otras membresías o `PUBLIC`. Comprueba los privilegios efectivos antes de concluir que ha perdido el acceso. Restablece la membresía para continuar con los siguientes ejemplos:

```sql
-- Restablecer la membresía y permitir herencia y activación del grupo.
GRANT geo_lectura TO usulector
WITH ADMIN FALSE, INHERIT TRUE, SET TRUE;
```

### Resumen

| Acción | Resultado |
|---|---|
| `GRANT SELECT ... TO geo_lectura` | Concede al grupo un privilegio sobre la tabla. |
| `GRANT geo_lectura TO usulector` | Hace que `usulector` sea miembro del grupo. |
| `INHERIT TRUE` | Permite heredar automáticamente los privilegios heredables del grupo. |
| `SET TRUE` | Autoriza a activar el grupo, pero no lo activa. |
| `SET ROLE geo_lectura` | Activa el grupo durante la sesión. |
| `RESET ROLE` | Recupera el rol inicial de la sesión. |
| `REVOKE geo_lectura FROM usulector` | Retira la membresía. |
