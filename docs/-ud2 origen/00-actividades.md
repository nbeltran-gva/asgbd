# 5. Ejercicios

Realiza los ejercicios con pgAdmin y `psql`, adjuntando las sentencias SQL, las comprobaciones y las capturas necesarias.

## Roles y permisos

### Ejercicio 2.1

Crea en pgAdmin los usuarios `usu1`, `usu2` y `usu3` con el mismo nombre como contraseña, caducidad el 31 de diciembre de este año, límite de dos conexiones y permisos para crear bases de datos y roles. Añade a `usu1` permiso de consulta sobre `instituts` y comprueba todo desde `psql`.

### Ejercicio 2.2

Crea `grupo1` con permiso de consulta sobre `instituts` y `poblacions`, permiso de consulta e inserción sobre `comarques` y capacidad para propagar sus permisos sobre `comarques`. Haz miembros a `usu1` y `usu2` y comprueba que `usu3` no los hereda.

### Ejercicio 2.3

Repite el ejemplo de creación de una base de datos y concesión de permisos usando otro usuario, otra base de datos y una tabla inventada. Muestra los privilegios del usuario sobre la tabla.

### Ejercicio 2.4

Desde `psql`, consulta `pg_user` y `pg_group`. Explica qué información contiene el campo `grolist`.

## Bases de datos y almacenamiento

### Ejercicio 2.5

Crea un tablespace llamado `prueba` en `/var/lib/postgresql/16/main/data2`. Crea el directorio, asigna su propietario y grupo, y adjunta la sentencia SQL.

### Ejercicio 2.6

Crea `geo2` igual que `geo`, utiliza el tablespace anterior y establece `usu2` como propietario.

### Ejercicio 2.7

Cambia el propietario de `geo2` a `usu1` y adjunta la sentencia generada.

## Copias de seguridad

### Ejercicio 2.8

Con pgAdmin, copia la estructura de `geo` y utilízala para crear o restaurar una base de datos llamada `geo_nueva`.

### Ejercicio 2.9

Con pgAdmin, traspasa los datos de `comarques` desde `geo` a `geo_nueva`.

### Ejercicio 2.10

Utiliza las herramientas de línea de comandos para copiar `geo` en una base de datos llamada `geo_nueva2`.

## Vistas

### Ejercicio 2.11

Crea dos vistas en `geo`, una de ellas combinando dos tablas. Permite que `usu1` las consulte y comprueba que `usu2` no puede hacerlo.

### Ejercicio 2.12

Conéctate a `geo` y muestra las vistas del esquema `public` utilizando una vista predefinida del sistema.
