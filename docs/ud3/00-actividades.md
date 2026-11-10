# Actividades de Control de Acceso

## Actividad 1: Creación de usuarios y concesión de permisos

1. Desde pgAdmin, crea tres usuarios (`usu1`, `usu2` y `usu3`) con las siguientes características:

    - La contraseña debe coincidir con el nombre de usuario.
    - La cuenta debe caducar el 31 de diciembre del año actual.
    - El límite de conexiones debe ser `2`.
    - Los usuarios pueden crear bases de datos y roles.
    - El resto de parámetros debe conservar sus valores predeterminados.

2. Concede a `usu1` permiso para consultar la tabla `instituts` y adjunta la sentencia SQL correspondiente.
3. Realiza las comprobaciones con `psql` desde Ubuntu MATE para verificar que todo funciona correctamente.

**Evidencias:**

- Adjunta la sentencia SQL de creación de uno de los usuarios.
- Adjunta la sentencia SQL del permiso concedido a `usu1`.
- Adjunta capturas de las comprobaciones realizadas con `psql`.

## Actividad 2: Creación de un grupo y asignación de permisos

1. Desde pgAdmin, crea `grupo1` con las siguientes características:

    - Puede consultar la tabla `instituts`.
    - Puede consultar la tabla `poblacions`.
    - Puede consultar y añadir datos en la tabla `comarques`, pero no modificarlos ni eliminarlos.
    - Puede otorgar sus permisos sobre la tabla `comarques` a otros usuarios.

2. Haz que `usu1` y `usu2` sean miembros de este grupo y adjunta las sentencias SQL utilizadas.
3. Realiza las comprobaciones con `psql` desde Ubuntu MATE.
4. Comprueba que `usu3` no tiene los permisos de `grupo1` y adjunta las capturas necesarias.

**Evidencias:**

- Adjunta la sentencia SQL de creación del grupo y de sus permisos.
- Adjunta las sentencias SQL que incorporan a `usu1` y `usu2` al grupo.
- Adjunta capturas de las comprobaciones con `psql`, incluida la comprobación de que `usu3` no hereda esos permisos.

## Actividad 3: Consulta de usuarios y grupos del sistema

1. Desde `psql`, ejecuta las siguientes consultas para visualizar las vistas del sistema:

    >  SELECT * FROM pg_user;
    >
    >  SELECT * FROM pg_group;

2. Responde a la siguiente pregunta:
   > ¿Qué información podemos obtener del campo `grolist`?

**Evidencias:**

- Adjunta las consultas ejecutadas y sus resultados.
- Incluye la respuesta sobre la información que contiene el campo `grolist`.

## Actividad 4: Creación de una base de datos y concesión de permisos

1. Desde `psql`, crea un usuario, una base de datos y una tabla inventada, y concede al usuario los permisos necesarios para consultar la tabla. Consulta [Gestión de bases de datos y objetos](03-basesdatos-objetos.md) y [Privilegios sobre objetos](04-privilegios-objetos.md).

    > Para crear una base de datos puedes utilizar:
    >     
    > CREATE DATABASE nombre_base_de_datos;
    

2. Muestra los privilegios que tiene el usuario sobre la tabla.

**Evidencias:**

- Adjunta las sentencias SQL utilizadas para crear el usuario, la base de datos y la tabla, y para conceder los permisos.
- Adjunta el resultado que muestra los privilegios del usuario sobre la tabla.
- Adjunta capturas de las comprobaciones realizadas con `psql`.

## Actividad 5: Creación de un tablespace

1. Desde la terminal de Ubuntu MATE, crea el directorio `/var/lib/postgresql/16/main/data2` para utilizarlo como ubicación de un tablespace llamado `prueba`.
2. Asigna al directorio el usuario y el grupo propietarios adecuados para PostgreSQL.
3. Conéctate desde `psql` y crea el tablespace.
4. Comprueba desde `psql` que el tablespace se ha creado correctamente.

**Evidencias:**

- Adjunta los comandos de la terminal para crear el directorio y asignar su propietario y grupo.
- Adjunta la sentencia SQL de creación del tablespace y el resultado de las comprobaciones en `psql`.
- Incluye capturas del proceso.

## Actividad 6: Creación de una base de datos en un tablespace

1. Desde `psql`, crea una base de datos llamada `geo2` con la misma estructura que `geo`.
2. Utiliza el tablespace `prueba` y establece a `usu2` como propietario.
3. Comprueba desde `psql` que la base de datos se ha creado con el propietario y el tablespace indicados.

**Evidencias:**

- Adjunta la sentencia SQL ejecutada en `psql`.
- Adjunta el resultado de la comprobación del propietario y el tablespace de `geo2`.

## Actividad 7: Cambio del propietario de una base de datos

1. Desde `psql`, cambia el propietario de `geo2` a `usu1`.
2. Comprueba desde `psql` el cambio de propietario.

**Evidencias:**

- Adjunta la sentencia SQL ejecutada en `psql`.
- Adjunta el resultado de la comprobación del nuevo propietario de `geo2`.

## Actividad 8: Copia de seguridad y restauración de la estructura

1. Desde el cliente gráfico `pgAdmin`, realiza una copia de seguridad de la estructura de `geo`.
2. Utiliza la copia para crear o restaurar una base de datos llamada `geo_nueva`.
3. Comprueba en pgAdmin que `geo_nueva` contiene la estructura de `geo`.

**Evidencias:**

- Adjunta capturas del proceso de copia y restauración en pgAdmin.
- Adjunta una captura de la estructura de `geo_nueva` que permita comprobar que se ha restaurado correctamente.

## Actividad 9: Transferencia de datos entre bases de datos

1. Desde el cliente gráfico `pgAdmin`, traspasa los datos de la tabla `comarques` de `geo` a `geo_nueva`.
2. Comprueba en pgAdmin que los datos se han transferido correctamente.

**Evidencias:**

- Adjunta capturas del traspaso de datos en pgAdmin.
- Adjunta una captura que muestre los datos de `comarques` en `geo_nueva`.

## Actividad 10: Copia de una base de datos desde la línea de comandos

1. Desde la terminal de Ubuntu MATE, utiliza las herramientas de línea de comandos de PostgreSQL para copiar la base de datos `geo` en otra base de datos llamada `geo_nueva2`.
2. Comprueba con `psql` que la copia contiene la estructura y los datos esperados.

**Evidencias:**

- Adjunta los comandos de línea utilizados para copiar la base de datos.
- Adjunta los resultados de las comprobaciones realizadas con `psql` sobre la estructura y los datos de `geo_nueva2`.

## Vistas

## Actividad 11: Creación de vistas y gestión de permisos

1. Desde `psql`, crea en `geo` dos vistas: una basada en una tabla y otra que combine dos tablas.
2. Desde `psql`, concede a `usu1` permiso para consultar las dos vistas.
3. Comprueba que `usu1` puede consultarlas y que `usu2` no tiene permiso para hacerlo.

**Evidencias:**

- Adjunta las sentencias SQL para crear las vistas y conceder el permiso a `usu1`.
- Adjunta los resultados de las comprobaciones que muestran que `usu1` puede consultarlas y que `usu2` no.

## Actividad 12: Consulta de las vistas del esquema

1. Desde `psql`, conéctate a la base de datos `geo`.

2. Muestra las vistas del esquema `public` mediante una vista predefinida del sistema, como `pg_views`.

**Evidencias:**

- Adjunta la consulta ejecutada en `psql` y el resultado que muestra las vistas del esquema `public`.
