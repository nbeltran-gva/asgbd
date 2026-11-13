---
title: Conceder acceso a otro administrador de Docker
---

El motor Docker puede crear contenedores con acceso a recursos del anfitrión. Por ese motivo, quien puede controlar el motor Docker puede obtener privilegios equivalentes a los de administrador del anfitrión. Concede acceso solo en una máquina de prácticas y a una persona autorizada.

## Comprobar el acceso actual

Inicia sesión con la cuenta del primer administrador y comprueba qué grupos tiene:

```console
id
getent group docker
```

En Linux, los usuarios del grupo `docker` pueden ejecutar Docker sin anteponer `sudo`. Si el grupo no existe o la instalación aplica otra política, sigue la documentación de la distribución; no cambies los permisos del socket Docker manualmente.

## Añadir a un segundo usuario en Linux

Si la cuenta de la segunda persona ya existe y la política del equipo permite utilizar el grupo `docker`, ejecuta:

```console
sudo usermod -aG docker NOMBRE_USUARIO
```

La persona debe cerrar la sesión e iniciarla de nuevo. Después puede verificar el acceso con:

```console
id
docker version
docker run --rm hello-world
```

Si la cuenta aún no existe, créala según las normas del sistema antes de añadirla al grupo. En Windows y macOS, administra quién puede usar Docker Desktop mediante las cuentas y permisos del sistema; el grupo Linux `docker` no se aplica a esos anfitriones.

## Retirar el acceso

En Linux, para retirar a la persona del grupo:

```console
sudo gpasswd -d NOMBRE_USUARIO docker
```

La persona debe cerrar la sesión para que el cambio tenga efecto. Comprueba el resultado con `id NOMBRE_USUARIO`.

!!! warning "Permiso de alto impacto"
    No expongas el socket o la API Docker a la red. No añadas usuarios al grupo `docker` por comodidad en un equipo compartido; utiliza únicamente el procedimiento autorizado por el centro.
