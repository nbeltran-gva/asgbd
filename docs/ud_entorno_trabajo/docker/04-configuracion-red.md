---
title: Configuración de red en Docker
---

## Red bridge

Docker crea redes de tipo *bridge* para comunicar contenedores. Una red definida por el usuario permite que los contenedores se encuentren por nombre:

```console
docker network create asgbd-red
docker network ls
```

Conecta un contenedor existente a esa red:

```console
docker network connect asgbd-red asgbd-postgres
docker network inspect asgbd-red
```

Otros contenedores conectados a `asgbd-red` pueden utilizar `asgbd-postgres` como nombre de host y el puerto interno `5432`. Dentro de un contenedor, `localhost` se refiere a ese mismo contenedor, no al anfitrión ni a otro contenedor.

## Publicar un puerto al anfitrión

La opción `-p` publica un puerto del contenedor en el anfitrión. Para limitar el acceso al propio equipo:

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
