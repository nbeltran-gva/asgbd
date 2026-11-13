---
title: Introducción a Docker
---

Para una configuración completa con **pgAdmin** o **DBeaver**, consulta el [Anexo de PostgreSQL con Docker](../../ud3/08-anexo-postgresql-docker.md).

## ¿Qué es Docker?

Docker permite empaquetar y ejecutar aplicaciones en **contenedores**. Un contenedor comparte el núcleo del sistema anfitrión, mientras que una máquina virtual ejecuta un sistema operativo invitado completo.

| Concepto | Descripción |
|---|---|
| Imagen | Plantilla inmutable desde la que se crea un contenedor. |
| Contenedor | Instancia en ejecución de una imagen con su propia configuración. |
| Registro | Servicio que almacena y distribuye imágenes. |
| Volumen | Almacenamiento persistente gestionado por Docker. |
| Red | Permite la comunicación entre contenedores y, si se configura, con el anfitrión. |

Un contenedor es adecuado para preparar entornos repetibles de prácticas, pero no sustituye a las copias de seguridad ni a la administración de los datos.

## Contenedores y persistencia

Los archivos que solo existen dentro de la capa escribible del contenedor pueden perderse al eliminarlo. Para bases de datos se debe utilizar un volumen o un montaje de datos. El ciclo de vida del contenedor y el de sus datos son independientes.

!!! warning "Entorno de prácticas"
    Los ejemplos de este bloque son para uso local. No publiques puertos ni credenciales en una red compartida y no utilices contraseñas de prácticas en sistemas reales.

## Comprobar la instalación

Después de instalar Docker, comprueba la conexión al motor:

```console
docker version
docker compose version
```

`docker version` debe mostrar tanto el cliente como el servidor. Si el servidor no aparece, inicia Docker Desktop o el servicio Docker según el sistema operativo.

Continúa con [Instalación de Docker](02-instalacion-docker.md).
