# Ejemplos guiados de la UD3

Esta guía reúne y ordena los ejemplos principales de [roles y membresías](02-roles-membresias.md), [bases de datos y objetos](03-basesdatos-objetos.md), [privilegios](04-privilegios-objetos.md), [copias de seguridad](05-copias-restauracion.md) y [pgAdmin](06-pgadmin.md). Realiza las partes en orden: los roles y objetos creados al principio se reutilizan después.

## Antes de comenzar

- Trabaja en un entorno de prácticas con PostgreSQL 16 o posterior y acceso administrativo.
- Si necesitas instalar un servidor local, consulta el [anexo de PostgreSQL con Docker](08-anexo-postgresql-docker.md).
- Se parte de la base de datos `geo`, propiedad del rol `geo`, con las tablas `public.comarques`, `public.poblacions` e `public.instituts` y la vista `public.vista_mas_de_700`. `public.poblacions` debe tener las columnas `nom`, `comarca` y `altura`.
- El rol `postgres` es la cuenta administrativa del ejemplo. `geo` es un rol de PostgreSQL, propietario de la base de datos y sus objetos; la propiedad no implica que sea superusuario ni miembro de otro rol.
- Los ejemplos se ejecutan una sola vez. Antes de crear un rol, una base de datos o un objeto, comprueba si ya existe; no borres objetos existentes para poder repetir un ejemplo.
- Sustituye las contraseñas de prácticas y adapta las direcciones y rutas a tu entorno. No uses estas contraseñas en producción.
- Los comandos `psql`, `pg_dump` y `pg_restore` se ejecutan en la terminal. 
- Las sentencias SQL se ejecutan en `psql` o en **Query Tool** de pgAdmin. 
- Los comandos `\c`, `\du` y `\q` son metacomandos de `psql`, no SQL.

Comprueba el estado inicial:

```bash
sudo -u postgres psql -d postgres
```

```text
\du
\l
\q
```

Conéctate a `geo` como `postgres` o `geo` y confirma que existen las tablas y la vista:

```bash
psql -h localhost -U geo -d geo
```

```text
\dt public.*
\dv public.*
\q
```

Si una conexión de usuario falla, comprueba que `pg_hba.conf` permite el tipo de conexión, la base de datos, el rol y la dirección del cliente. La regla de autenticación no sustituye al privilegio `CONNECT`.

## 1. Crear y administrar roles

Como `postgres`, crea los roles de usuario y de grupo que se utilizarán en las partes siguientes. Omite las sentencias de los roles que ya existan:

```sql
-- Usuarios que inician sesión
CREATE ROLE usulector LOGIN PASSWORD 'Cambiar_Usulector';
CREATE ROLE usueditor LOGIN PASSWORD 'Cambiar_Usueditor';
CREATE ROLE usubd LOGIN PASSWORD 'Cambiar_Usubd';

-- Roles para administración de bases de datos y roles
CREATE ROLE usuadmin LOGIN CREATEDB PASSWORD 'Cambiar_Usuadmin';
CREATE ROLE usugestor LOGIN CREATEROLE PASSWORD 'Cambiar_Usugestor';

-- Roles de grupo: no inician sesión
CREATE ROLE geo_lectura NOLOGIN;
CREATE ROLE geo_edicion NOLOGIN;
```

`LOGIN` permite que un rol intente conectarse; `CREATEDB` permite crear bases de datos y `CREATEROLE` administrar roles. No concedas atributos que el rol no necesite.

Practica cambios de atributos y eliminación con un rol temporal:

```sql
CREATE ROLE rol_temporal;
ALTER ROLE rol_temporal LOGIN PASSWORD 'Cambiar_Temporal';
ALTER ROLE rol_temporal CREATEDB CONNECTION LIMIT 5;
ALTER ROLE rol_temporal VALID UNTIL '2027-06-30';
ALTER ROLE rol_temporal SET work_mem = '16MB';
ALTER ROLE rol_temporal RESET work_mem;
ALTER ROLE rol_temporal RENAME TO rol_temporal_bd;
DROP ROLE rol_temporal_bd;
```

`VALID UNTIL` establece la caducidad de la contraseña, no la eliminación del rol.

## 2. Asignar y comprobar membresías

En PostgreSQL 16 o posterior, configura explícitamente la herencia y la activación del grupo:

```sql
GRANT geo_lectura TO usulector
    WITH ADMIN FALSE, INHERIT TRUE, SET TRUE;

GRANT geo_edicion TO usueditor
    WITH ADMIN FALSE, INHERIT TRUE, SET TRUE;
```

- `INHERIT TRUE` permite usar directamente los privilegios heredables del grupo.
- `SET TRUE` permite activar el grupo con `SET ROLE`; no lo activa automáticamente.
- `ADMIN FALSE` impide administrar la membresía.

Comprueba las membresías:

```sql
SELECT grupo.rolname AS grupo,
       miembro.rolname AS miembro,
       m.admin_option,
       m.inherit_option,
       m.set_option
FROM pg_auth_members AS m
JOIN pg_roles AS grupo ON grupo.oid = m.roleid
JOIN pg_roles AS miembro ON miembro.oid = m.member
WHERE grupo.rolname IN ('geo_lectura', 'geo_edicion')
ORDER BY grupo.rolname, miembro.rolname;
```

Después de conceder privilegios al grupo, conéctate como `usulector` y comprueba la identidad de sesión y el rol activo:

```bash
psql -h localhost -U usulector -d geo
```

```sql
SELECT session_user, current_user;
SET ROLE geo_lectura;
SELECT session_user, current_user;
RESET ROLE;
\q
```

`SET ROLE` cambia `current_user`, pero no `session_user`. Para practicar `REVOKE` sin perder la configuración que se necesita más adelante:

```sql
REVOKE geo_lectura FROM usulector;

-- Restablecer la membresía
GRANT geo_lectura TO usulector
    WITH ADMIN FALSE, INHERIT TRUE, SET TRUE;
```

Retirar una membresía no elimina el rol ni sus privilegios; el usuario puede conservar acceso por otras concesiones.

## 3. Crear bases de datos, esquemas, tablas y vistas

### Base de datos `geodb`

Como `postgres`, conectado a otra base de datos, crea `geodb` y asigna su propiedad a `usubd`. `CREATE DATABASE` debe ejecutarse fuera de una transacción:

```sql
CREATE DATABASE geodb;
ALTER DATABASE geodb OWNER TO usubd;
```

Comprueba el propietario con `\l geodb` y conéctate como `usubd`:

```sql
\l geodb

\c geodb usubd
```

### Esquemas y tablas

Como `usubd`, crea los esquemas y tablas de ejemplo:

```sql
CREATE SCHEMA administracio;
CREATE SCHEMA estadisticas;

CREATE TABLE public.notas_comarcas (
    comarca varchar(50) NOT NULL,
    observaciones text
);

CREATE TABLE estadisticas.resumen_comarcas (
    comarca varchar(50) NOT NULL,
    numero_poblaciones integer
);

CREATE TABLE public.tabla_prueba (
    descripcion text
);
```

Mueve la tabla de notas, modifica su estructura y elimina solo la tabla temporal:

```sql
ALTER TABLE public.notas_comarcas SET SCHEMA administracio;

ALTER TABLE administracio.notas_comarcas
    ADD COLUMN fecha_revision date;

DROP TABLE public.tabla_prueba;
```

Comprueba los objetos después de los cambios:

```text
\dn
\dt administracio.*
\dt estadisticas.*
```

Para practicar el cambio de propietario de un esquema sin dejar una concesión amplia, crea un esquema temporal y realiza el cambio como superusuario. El nuevo propietario necesita `CREATE` sobre la base de datos:

Sal de la sesión de `usubd` y vuelve a conectarte como `postgres` a `geodb`:

```text
\q
```

```bash
sudo -u postgres psql -d geodb
```

```sql
CREATE SCHEMA esquema_temporal;
ALTER SCHEMA esquema_temporal RENAME TO esquema_prueba;
GRANT CREATE ON DATABASE geodb TO usugestor;
ALTER SCHEMA esquema_prueba OWNER TO usugestor;
REVOKE CREATE ON DATABASE geodb FROM usugestor;
DROP SCHEMA esquema_prueba;
```

No ejecutes `DROP SCHEMA` sobre esquemas con contenido: sin `CASCADE`, PostgreSQL rechazará el borrado si hay objetos dentro.

### Vistas

Como `usubd`, crea vistas en `geodb`. Las tablas comienzan vacías, así que las consultas pueden devolver cero filas:

```sql
CREATE VIEW estadisticas.vista_comarcas_mas10 AS
SELECT comarca, numero_poblaciones
FROM estadisticas.resumen_comarcas
WHERE numero_poblaciones > 10;

CREATE VIEW administracio.vista_notas_revisadas AS
SELECT comarca, observaciones, fecha_revision
FROM administracio.notas_comarcas
WHERE fecha_revision IS NOT NULL;

ALTER VIEW estadisticas.vista_comarcas_mas10
    RENAME TO vista_resumen_comarcas;

-- Vista temporal para practicar DROP VIEW
CREATE VIEW public.vista_temporal AS
SELECT comarca
FROM estadisticas.resumen_comarcas;
DROP VIEW public.vista_temporal;

SELECT * FROM estadisticas.vista_resumen_comarcas;
SELECT * FROM administracio.vista_notas_revisadas;
```

`ALTER VIEW` permite cambiar el nombre, el propietario o el esquema, pero no la consulta que define la vista. Para cambiar la consulta se usa `CREATE OR REPLACE VIEW`.

### Vistas de base datos `geo`

El rol `geo` es propietario de los objetos de esta base de datos `geo`. Conéctate como `geo` para modificar su vista y crear otra:

```bash
psql -h localhost -U geo -d geo
```

```sql
CREATE OR REPLACE VIEW public.vista_mas_de_700 AS
SELECT nom, comarca, altura
FROM public.poblacions
WHERE altura > 700;

CREATE VIEW public.vista_hasta_700 AS
SELECT nom, comarca, altura
FROM public.poblacions
WHERE altura <= 700;

SELECT * FROM public.vista_mas_de_700;
SELECT * FROM public.vista_hasta_700;

DROP VIEW public.vista_hasta_700;
\q
```

`CREATE OR REPLACE VIEW` requiere ser propietario de la vista y conservar una definición compatible con sus columnas.

## 4. Conceder, comprobar y retirar privilegios

Conéctate como `postgres` a `geo`. Concede conexión a la base de datos, uso del esquema y privilegios sobre las tablas. 

Para consultar una tabla hacen falta los tres niveles: `CONNECT`, `USAGE` y `SELECT`.

```bash
sudo -u postgres psql -d geo
```

```sql
GRANT CONNECT ON DATABASE geo TO geo_lectura, geo_edicion;
GRANT USAGE ON SCHEMA public TO geo_lectura, geo_edicion;

GRANT SELECT
ON TABLE public.comarques, public.poblacions, public.instituts
TO geo_lectura;

GRANT SELECT, INSERT, UPDATE
ON TABLE public.comarques, public.poblacions, public.instituts
TO geo_edicion;

-- Concesión directa adicional para demostrar la retirada por una vía
GRANT SELECT ON TABLE public.instituts TO usulector;
```

Comprueba los privilegios efectivos de los usuarios:

```sql
SELECT has_database_privilege('usulector', 'geo', 'CONNECT') AS puede_conectar,
       has_schema_privilege('usulector', 'public', 'USAGE') AS puede_usar_esquema,
       has_table_privilege('usulector', 'public.poblacions', 'SELECT') AS puede_consultar;

SELECT has_table_privilege('usulector', 'public.poblacions', 'SELECT') AS usulector_consulta,
       has_table_privilege('usulector', 'public.poblacions', 'UPDATE') AS usulector_actualiza,
       has_table_privilege('usueditor', 'public.poblacions', 'SELECT') AS usueditor_consulta,
       has_table_privilege('usueditor', 'public.poblacions', 'UPDATE') AS usueditor_actualiza,
       has_table_privilege('usueditor', 'public.poblacions', 'DELETE') AS usueditor_elimina;
```

En una instalación estándar, `CONNECT` y `USAGE` también pueden estar concedidos a `PUBLIC`; comprueba las concesiones existentes antes de interpretar el resultado. Si no hay concesiones adicionales sobre las tablas, la segunda consulta debe mostrar `true`, `false`, `true`, `true`, `false`, respectivamente.

Retira la concesión directa a `usulector` sobre `instituts`. Debe seguir teniendo `SELECT` a través de `geo_lectura`:

```sql
REVOKE SELECT ON TABLE public.instituts FROM usulector;
SELECT has_table_privilege('usulector', 'public.instituts', 'SELECT');
```

Prueba el acceso como `usulector`:

```bash
psql -h localhost -U usulector -d geo
```

```sql
SELECT * FROM public.poblacions LIMIT 5;
SET ROLE geo_lectura;
SELECT session_user, current_user;
RESET ROLE;
\q
```

### Concesiones amplias

Los ejemplos usan objetos existentes, salvo la tabla temporal para probar `PUBLIC`. Esa concesión amplía el acceso a todos los roles y se revoca antes de eliminar la tabla:

```sql
-- Todos los privilegios aplicables a comarques
GRANT ALL PRIVILEGES ON TABLE public.comarques TO geo_edicion;

-- SELECT sobre todas las tablas existentes del esquema (no las futuras)
GRANT SELECT ON ALL TABLES IN SCHEMA public TO geo_lectura;

-- Tabla aislada para no alterar concesiones previas de PUBLIC
CREATE TABLE public.tabla_public_demo (dato text);
GRANT SELECT ON TABLE public.tabla_public_demo TO PUBLIC;
REVOKE SELECT ON TABLE public.tabla_public_demo FROM PUBLIC;
DROP TABLE public.tabla_public_demo;

-- Retirar la concesión amplia y restablecer el perfil de edición previsto
REVOKE ALL PRIVILEGES ON TABLE public.comarques FROM geo_edicion;
GRANT SELECT, INSERT, UPDATE ON TABLE public.comarques TO geo_edicion;
```

`ALL TABLES IN SCHEMA` especifica el alcance de la concesión; no es un privilegio. Para acceder a una tabla siguen siendo necesarios `CONNECT` y `USAGE`, además del privilegio sobre la tabla.

### Delegar y retirar una concesión

Como `postgres`, crea un rol temporal y concede `SELECT` a `usulector` con opción de delegarlo:

```sql
CREATE ROLE rol_delegado NOLOGIN;
GRANT SELECT ON TABLE public.poblacions TO usulector WITH GRANT OPTION;
```

Como `usulector`, concede el privilegio al rol temporal y comprueba que lo recibe:

```bash
psql -h localhost -U usulector -d geo
```

```sql
GRANT SELECT ON TABLE public.poblacions TO rol_delegado;
SELECT has_table_privilege('rol_delegado', 'public.poblacions', 'SELECT');
\q
```

Como `postgres`, retira la opción de delegar. `CASCADE` también retira la concesión dependiente a `rol_delegado`:

```sql
REVOKE GRANT OPTION FOR SELECT
ON TABLE public.poblacions
FROM usulector CASCADE;

SELECT has_table_privilege('rol_delegado', 'public.poblacions', 'SELECT');
DROP ROLE rol_delegado;
```

La comprobación debe devolver `false`. Retirar una concesión no elimina necesariamente el privilegio efectivo si el rol lo recibe por otra vía, como una membresía o `PUBLIC`.

Practica también la retirada de los privilegios de grupo y restablécelos para las partes siguientes:

```sql
REVOKE UPDATE ON TABLE public.poblacions FROM geo_edicion;
REVOKE USAGE ON SCHEMA public FROM geo_lectura;

GRANT USAGE ON SCHEMA public TO geo_lectura;
GRANT UPDATE ON TABLE public.poblacions TO geo_edicion;
```

### Acceso a una vista sin acceso directo a la tabla

Una vista normal usa los permisos de su propietario para consultar las tablas base. Con `postgres` conectado a `geo`, crea un grupo y un usuario de prueba; ejecuta estas sentencias solo si los roles aún no existen:

```sql
CREATE ROLE geo_solo_vistas NOLOGIN;
CREATE ROLE usuvisor LOGIN PASSWORD 'Cambiar_Usuvisor';

GRANT geo_solo_vistas TO usuvisor;
GRANT CONNECT ON DATABASE geo TO geo_solo_vistas;
GRANT USAGE ON SCHEMA public TO geo_solo_vistas;
GRANT SELECT ON public.vista_mas_de_700 TO geo_solo_vistas;
```

Como `usuvisor`, la consulta de la vista debe funcionar y la consulta directa de la tabla debe fallar por falta de privilegio:

```bash
psql -h localhost -U usuvisor -d geo
```

```sql
SELECT * FROM public.vista_mas_de_700 LIMIT 5;
SELECT * FROM public.poblacions LIMIT 5;
\q
```

El resultado presupone que `usuvisor` no recibe `SELECT` sobre `poblacions` por otra concesión, membresía o `PUBLIC`.

### Ejemplo independiente: permisos y secuencias

Este ejemplo ilustra una tabla con clave `SERIAL`. Usa nombres propios para no reutilizar ni confundir `usubd` con la base de datos `usudb`. Como `postgres`, crea el rol y la base de datos:

```sql
CREATE ROLE beatles_user LOGIN PASSWORD 'Cambiar_Beatles';
CREATE DATABASE beatles_db;
```

Conéctate a `beatles_db` como `postgres`, crea la tabla e inserta datos:

```text
\c beatles_db
```

```sql
CREATE TABLE public.beatles (
    id serial PRIMARY KEY,
    name varchar(100),
    instrument varchar(100)
);

INSERT INTO public.beatles (name, instrument) VALUES
    ('John Lennon', 'Vocals, Guitar'),
    ('Ringo Starr', 'Vocals, Drums');

GRANT CONNECT ON DATABASE beatles_db TO beatles_user;
GRANT USAGE, CREATE ON SCHEMA public TO beatles_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO beatles_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO beatles_user;
```

Sin privilegios sobre la secuencia, `beatles_user` no podría insertar una fila y obtener el valor predeterminado de `id`. En una aplicación real, concede solo los privilegios necesarios.

## 5. Tablespaces (opcional)

Esta práctica requiere un servidor Linux, un superusuario y directorios absolutos existentes, vacíos y propiedad del usuario del sistema que ejecuta PostgreSQL (normalmente `postgres`). No uses rutas con datos. Realízala después de las copias de seguridad o asegúrate de que los tablespaces también existen al restaurar.

Como `postgres`, crea los tablespaces fuera de una transacción:

```sql
CREATE TABLESPACE ts_rapido LOCATION '/ssd/postgresql';
CREATE TABLESPACE ts_gran_capacitat LOCATION '/hdd/postgresql';

-- Tablespace temporal vacío para practicar ALTER y DROP
CREATE TABLESPACE ts_temporal LOCATION '/tmp/ts_temporal';
ALTER TABLESPACE ts_temporal RENAME TO ts_prueba;
GRANT CREATE ON TABLESPACE ts_prueba TO usubd;
ALTER TABLESPACE ts_prueba OWNER TO usubd;
REVOKE CREATE ON TABLESPACE ts_prueba FROM usubd;
ALTER TABLESPACE ts_prueba SET (random_page_cost = 1.1);
DROP TABLESPACE ts_prueba;
```

Mueve las tablas de ejemplo a los tablespaces. Ejecuta cada `\c` en `psql`:

```text
\c geo
```

```sql
ALTER TABLE public.poblacions SET TABLESPACE ts_rapido;
```

```text
\c geodb
```

```sql
ALTER TABLE estadisticas.resumen_comarcas
    SET TABLESPACE ts_gran_capacitat;
GRANT CREATE ON TABLESPACE ts_rapido TO usubd;
```

Como `usubd`, crea una tabla en el tablespace:

```sql
CREATE TABLE administracio.registro_consultas (
    fecha date,
    descripcion text
) TABLESPACE ts_rapido;
```

Mover una tabla no mueve automáticamente sus índices. `DROP TABLESPACE` requiere que el tablespace esté vacío; no borra el directorio del sistema.

## 6. Copias de seguridad y restauración

Los siguientes comandos se ejecutan en la terminal. Antes de crear una base de datos de destino, comprueba que no exista. Las copias de texto se restauran con `psql`; los formatos Custom, Directory y Tar, con `pg_restore`.

### Copia de la estructura y restauración

```bash
pg_dump -s -U geo geo > geo_estructura.sql
sudo -u postgres createdb -O geo geo_nueva
psql -U geo -d geo_nueva -f geo_estructura.sql
```

El rol `geo` debe existir en el servidor destino porque la copia conserva propietarios. Comprueba los objetos restaurados:

```bash
psql -U geo -d geo_nueva -c "\dt"
```

### Copiar datos de una tabla

Después de restaurar la estructura, copia los datos de `comarques`:

```bash
pg_dump -a --inserts -t comarques -U geo geo > comarques_datos.sql
psql -U geo -d geo_nueva -f comarques_datos.sql
```

### Copia en formato Custom

```bash
pg_dump -Fc -U geo -f geo.backup geo
sudo -u postgres createdb -O geo geo_custom
pg_restore -U geo -d geo_custom geo.backup
```

También se puede crear y restaurar la copia desde pgAdmin: selecciona `geo` → **Backup**, elige el formato **Custom** y guarda; crea una base de datos destino propiedad de `geo`, selecciona **Restore**, elige el archivo y comprueba el resultado en la ventana de procesos.

### Copia directa entre bases de datos

```bash
sudo -u postgres createdb -O geo geo_nueva2
pg_dump -U geo geo | psql -U geo -d geo_nueva2
```

`geo_nueva`, `geo_custom` y `geo_nueva2` son destinos distintos para practicar los formatos. Para restaurar un archivo SQL se usa `psql`, no `pg_restore`.

### Copiar objetos globales

`pg_dumpall` puede exportar roles y otros objetos globales del clúster. El archivo de roles puede contener hashes de contraseñas; protégelo:

```bash
pg_dumpall -U postgres --roles-only > roles.sql
```

## 7. Repetir operaciones gráficamente con pgAdmin

Los pasos siguientes resumen los ejemplos de [Administración gráfica con pgAdmin](06-pgadmin.md):

- **Roles:** en **Login/Group Roles**, crea `usulector` como rol de inicio de sesión y `geo_lectura` como rol de grupo sin inicio de sesión. En las propiedades de `usulector`, añade `geo_lectura` en **Membership**.
- **Bases de datos:** en **Databases → Create → Database**, crea `geodb` y selecciona `usubd` como propietario.
- **Privilegios:** en las propiedades de `geo`, concede `CONNECT` a `geo_lectura`; en **Schemas → public**, concede `USAGE`; en **Tables → poblacions**, concede `SELECT`. Modifica entradas existentes en lugar de duplicarlas.
- **Vistas:** consulta `public.vista_mas_de_700` desde **Query Tool** conectado a `geo`.
- **Copias:** usa **Backup** con formato **Custom** y después **Restore** sobre una base de datos destino existente. Comprueba que ambos procesos finalizan correctamente.

Los nombres de las opciones pueden variar según la versión de pgAdmin. Si no encuentra `pg_dump` o `pg_restore`, revisa en sus preferencias **Paths → Binary paths** y configura el directorio de herramientas cliente compatible con el servidor.

## 8. Actividades: escenario independiente

Las [actividades](00-actividades.md) usan otro conjunto de nombres y una secuencia propia. No mezcles esos roles con el ejemplo anterior:

- Roles de usuario: `usu1`, `usu2` y `usu3`; grupo: `grupo1`, con `usu1` y `usu2` como miembros.
- Base de datos de práctica de `usu3`: crear una base de datos, un esquema y una tabla; practicar modificaciones y consultas.
- En `geo`: crear vistas, conceder privilegios a `usu1` y `grupo1`, comprobarlos, retirarlos y probar el acceso a las vistas.
- Copias: restaurar estructura en `geo_nueva`, transferir datos y crear `geo_nueva2` desde la línea de comandos.

Consulta las instrucciones y evidencias de cada ejercicio en la página de [Actividades](00-actividades.md).
