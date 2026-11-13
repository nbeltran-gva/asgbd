---
title: Introducción a VirtualBox
---

## Objetivos

En este bloque prepararás un servidor local en una máquina virtual. La máquina virtual permite practicar la administración de Linux y PostgreSQL sin instalar el servidor directamente en el equipo anfitrión.

## Conceptos básicos

**VirtualBox** es un hipervisor de tipo 2: se instala como una aplicación en el sistema operativo anfitrión y ejecuta sistemas operativos invitados como máquinas virtuales.

| Término | Significado |
|---|---|
| Anfitrión (*host*) | Equipo físico y sistema operativo donde se ejecuta VirtualBox. |
| Invitado (*guest*) | Sistema operativo instalado dentro de la máquina virtual. |
| Máquina virtual | Configuración de CPU, memoria, disco, red y dispositivos del invitado. |
| Imagen ISO | Archivo de instalación de un sistema operativo. |
| OVA | Paquete que puede incluir una máquina virtual ya preparada para importar. |
| Instantánea | Estado al que se puede volver durante una práctica; no sustituye a una copia de seguridad. |

En esta unidad se utilizará la plantilla **Ubuntu Server 22.04** proporcionada en AULES. Si el profesorado facilita una OVA, impórtala en lugar de crear una instalación distinta.

## Recursos y seguridad

- Asigna a la VM solo la memoria y CPU necesarias; reserva recursos para el anfitrión.
- Comprueba que tienes espacio libre suficiente para el disco virtual y las instantáneas.
- Usa las credenciales de prácticas proporcionadas por el profesorado y cámbialas si así se indica.
- No guardes contraseñas ni claves privadas en capturas o repositorios.
- Apaga Ubuntu desde el sistema operativo antes de detener o cerrar la VM.
- Usa instantáneas antes de cambios importantes, pero conserva copias de seguridad independientes de los datos que debas entregar.

## Recorrido del bloque

1. Instala VirtualBox: [Instalación de VirtualBox](02-instalacion-virtualbox.md).
2. Importa o crea la VM: [Creación de máquinas virtuales](03-creacion-vm.md).
3. Configura su conectividad: [Configuración de red](04-configuracion-red.md).
4. Accede al servidor: [Conexión por SSH](05-conexion-ssh.md).
5. Practica comandos y administración básica: [Comandos básicos Linux](06-comandos-basicos.md) y [Conceder acceso a otro administrador](07-conceder-acceso.md).
