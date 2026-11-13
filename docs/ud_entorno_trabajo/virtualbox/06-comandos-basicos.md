---
title: Comandos básicos de Linux
---

Usa estos comandos en la terminal de Ubuntu Server. Los comandos de consulta se pueden ejecutar sin modificar el sistema; los cambios administrativos deben realizarse solo en la VM de prácticas.

## Identidad y sistema

```console
whoami
hostname
hostnamectl
id
```

Muestran el usuario actual, el nombre del equipo, información del sistema y los grupos del usuario.

## Archivos y directorios

```console
pwd
ls -la
cd /etc
cd
mkdir practica
```

`pwd` muestra la ruta actual; `ls -la` lista también los archivos ocultos; `cd` cambia de directorio; `mkdir` crea un directorio.

## Recursos y red

```console
df -h
free -h
ip -br address
ip route
ss -lnt
```

`df` muestra el espacio de disco, `free` la memoria, `ip` las interfaces y rutas y `ss` los puertos TCP en escucha.

## Servicios y registros

```console
systemctl status ssh
journalctl -u ssh --since today
```

`systemctl status` consulta el estado de un servicio. `journalctl` muestra sus registros; cambia `ssh` por el servicio que estés diagnosticando.

## Paquetes y ayuda

```console
sudo apt update
apt search NOMBRE
man COMANDO
COMANDO --help
```

`apt update` actualiza el índice de paquetes; no actualiza por sí solo todos los programas. Usa `sudo` solo cuando el comando requiera privilegios administrativos y hayas comprobado qué va a cambiar.

!!! warning "Comprueba antes de borrar"
    Evita ejecutar comandos de borrado o limpieza que no entiendas. En particular, no uses `rm -rf` con rutas no verificadas ni ejecutes comandos copiados de Internet sin revisarlos.

Para crear un segundo usuario con privilegios administrativos, sigue [Conceder acceso a otro administrador](07-conceder-acceso.md).
