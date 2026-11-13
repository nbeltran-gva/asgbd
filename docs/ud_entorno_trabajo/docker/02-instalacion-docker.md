---
title: Instalación de Docker
---

## Seleccionar el paquete adecuado

Instala Docker siguiendo la documentación oficial del sistema anfitrión:

- **Windows o macOS:** [Docker Desktop](https://docs.docker.com/desktop/).
- **Linux:** [Docker Engine](https://docs.docker.com/engine/install/) y el complemento Docker Compose.

En Windows, sigue los requisitos del instalador para WSL 2 y utiliza contenedores Linux para las prácticas del curso. En equipos del centro, comprueba antes que tienes autorización para instalar software y habilitar los componentes requeridos.

## Verificar Docker

Abre una terminal nueva y ejecuta:

```console
docker version
docker compose version
docker info
```

El cliente y el servidor deben mostrar información sin errores. En Linux puede ser necesario iniciar el servicio:

```console
sudo systemctl status docker
```

La política del sistema puede requerir `sudo` para ejecutar Docker. Consulta al administrador antes de cambiar permisos del sistema o añadir usuarios a grupos.

## Prueba de funcionamiento

La imagen oficial `hello-world` permite comprobar que Docker puede descargar y ejecutar una imagen:

```console
docker run --rm hello-world
```

El programa muestra un mensaje de confirmación y elimina el contenedor al terminar. Las imágenes descargadas pueden permanecer en el equipo.

Para crear un contenedor de PostgreSQL, consulta [Creación de contenedores](03-creacion-contenedores.md) y el [anexo de PostgreSQL con Docker](../../ud3/08-anexo-postgresql-docker.md).
