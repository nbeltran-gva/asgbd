---
title: Conexión por SSH
---

## Preparar el servidor Ubuntu

En la consola de Ubuntu de la VM, instala y activa el servidor SSH:

```console
sudo apt update
sudo apt install openssh-server
sudo systemctl enable --now ssh
sudo systemctl status ssh
```

El servicio debe aparecer como `active (running)`. Para consultar la dirección de la VM:

```console
ip -br address
```

Utiliza la dirección de la interfaz correspondiente al modo de red configurado. No uses `127.0.0.1` desde otro equipo: esa dirección siempre apunta al propio equipo cliente.

## Conectarse desde un cliente

Desde Linux, macOS o PowerShell con OpenSSH, ejecuta:

```console
ssh usuario@DIRECCION_IP
```

Sustituye `usuario` por tu cuenta de Ubuntu y `DIRECCION_IP` por la dirección de la VM. La primera conexión solicita confirmar la huella del servidor; verifica que estás conectando con la VM correcta antes de aceptar.

Para cerrar la sesión:

```console
exit
```

## Diagnóstico básico

Si no conecta:

1. Comprueba que la VM está iniciada.
2. Verifica la dirección con `ip -br address`.
3. Comprueba que el servicio SSH está activo con `sudo systemctl status ssh`.
4. Verifica que cliente y VM pueden comunicarse mediante el modo de red elegido.
5. Si utilizas NAT, configura el reenvío de puertos solo siguiendo las instrucciones de la práctica.

No abras SSH a redes ajenas ni habilites el acceso remoto de `root`. No compartas la contraseña del usuario. Para configurar una clave SSH, sigue las instrucciones de la práctica y conserva la clave privada fuera del repositorio.
