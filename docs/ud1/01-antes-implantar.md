# 1. Antes de implantar un SGBD

Implantar un sistema gestor de bases de datos no es solo instalar un programa. Antes de comenzar hay que entender qué necesita la organización, qué tipo de información va a gestionar y qué nivel de seguridad, disponibilidad y rendimiento exige ese servicio.

!!! warning
    Una mala planificación puede provocar errores de acceso, pérdida de tiempo, fallos de conexión o problemas de seguridad. Por eso, la implantación debe realizarse de forma ordenada y documentada.

## Puntos importantes antes de empezar

### 1. Definir el objetivo

Lo primero es responder a preguntas simples, pero muy importantes:

- ¿Qué datos se van a almacenar?
- ¿Cuántos usuarios o aplicaciones van a acceder a ellos?
- ¿Se necesita una base de datos pequeña o grande?
- ¿Habrá muchas consultas simultáneas?
- ¿Debe estar disponible 24 horas al día?

La respuesta a estas preguntas orienta la elección del SGBD y la configuración del sistema.

### 2. Revisar el entorno

Antes de instalar, conviene comprobar el entorno en el que va a funcionar el sistema:

- sistema operativo y versión;
- memoria disponible;
- capacidad de disco;
- nombre del equipo y dirección IP;
- conexión entre servidor y clientes;
- puertos que se van a utilizar;
- permisos de administración;
- ubicación prevista para los datos.

Este análisis ayuda a evitar problemas de rendimiento o incompatibilidades durante la instalación.

### 3. Elegir versión y método de instalación

Cada SGBD tiene varias versiones y distintas formas de instalación. Hay que estudiar la versión del sistema operativo, la compatibilidad del software y el procedimiento recomendado por el fabricante o la distribución.

En muchos casos se puede instalar desde un repositorio oficial, pero en otros será necesario seguir una guía específica o descargar el paquete adecuado.

**Comparación de alternativas y selección del SGBD**

No todos los sistemas gestores de bases de datos funcionan igual. Antes de elegir uno, conviene valorar aspectos como:

- tipo de datos que se van a manejar;
- número de usuarios previstos;
- necesidad de integridad y concurrencia;
- disponibilidad requerida;
- coste de licencia y soporte;
- facilidad de administración;
- capacidad de crecimiento;
- seguridad y monitorización.

!!! tip
    Una buena elección no se basa solo en el nombre del software, sino en la adecuación al proyecto. La mejor solución es la que cumple mejor los requisitos del sistema, no necesariamente la más conocida.

### 4. Planificar usuarios y conexiones

También hay que decidir quién puede acceder al sistema, desde dónde y con qué nivel de permisos. El principio básico es muy claro: solo se deben permitir los accesos estrictamente necesarios.

En un entorno real, hay que definir:

- qué usuarios son administradores;
- qué usuarios pueden consultar o modificar datos;
- si la conexión será local o remota;
- qué redes o equipos tendrán permiso de acceso;
- qué método de autenticación se usará.

**Infografía: planificación de accesos**

```text
    IDENTIFICAR USUARIOS ──> DEFINIR PERMISOS ──> CONTROLAR CONEXIONES
            │                        │                         │
            ▼                        ▼                         ▼
      Administrador             Usuario normal             Aplicación
      DBA / root               lectura/escritura          acceso controlado
            │                        │                         │
            ▼                        ▼                         ▼
      permisos altos           permisos mínimos          permisos restringidos
            │                        │                         │
            └──────────────┬─────────┴──────────────┬─────────────┘
                           │                         │
                 ¿Desde dónde se conecta?     ¿Qué autenticación usa?
                           │                         │
          ┌────────────────┼────────────────┐    ┌──────────────┴──────────────┐
          │                │                │    │                             │
      localhost         red local         remoto     local / peer                 contraseña
          │                │                │    │                             │
          ▼                ▼                ▼    ▼                             ▼
      mismo equipo     LAN / VLAN      IP concreta    máximo control            acceso controlado
          │                │                │    │                             │
          └──────────────────────────────────────────────────────────────────┘
```

Este esquema muestra la idea general: cada usuario debe tener un acceso definido, con permisos adecuados y con una justificación clara. Así se evita que se abran conexiones innecesarias o se concedan privilegios excesivos.

### 5. Planificar el almacenamiento

También es importante decidir dónde se almacenará la información. Hay que valorar:

- capacidad del disco;
- velocidad de lectura y escritura;
- posibilidad de distribuir los datos;
- estrategia de copia de seguridad;
- crecimiento previsto del sistema.

!!! tip
    Un buen diseño de almacenamiento ayuda a mejorar el rendimiento y a prevenir problemas futuros.

### 6. Preparar una copia y un registro

Antes de cambiar cualquier parámetro o fichero de configuración, se debe realizar una copia de seguridad. Además, es recomendable anotar:

- versión instalada;
- rutas de configuración y datos;
- puertos utilizados;
- usuarios creados;
- cambios realizados.

!!! warning "No modificar sin copia"
    Un error de configuración puede dejar el sistema sin arrancar o inutilizar una conexión importante.

## Secuencia recomendada de implantación

1. Definir requisitos y topología.
2. Preparar el servidor y la red.
3. Instalar el SGBD elegido.
4. Comprobar el acceso local.
5. Instalar un cliente compatible con el SGBD.
6. Configurar el acceso remoto.
7. Crear o importar una base de datos de prueba.
8. Verificar la conexión y documentar el resultado.

---
