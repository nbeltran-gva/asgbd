---
title: Conceder acceso a otro administrador
---

En esta práctica crearás una segunda cuenta administrativa en la VM Ubuntu. Cada persona debe iniciar sesión con su propia cuenta; no se deben compartir contraseñas.

## Crear la cuenta

Desde una sesión de un administrador autorizado, ejecuta:

```console
sudo adduser administrador2
```

Sustituye `administrador2` por un nombre de usuario permitido. Define una contraseña segura cuando el sistema la solicite. Los campos adicionales de `adduser` se pueden dejar vacíos si la práctica no los requiere.

## Dar permisos administrativos

En Ubuntu, los usuarios del grupo `sudo` pueden ejecutar tareas administrativas:

```console
sudo usermod -aG sudo administrador2
id administrador2
```

Comprueba que `sudo` aparece en la lista de grupos. El usuario nuevo debe cerrar y volver a iniciar sesión para que su sesión recoja la pertenencia al grupo.

## Verificar y retirar el acceso

Inicia una sesión como el usuario nuevo y comprueba sus permisos:

```console
su - administrador2
sudo -v
sudo whoami
```

El último comando debe mostrar `root`. Para salir de la cuenta:

```console
exit
```

Concede estos permisos únicamente a personas autorizadas. Para retirar el acceso administrativo:

```console
sudo gpasswd -d administrador2 sudo
```

Comprueba el cambio con `id administrador2` y finaliza las sesiones abiertas del usuario si procede.
