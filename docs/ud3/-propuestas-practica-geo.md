# Propuesta de práctica evaluable

## Práctica: Gestión de privilegios en Geo

### Objetivos

Crear una estructura de permisos con:

- Un grupo de lectura.
- Un grupo de edición.
- Usuarios finales.

### Apartado 1. Crear roles y usuarios

```sql
CREATE ROLE geo_lectura;
CREATE ROLE geo_edicion;

CREATE ROLE usulector LOGIN PASSWORD 'usulector';
CREATE ROLE usueditor LOGIN PASSWORD 'usueditor';
```

### Apartado 2. Asignar membresías

```sql
GRANT geo_lectura TO usulector;
GRANT geo_edicion TO usueditor;
```

### Apartado 3. Conceder permisos

```sql
GRANT CONNECT ON DATABASE geo TO geo_lectura, geo_edicion;

GRANT USAGE ON SCHEMA public
TO geo_lectura, geo_edicion;

GRANT SELECT
ON TABLE comarques, poblacions, instituts
TO geo_lectura;

GRANT SELECT, INSERT, UPDATE
ON TABLE comarques, poblacions, instituts
TO geo_edicion;
```

### Apartado 4. Comprobar el acceso de `usulector`

Conéctate como `usulector` y ejecuta:

```sql
SELECT * FROM poblacions;
```

Debe funcionar.

```sql
UPDATE poblacions
SET poblacio = poblacio;
```

Debe fallar.

### Apartado 5. Comprobar el acceso de `usueditor`

Conéctate como `usueditor` y ejecuta:

```sql
UPDATE poblacions
SET poblacio = poblacio;
```

Debe funcionar.

```sql
DELETE FROM poblacions;
```

Debe fallar.

### Apartado 6. Revocar y comprobar un privilegio

```sql
REVOKE UPDATE
ON TABLE poblacions
FROM geo_edicion;
```

Comprueba el privilegio siguiendo el ejemplo del documento:

```sql
SELECT has_table_privilege(
    'usueditor',
    'public.poblacions',
    'UPDATE'
);
```

Resultado esperado:

```text
false
```

## Preguntas tipo examen

1. ¿Qué privilegio permite conectarse a una base de datos PostgreSQL?
2. ¿Qué diferencia existe entre `USAGE` y `CREATE` sobre un esquema?
3. ¿Qué ocurre si un usuario tiene `SELECT` sobre una tabla pero no tiene `USAGE` sobre el esquema?
4. ¿Qué hace `WITH GRANT OPTION`?
5. ¿Qué diferencia existe entre `RESTRICT` y `CASCADE`?
6. ¿Qué función permite comprobar si un usuario tiene `SELECT` sobre una tabla?
7. ¿Qué permisos hereda un usuario miembro de un rol?
8. ¿Qué significa conceder un privilegio a `PUBLIC`?
9. ¿Por qué `GRANT SELECT ON ALL TABLES IN SCHEMA` no garantiza permisos sobre tablas futuras?
10. ¿Qué ocurre al ejecutar `REVOKE geo_edicion FROM usueditor`?

