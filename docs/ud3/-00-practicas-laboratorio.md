# 10. Prácticas de laboratorio

Las prácticas siguientes se basan en los ejercicios del documento *Tema 2. Gestión de Usuarios* y amplían sus comprobaciones para alinearlas con el RA 3. Los nombres de tablas `instituts`, `poblacions` y `comarques` corresponden al escenario original; si no existen en la base de datos de prácticas, deben crearse o sustituirse por tablas equivalentes. No se debe asumir que existen por defecto en PostgreSQL.

## Práctica 1. Crear y administrar usuarios

**Duración orientativa:** 1–2 horas.

**Objetivos**

- Crear roles con `LOGIN`.
- Configurar caducidad de contraseña y límite de conexiones.
- Gestionar los atributos desde pgAdmin 4.
- Comprobar la configuración mediante SQL.

**Tareas**

1. Desde pgAdmin 4, crea `usu1`, `usu2` y `usu3`.
2. Asigna contraseñas de prácticas distintas y seguras.
3. Configura un límite de dos conexiones y una fecha de caducidad para las contraseñas.
4. Concede `CREATEDB` y `CREATEROLE` solo si la tarea requiere expresamente esos atributos; después explica por qué no se concederían a un usuario ordinario en un entorno real.
5. Revisa la sentencia SQL generada.
6. Comprueba los atributos con:

```sql
SELECT rolname, rolcanlogin, rolcreatedb, rolcreaterole,
       rolconnlimit, rolvaliduntil
FROM pg_roles
WHERE rolname IN ('usu1', 'usu2', 'usu3')
ORDER BY rolname;
```

**Entrega**

- Capturas de creación en pgAdmin.
- Sentencia SQL equivalente para uno de los usuarios.
- Tabla con los atributos de los tres roles.
- Explicación de la diferencia entre caducidad de contraseña y eliminación de una cuenta.

**Criterios:** 3.c y 3.h.

## Práctica 2. Crear un rol de grupo y asignar miembros

**Duración orientativa:** 1 hora.

**Tareas**

1. Crea un rol de grupo:

```sql
CREATE ROLE grupo1 NOLOGIN;
```

2. Concede permisos de consulta sobre `instituts` y `poblacions`, y permisos de consulta e inserción sobre `comarques`:

```sql
GRANT SELECT ON TABLE instituts, poblacions TO grupo1;
GRANT SELECT, INSERT ON TABLE comarques TO grupo1;
```

3. Concede a `grupo1` la opción de delegar sus privilegios sobre `comarques` si el ejercicio lo requiere:

```sql
GRANT SELECT, INSERT ON TABLE comarques
TO grupo1
WITH GRANT OPTION;
```

Si ya se habían concedido esos privilegios, la opción de delegación debe configurarse correctamente en la concesión correspondiente.

4. Añade `usu1` y `usu2` como miembros:

```sql
GRANT grupo1 TO usu1;
GRANT grupo1 TO usu2;
```

5. No añadas `usu3`.
6. Comprueba las membresías y prueba las operaciones con cada usuario.

**Comprobaciones**

- `usu1` y `usu2` pueden consultar las tablas permitidas.
- Pueden insertar en `comarques`, si tienen también acceso al esquema y la operación no requiere otros privilegios.
- No deben poder actualizar ni borrar `comarques` por el mero hecho de pertenecer a `grupo1`.
- `usu3` no debe heredar los permisos de `grupo1`.

**Entrega:** sentencias SQL, capturas de las pruebas permitidas y denegadas y una explicación de las ventajas de los roles de grupo.

**Criterios:** 3.d, 3.e, 3.f, 3.g y 3.h.

## Práctica 3. Base de datos, esquema, tabla y secuencia

**Duración orientativa:** 1–2 horas.

En esta práctica se reproduce el escenario del documento de referencia con una base de datos y una tabla inventadas.

1. Crea un rol propietario y un rol de aplicación:

```sql
CREATE ROLE propietario_app LOGIN PASSWORD 'ClavePropietario-Practicas';
CREATE ROLE app_consulta LOGIN PASSWORD 'ClaveConsulta-Practicas';
```

2. Desde una cuenta con permisos suficientes, crea la base de datos:

```sql
CREATE DATABASE bd_empresa OWNER propietario_app;
```

3. Conéctate a `bd_empresa` como propietario o administrador autorizado y crea una tabla:

```sql
CREATE TABLE public.empleados (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre varchar(100) NOT NULL,
    departamento varchar(80) NOT NULL
);
```

4. Concede los permisos necesarios:

```sql
GRANT CONNECT ON DATABASE bd_empresa TO app_consulta;
GRANT USAGE ON SCHEMA public TO app_consulta;
GRANT SELECT ON TABLE public.empleados TO app_consulta;
```

5. Inserta algunos registros de prueba como propietario.
6. Conéctate como `app_consulta` y verifica que puede consultar, pero no insertar ni borrar.
7. Consulta los privilegios efectivos:

```sql
SELECT
    has_database_privilege('app_consulta', 'bd_empresa', 'CONNECT')
        AS puede_conectar,
    has_schema_privilege('app_consulta', 'public', 'USAGE')
        AS puede_usar_esquema,
    has_table_privilege('app_consulta', 'public.empleados', 'SELECT')
        AS puede_consultar,
    has_table_privilege('app_consulta', 'public.empleados', 'INSERT')
        AS puede_insertar;
```

**Entrega:** diagrama simple de roles y objetos, sentencias SQL, capturas de la consulta permitida y de la operación denegada.

**Criterios:** 3.c, 3.d, 3.f y 3.h.

## Práctica 4. Revocar privilegios y comprobar el resultado

**Duración orientativa:** 1 hora.

1. Concede temporalmente `INSERT` a `app_consulta` sobre `empleados`.
2. Comprueba que el privilegio aparece como efectivo.
3. Revoca el permiso:

```sql
REVOKE INSERT ON TABLE public.empleados FROM app_consulta;
```

4. Comprueba de nuevo el privilegio con `has_table_privilege`.
5. Intenta insertar un registro de prueba y documenta el resultado.
6. Si el usuario conserva el permiso, investiga si lo recibe por otra concesión, por una membresía de rol o por ser propietario.

**Entrega:** tabla antes/después con los privilegios efectivos y explicación del resultado.

**Criterios:** 3.d, 3.f y 3.h.

## Práctica 5. Vista personalizada por perfil

**Duración orientativa:** 1–2 horas.

1. Crea una tabla de personal con nombre, departamento y salario.
2. Inserta datos ficticios.
3. Crea una vista que solo muestre nombre y departamento.
4. Concede a un rol de consulta acceso a la vista.
5. Comprueba que puede consultar la vista.
6. Comprueba que no puede consultar directamente la tabla original.
7. Explica qué datos quedan ocultos y qué medidas adicionales podrían ser necesarias.

**Entrega:** definición de la tabla y la vista, permisos asignados y pruebas de acceso.

**Criterios:** 3.a, 3.d, 3.f y 3.h.

## Práctica 6. Administración mediante pgAdmin 4

**Duración orientativa:** 1 hora.

1. Crea un rol de usuario desde la interfaz gráfica.
2. Crea un rol de grupo con `NOLOGIN`.
3. Añade el usuario al rol de grupo.
4. Concede permisos sobre una tabla desde sus propiedades.
5. Consulta las sentencias SQL generadas por pgAdmin, cuando estén disponibles.
6. Repite una de las operaciones con SQL.
7. Verifica que ambos métodos producen el resultado esperado.

**Entrega:** capturas de los pasos, sentencias SQL equivalentes y comparación breve entre administración gráfica y línea de comandos.

**Criterios:** 3.c, 3.d, 3.f y 3.g.

## Práctica 7. Consultar el catálogo de roles y privilegios

**Duración orientativa:** 1 hora.

Ejecuta:

```sql
SELECT * FROM pg_roles ORDER BY rolname;
```

```sql
SELECT * FROM pg_user ORDER BY usename;
```

```sql
SELECT r.rolname AS rol,
       m.rolname AS miembro
FROM pg_auth_members am
JOIN pg_roles r ON r.oid = am.roleid
JOIN pg_roles m ON m.oid = am.member
ORDER BY r.rolname, m.rolname;
```

Contesta:

1. ¿Qué diferencia hay entre `pg_roles` y `pg_user`?
2. ¿Qué información muestra la consulta de membresías?
3. ¿Por qué no se recomienda modificar directamente las tablas internas del catálogo?
4. ¿Qué diferencia hay entre pertenecer a un rol y recibir un privilegio directamente?
5. ¿Qué comprobaciones harías si un usuario puede consultar una tabla aunque no tenga un `GRANT SELECT` directo?

**Criterios:** 3.d, 3.e, 3.g y 3.h.

## Práctica 8. Caso integrador: control de acceso en una empresa

**Duración orientativa:** 2 horas.

Una empresa tiene tres perfiles:

- **Dirección:** consulta los datos generales del personal y los informes.
- **Personal de administración:** consulta e introduce datos de determinados departamentos.
- **Auditoría:** consulta un conjunto limitado de datos, sin modificarlos.

El alumnado debe diseñar una política de acceso que incluya:

1. Roles de grupo para cada perfil.
2. Usuarios de prueba asignados a esos grupos.
3. Privilegios mínimos sobre base de datos, esquema, tablas, vistas y secuencias, cuando sean necesarios.
4. Una vista para mostrar solo los datos autorizados.
5. Uso de pgAdmin 4 para crear al menos un rol y conceder un privilegio.
6. Uso de SQL para realizar el resto de operaciones.
7. Pruebas de operaciones permitidas y denegadas.
8. Revocación de un permiso y comprobación del resultado.
9. Un informe con las decisiones de seguridad y las evidencias.

**Criterios:** todos los criterios aplicables del RA 3.

