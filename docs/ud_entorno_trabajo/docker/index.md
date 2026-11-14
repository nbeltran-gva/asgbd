---
title: Docker y Docker Compose
nav: inline
---

En este bloque aprenderás a ejecutar y administrar aplicaciones en **contenedores Docker**. Usarás los comandos de Docker para conocer sus recursos y Docker Compose para definir y poner en marcha el servidor PostgreSQL de las prácticas desde un archivo `compose.yaml`.

## Contenidos

- [Introducción a Docker y Docker Compose](01-intro-docker.md): Imágenes, contenedores y definición de servicios con Compose.
- [Instalación de Docker](02-instalacion-docker.md): Docker Desktop o Docker Engine y verificación de Compose.
- [Creación de contenedores](03-creacion-contenedores.md): Puesta en marcha de PostgreSQL con `compose.yaml`.
- [Configuración de red](04-configuracion-red.md): Redes Docker, puertos publicados y comunicación entre servicios Compose.
- [P0.1. Comandos básicos Docker y Compose](05-comandos-basicos.md): Gestión de contenedores, servicios, imágenes y volúmenes.
- [P0.2. Conceder acceso a otro administrador](06-conceder-acceso.md): Permisos en Linux, grupo `docker` y retirada de acceso.

## Entorno de prácticas

Los ejemplos están diseñados para uso local. No publiques puertos ni credenciales en redes compartidas y no reutilices contraseñas de prácticas en sistemas reales.

El [Anexo de PostgreSQL con Docker](../../ud3/08-anexo-postgresql-docker.md) contiene el `compose.yaml` completo de las prácticas, la importación de `dades_geo.sql` y el uso de las carpetas compartidas `scripts` y `backups`.
