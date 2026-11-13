---
title: Creación de máquinas virtuales
---

## Importar la OVA del curso

La actividad de la UD1 utiliza una plantilla de **Ubuntu Server 22.04** facilitada en AULES.

1. Descarga la OVA del curso y guárdala en una carpeta con espacio suficiente.
2. Abre VirtualBox y selecciona **Archivo → Importar servicio virtualizado**.
3. Selecciona el archivo `.ova` y revisa la configuración que presenta el asistente.
4. Comprueba el nombre de la VM, la cantidad de memoria y los adaptadores de red. No asignes más recursos de los que permite el equipo anfitrión.
5. Inicia la importación y espera a que termine.
6. Selecciona la VM importada y pulsa **Iniciar**.
7. Inicia sesión con las credenciales que acompañan a la plantilla o que indique el profesorado.

No publiques la OVA si contiene credenciales, datos o configuraciones del centro.

## Crear una VM desde una ISO

Si el profesorado no proporciona una OVA y autoriza una instalación nueva:

1. Selecciona **Nueva** y escribe un nombre reconocible, por ejemplo `ASGBD-Ubuntu`.
2. Selecciona la imagen ISO oficial indicada para la práctica.
3. Asigna memoria y CPU de acuerdo con los recursos del anfitrión y los requisitos de la asignatura.
4. Crea un disco virtual del tamaño indicado. Para prácticas, el formato dinámico puede ahorrar espacio en el anfitrión.
5. Completa la instalación del sistema operativo y crea un usuario personal.
6. Expulsa la ISO virtual después de instalar, si el asistente no lo hace automáticamente.

No elijas una versión de Linux distinta a la requerida por la práctica sin autorización.

## Inicio, apagado e instantáneas

- Usa **Iniciar** para arrancar la VM.
- Apaga Ubuntu desde su menú o con `sudo poweroff`. Evita cerrar la ventana de VirtualBox con la opción de apagar a la fuerza mientras el sistema está escribiendo datos.
- Antes de una modificación importante, puedes crear una instantánea desde **Máquina → Tomar instantánea**.
- Una instantánea depende de los discos del anfitrión y no es una copia de seguridad. Si necesitas preservar entregas o datos, expórtalos o realiza una copia independiente.

Continúa con la [Configuración de red](04-configuracion-red.md).
