# Actividades de Control de Acceso

## Bloque 1: Roles y membresías

### Actividad 1: Creación de usuarios

1. Desde pgAdmin, crea tres usuarios (`usu1`, `usu2` y `usu3`) con las siguientes características:

    - La contraseña debe coincidir con el nombre de usuario.
    - La cuenta debe caducar el 31 de diciembre del año actual.
    - El límite de conexiones debe ser `2`.
    - Los usuarios pueden crear bases de datos y roles.
    - El resto de parámetros debe conservar sus valores predeterminados.

2. Desde Ubuntu MATE, comprueba con `psql` que `usu1` puede conectarse al servidor.

**Evidencias:**

- Adjunta la sentencia SQL de creación de uno de los usuarios.
- Adjunta una captura de la conexión de `usu1` con `psql`.

### Actividad 2: Creación de un grupo y membresías

1. Desde pgAdmin, crea el rol de grupo `grupo1`, sin posibilidad de iniciar sesión.
2. Haz que `usu1` y `usu2` sean miembros de `grupo1`. `usu3` no debe pertenecer al grupo.

**Evidencias:**

- Adjunta la sentencia SQL de creación del grupo.
- Adjunta las sentencias SQL que incorporan a `usu1` y `usu2` al grupo.

### Actividad 3: Consulta de usuarios y grupos del sistema

1. Desde `psql`, ejecuta las siguientes consultas para visualizar las vistas del sistema:

    > SELECT * FROM pg_user;
    >
    > SELECT * FROM pg_group;

2. Comprueba que `usu1` y `usu2` figuran en `grupo1` y que `usu3` no.
3. Responde a la siguiente pregunta:
   > ¿Qué información podemos obtener del campo `grolist`?

**Evidencias:**

- Adjunta las consultas ejecutadas y sus resultados.
- Incluye la respuesta sobre la información que contiene el campo `grolist`.

## Bloque 2: Bases de datos y objetos

### Actividad 4: Creación de una base de datos, un esquema y una tabla

1. Desde `psql`, crea una base de datos con `usu3` como propietario.
2. Conéctate a ella como `usu3`, crea un esquema y, dentro de él, una tabla inventada con algunas filas.
3. Modifica la tabla: añade una columna y cámbiale el nombre.
4. Comprueba desde `psql` el propietario de la base de datos y la estructura de la tabla.

**Evidencias:**

- Adjunta las sentencias SQL utilizadas para crear la base de datos, el esquema y la tabla, y para modificar la tabla.
- Adjunta el resultado de la comprobación del propietario y de la estructura de la tabla.

### Actividad 5: Creación de vistas

1. Desde `psql`, crea en `geo` dos vistas: una basada en una tabla y otra que combine dos tablas.
2. Comprueba que ambas devuelven datos.

**Evidencias:**

- Adjunta las sentencias SQL para crear las vistas.
- Adjunta una captura de la consulta de cada vista.

### Actividad 6: Consulta de las vistas del esquema

1. Desde `psql`, conéctate a la base de datos `geo`.
2. Muestra las vistas del esquema `public` mediante una vista predefinida del sistema, como `pg_views`.

**Evidencias:**

- Adjunta la consulta ejecutada en `psql` y el resultado que muestra las vistas del esquema `public`.

### Actividad 7: Creación de un tablespace

1. Desde la terminal de Ubuntu MATE, crea el directorio `/var/lib/postgresql/ts_prueba`, fuera del directorio de datos del clúster, para utilizarlo como ubicación de un tablespace llamado `prueba`.
2. Asigna al directorio el usuario y el grupo propietarios adecuados para PostgreSQL.
3. Conéctate desde `psql` y crea el tablespace.
4. Comprueba desde `psql` que el tablespace se ha creado correctamente.
5. Prueba `ALTER` y `DROP TABLESPACE` con un tablespace temporal: créalo en otro directorio, cámbiale el nombre y elimínalo.

**Evidencias:**

- Adjunta los comandos de la terminal para crear el directorio y asignar su propietario y grupo.
- Adjunta la sentencia SQL de creación del tablespace y el resultado de las comprobaciones en `psql`.
- Adjunta las sentencias del tablespace temporal (crear, renombrar y eliminar).
- Incluye capturas del proceso.

### Actividad 8: Creación de una base de datos en un tablespace

1. Desde `psql`, crea una base de datos llamada `geo2` con la misma estructura que `geo`.
2. Utiliza el tablespace `prueba` y establece a `usu2` como propietario.
3. Comprueba desde `psql` que la base de datos se ha creado con el propietario y el tablespace indicados.

**Evidencias:**

- Adjunta la sentencia SQL ejecutada en `psql`.
- Adjunta el resultado de la comprobación del propietario y el tablespace de `geo2`.

### Actividad 9: Cambio del propietario de una base de datos

1. Desde `psql`, cambia el propietario de `geo2` a `usu1`.
2. Comprueba desde `psql` el cambio de propietario.

**Evidencias:**

- Adjunta la sentencia SQL ejecutada en `psql`.
- Adjunta el resultado de la comprobación del nuevo propietario de `geo2`.

## Bloque 3: Privilegios

### Actividad 10: Concesión de privilegios a un usuario

1. Desde `psql`, concede a `usu1` los privilegios necesarios para consultar la tabla `instituts` de `geo`: conexión a la base de datos, uso del esquema `public` y `SELECT` sobre la tabla.
2. Conéctate como `usu1` y comprueba que puede consultar `instituts`.

**Evidencias:**

- Adjunta las sentencias SQL de los privilegios concedidos.
- Adjunta una captura de la consulta realizada por `usu1` con `psql`.

### Actividad 11: Concesión de privilegios a un grupo

1. Desde `psql`, concede a `grupo1` los siguientes privilegios sobre `geo`:

    - Conectarse a la base de datos y usar el esquema `public` (`CONNECT` y `USAGE`).
    - Consultar las tablas `instituts` y `poblacions`.
    - Consultar y añadir datos en la tabla `comarques`, pero no modificarlos ni eliminarlos.
    - Poder otorgar sus privilegios sobre `comarques` a otros roles (`WITH GRANT OPTION`).

2. Comprueba con `psql` que `usu2`, como miembro del grupo, puede consultar `poblacions` e insertar en `comarques`.
3. Comprueba que `usu3` no tiene los privilegios de `grupo1`.

**Evidencias:**

- Adjunta las sentencias SQL de los privilegios concedidos a `grupo1`.
- Adjunta capturas de las comprobaciones con `psql`, incluida la de `usu3`.

### Actividad 12: Consulta de privilegios efectivos

1. Desde `psql`, utiliza `has_database_privilege`, `has_schema_privilege` y `has_table_privilege` para comprobar los privilegios de `usu1`, `usu2` y `usu3` sobre `geo`, el esquema `public` y la tabla `comarques`.
2. Resume los resultados en una tabla.

**Evidencias:**

- Adjunta las consultas ejecutadas y sus resultados.
- Adjunta la tabla resumen.

### Actividad 13: Retirada de privilegios

1. Desde `psql`, retira a `grupo1` el privilegio de inserción sobre `comarques`.
2. Retira a `usu1` el privilegio `SELECT` que se le concedió directamente sobre `instituts` en la actividad 10.
3. Comprueba con `psql` el resultado de ambas retiradas y explica por qué `usu1` puede seguir consultando `instituts`.

**Evidencias:**

- Adjunta las sentencias `REVOKE` ejecutadas.
- Adjunta las comprobaciones realizadas y la explicación.

### Actividad 14: Privilegios sobre vistas

1. Desde `psql`, concede a `usu1` el privilegio de consultar las dos vistas creadas en la actividad 5.
2. Comprueba que `usu1` puede consultarlas.
3. Comprueba que `usu3` no tiene permiso para hacerlo.

**Evidencias:**

- Adjunta las sentencias SQL que conceden el privilegio a `usu1`.
- Adjunta los resultados de las comprobaciones que muestran que `usu1` puede consultarlas y que `usu3` no.

## Bloque 4: Copias de seguridad y restauración

### Actividad 15: Copia de seguridad y restauración de la estructura

1. Desde el cliente gráfico `pgAdmin`, realiza una copia de seguridad de la estructura de `geo`.
2. Utiliza la copia para crear o restaurar una base de datos llamada `geo_nueva`.
3. Comprueba en pgAdmin que `geo_nueva` contiene la estructura de `geo`.

**Evidencias:**

- Adjunta capturas del proceso de copia y restauración en pgAdmin.
- Adjunta una captura de la estructura de `geo_nueva` que permita comprobar que se ha restaurado correctamente.

### Actividad 16: Transferencia de datos entre bases de datos

1. Desde el cliente gráfico `pgAdmin`, traspasa los datos de la tabla `comarques` de `geo` a `geo_nueva`.
2. Comprueba en pgAdmin que los datos se han transferido correctamente.

**Evidencias:**

- Adjunta capturas del traspaso de datos en pgAdmin.
- Adjunta una captura que muestre los datos de `comarques` en `geo_nueva`.

### Actividad 17: Copia de una base de datos desde la línea de comandos

1. Desde la terminal de Ubuntu MATE, utiliza las herramientas de línea de comandos de PostgreSQL para copiar la base de datos `geo` en otra base de datos llamada `geo_nueva2`.
2. Comprueba con `psql` que la copia contiene la estructura y los datos esperados.

**Evidencias:**

- Adjunta los comandos de línea utilizados para copiar la base de datos.
- Adjunta los resultados de las comprobaciones realizadas con `psql` sobre la estructura y los datos de `geo_nueva2`.
