---
title: Creación de contenedores con Docker Compose
---

## Preparar el proyecto

Docker Compose lee la configuración de `compose.yaml` desde la carpeta del proyecto. Para las prácticas de ASGBD, crea la carpeta `asgbd-postgres-ud3` y descarga en ella el [`compose.yaml` del anexo de la UD3](../../ud3/src/compose.yaml).

```console
mkdir asgbd-postgres-ud3
cd asgbd-postgres-ud3
```

El archivo define PostgreSQL 17, el puerto local `5433`, un volumen persistente para las bases de datos, una carpeta compartida para scripts y otra para copias. La guía de [PostgreSQL con Docker](../../ud3/08-anexo-postgresql-docker.md) explica cada parámetro y cómo colocar `dades_geo.sql` en `scripts`.

## Iniciar y comprobar el servicio

Desde la carpeta que contiene `compose.yaml`, ejecuta:

```console
docker compose up -d
docker compose ps
docker compose logs postgres
```

`docker compose up -d` crea e inicia los recursos definidos en el archivo. `ps` muestra el estado del servicio y `logs` permite comprobar que PostgreSQL está preparado para aceptar conexiones.

Abre `psql` dentro del contenedor para comprobar la conexión:

```console
docker compose exec postgres psql -U postgres -d postgres
```

Dentro de `psql`, ejecuta las consultas y sal con `\q`:

```sql
SELECT version();
SELECT current_user, current_database();
```

Desde un cliente instalado en el ordenador, conéctate a `localhost`, puerto `5433`, base `postgres` y usuario `postgres`. La contraseña inicial indicada en el archivo es `postgres`; solo se aplica cuando PostgreSQL inicializa un volumen vacío.

## Detener y reanudar

```console
docker compose stop
docker compose start
```

Para eliminar el contenedor y la red del proyecto sin borrar los datos:

```console
docker compose down
```

Los volúmenes persisten al detener o eliminar el contenedor. No añadas `-v` a `docker compose down` si necesitas conservar las bases de datos o los tablespaces.
