---
title: Configuración de red en Docker
---

## Red bridge

Docker crea redes de tipo *bridge* para comunicar contenedores. Docker Compose crea automáticamente una red para los servicios definidos en el mismo proyecto; por eso, un servicio puede localizar a otro usando el nombre del servicio.

En el proyecto PostgreSQL de ASGBD, otro servicio de la misma red Compose se conecta a PostgreSQL con el host `postgres` y el puerto interno `5432`. Dentro de un contenedor, `localhost` se refiere a ese mismo contenedor, no al anfitrión ni a otro servicio.

También puedes crear una red manualmente con Docker:

```console
docker network create asgbd-red
docker network ls
```

Conecta un contenedor existente a esa red:

```console
docker network connect asgbd-red asgbd-postgres
docker network inspect asgbd-red
```

Los contenedores conectados a `asgbd-red` pueden comunicarse usando el nombre del contenedor y el puerto interno `5432`.

## Publicar un puerto al anfitrión

La opción `-p` de `docker run` publica un puerto del contenedor en el anfitrión. En Compose, la misma configuración se expresa con `ports`. Para limitar el acceso al propio equipo, Compose usa, por ejemplo, `"127.0.0.1:5433:5432"`: el anfitrión conecta a `localhost:5433` y otros servicios de la misma red Compose usan `postgres:5432`.

Este ejemplo muestra la sintaxis equivalente con `docker run`:

```console
docker run --name web-local -p 127.0.0.1:8080:80 -d nginx
```

Abre `http://localhost:8080` en el anfitrión para probarlo. El formato es `IP_DEL_ANFITRION:PUERTO_DEL_ANFITRION:PUERTO_DEL_CONTENEDOR`.

No uses `-p 8080:80` en una red compartida sin entender sus implicaciones: al omitir la dirección local, Docker puede publicar el servicio en todas las interfaces del anfitrión.

## Diagnóstico

```console
docker network ls
docker network inspect asgbd-red
docker port asgbd-postgres
```

Al finalizar, puedes desconectar un contenedor o eliminar la red de práctica:

```console
docker network disconnect asgbd-red asgbd-postgres
docker network rm asgbd-red
```

Docker no permite eliminar una red que todavía está en uso. No elimines redes que utilicen otros proyectos.
