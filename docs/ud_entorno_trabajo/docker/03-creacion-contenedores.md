---
title: Creación de contenedores
---

Para una configuración completa con **pgAdmin** o **DBeaver**, consulta el [Anexo de PostgreSQL con Docker](../../ud3/08-anexo-postgresql-docker.md).


## Crear un contenedor de PostgreSQL

Este ejemplo prepara PostgreSQL para una práctica local. Para una configuración con Compose, pgAdmin o DBeaver, sigue el [anexo de PostgreSQL con Docker](../../ud3/08-anexo-postgresql-docker.md).

Define una contraseña temporal para la práctica y ejecuta el comando desde una terminal. Sustituye `CAMBIAR_POR_UNA_CLAVE_DE_PRACTICAS` por una clave propia y no guardes una clave real en este documento:

```console
docker run --name asgbd-postgres -e POSTGRES_PASSWORD=CAMBIAR_POR_UNA_CLAVE_DE_PRACTICAS -p 127.0.0.1:5433:5432 -v asgbd-postgres-data:/var/lib/postgresql/data -d postgres:17
```

El puerto se publica solo en la interfaz local del anfitrión (`127.0.0.1`). El volumen `asgbd-postgres-data` conserva los datos aunque se elimine el contenedor.

## Comprobar y conectarse

```console
docker ps
docker logs asgbd-postgres
docker exec -it asgbd-postgres psql -U postgres
```

Cuando aparezca el indicador de `psql`, ejecuta:

```sql
SELECT version();
SELECT current_user;
\q
```

Para conectarte desde un cliente instalado en el mismo anfitrión, utiliza `localhost`, el puerto `5433`, el usuario `postgres` y la contraseña que definiste.

## Detener y eliminar

```console
docker stop asgbd-postgres
docker start asgbd-postgres
```

Para eliminar el contenedor al terminar una práctica:

```console
docker rm -f asgbd-postgres
```

Eliminar el contenedor no elimina el volumen. **No borres `asgbd-postgres-data` si necesitas conservar la base de datos.** Si quieres reiniciar desde cero, confirma primero que tienes permiso para borrar todos los datos del volumen.
