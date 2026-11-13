---
title: Instalación de VirtualBox
---

## Requisitos previos

Antes de instalar, comprueba que:

- el equipo anfitrión cumple los requisitos de la versión de VirtualBox que vas a utilizar;
- hay suficiente espacio libre para la VM;
- la virtualización por hardware está disponible y habilitada en el equipo;
- tienes permisos para instalar software.

Si VirtualBox informa de que la virtualización no está disponible, consulta al profesorado o al administrador del equipo. No cambies la configuración del firmware de un equipo gestionado sin autorización.

## Instalación

1. Descarga VirtualBox desde la [página oficial de descargas](https://www.virtualbox.org/wiki/Downloads).
2. Selecciona el paquete correspondiente al sistema operativo anfitrión y sigue el instalador.
3. Acepta los controladores de red solicitados por el instalador. La conexión de red puede interrumpirse brevemente.
4. Reinicia el anfitrión si el instalador lo solicita.
5. Abre VirtualBox y comprueba que aparece la ventana principal.

En Windows también puedes verificar la versión desde PowerShell:

```powershell
VBoxManage --version
```

En Linux puedes ejecutar:

```console
VBoxManage --version
```

El comando debe mostrar una versión instalada. Si no se encuentra, cierra y vuelve a abrir la terminal o revisa que VirtualBox se haya instalado correctamente.

## Extension Pack

Instala el **Extension Pack** solo si una práctica requiere una función que no esté incluida en la instalación base. Descárgalo desde la página oficial y utiliza exactamente la misma versión que VirtualBox. No es necesario para importar una OVA o iniciar la VM de Ubuntu del curso.

!!! warning "Descargas y permisos"
    Utiliza únicamente los instaladores oficiales o los indicados por el centro. No desactives la protección del sistema ni instales paquetes de terceros para resolver un error sin consultarlo.

Cuando la aplicación esté operativa, continúa con [Creación de máquinas virtuales](03-creacion-vm.md).
