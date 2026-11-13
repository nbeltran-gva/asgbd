---
title: Comandos básicos de Docker
---

## Contenedores

```console
docker ps
docker ps -a
docker start NOMBRE
docker stop NOMBRE
docker restart NOMBRE
docker logs NOMBRE
docker logs -f NOMBRE
docker exec -it NOMBRE sh
```

`docker ps` muestra los contenedores en ejecución; `docker ps -a` incluye los detenidos. `docker logs -f` sigue los registros en tiempo real; pulsa `Ctrl+C` para dejar de seguirlos. `docker exec` abre una shell si la imagen la incluye.

## Imágenes y volúmenes

```console
docker image ls
docker pull nginx
docker volume ls
docker volume inspect VOLUMEN
```

Una imagen es la plantilla del contenedor. Los volúmenes almacenan datos fuera de su ciclo de vida.

## Limpieza con cuidado

```console
docker rm NOMBRE
docker image rm IMAGEN
docker system df
```

`docker rm` elimina un contenedor detenido; `docker image rm` elimina una imagen que ya no se usa. Revisa antes qué recurso estás indicando.

!!! danger "Evita las limpiezas globales"
    No ejecutes `docker system prune --volumes` para resolver un problema sin revisar su alcance. Puede borrar contenedores, imágenes, redes y volúmenes, incluidos datos que quieras conservar.

Para ver todas las opciones de un comando:

```console
docker --help
docker COMANDO --help
```

Consulta [Conceder acceso a otro administrador](06-conceder-acceso.md) antes de compartir el control del motor Docker.
