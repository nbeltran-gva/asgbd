# 3. Instalación del servidor

PostgreSQL es un sistema gestor de bases de datos relacional, de código abierto, que sigue una arquitectura cliente-servidor. En este modelo, el servidor es el encargado de almacenar y gestionar la información, mientras que los clientes envían consultas y reciben resultados.

La comunicación con el servidor se realiza mediante SQL, un lenguaje estándar para definir, consultar y manipular datos. PostgreSQL ofrece funciones avanzadas como la gestión de transacciones, el control de concurrencia multiversión (MVCC), la replicación y mecanismos de integridad y seguridad.

Una instalación correcta es esencial para comenzar a trabajar con PostgreSQL de forma segura y estable. En esta unidad se utilizará Ubuntu Server como entorno de trabajo para instalar, verificar y administrar el servidor.

**Importancia del servidor PostgreSQL**

- administra las bases de datos del sistema;
- atiende las conexiones de los clientes;
- controla el acceso, la seguridad y la integridad de los datos;
- permite gestionar múltiples usuarios y procesos simultáneamente.

---

## Instalación desde Ubuntu

Antes de comenzar, es importante asegurarse de que el sistema está actualizado:

```bash
sudo apt update
sudo apt upgrade -y
```

Para instalar PostgreSQL y sus utilidades adicionales, se ejecuta:

```bash
sudo apt install postgresql postgresql-contrib -y
```

Este comando instala el servidor PostgreSQL y herramientas complementarias útiles para la administración y la recuperación de datos.

!!! tip
    Para instalar una versión específica o la última versión disponible, es recomendable consultar la guía oficial de PostgreSQL para Ubuntu:
    [postgresql.org/download/linux/ubuntu](https://www.postgresql.org/download/linux/ubuntu/)

---

## Primer acceso al SGBD con el usuario del sistema `postgres`

Durante la instalación se crea el usuario del sistema `postgres`, que es el propietario del servicio y del clúster de PostgreSQL. Este usuario permite administrar el servidor desde el sistema operativo y ejecutar la consola de PostgreSQL (`psql`).

Para entrar en la consola interactiva de PostgreSQL, se puede cambiar a este usuario y abrir `psql`:

```bash
sudo -i -u postgres
psql
```

También se puede hacer directamente desde la línea de comandos:

```bash
sudo -u postgres psql
```

Al iniciar una sesión de PostgreSQL mediante `psql`, el indicador de la consola cambiará a:
 
```text
postgres=#
```
 
Esto indica que ya no se están ejecutando comandos en la shell de Linux, sino en la consola interactiva de PostgreSQL.

Para salir del entorno interactivo, se escribe:

```text
postgres=# \q
```

!!! info
    El usuario del sistema `postgres` tiene permisos para administrar el servicio y el clúster de PostgreSQL.

    Sin embargo, dentro de PostgreSQL también existe un rol inicial llamado `postgres`, que actúa como usuario administrador del SGBD y es responsable de gestionar las bases de datos y sus objetos durante la configuración inicial.

    Aunque ambos compartan el mismo nombre, pertenecen a ámbitos distintos: el sistema operativo y el propio SGBD.

    Este concepto se profundizará en la unidad 3, cuando se estudien los usuarios, los roles y los permisos del sistema gestor. Por ahora, basta con reconocer que el rol `postgres` es la identidad administrativa inicial de PostgreSQL y que debe manejarse con precaución.

Una vez verificado este acceso local, se puede preparar la conexión desde clientes locales o remotos con permisos específicos.

---

## Estructura típica de un servidor PostgreSQL

Tras la instalación y el primer acceso inicial, es útil conocer la distribución de los archivos y directorios del servidor. En Ubuntu, PostgreSQL organiza la configuración, los datos y los registros en ubicaciones diferenciadas para facilitar su administración y la resolución de incidencias.

A continuación se muestra un esquema simplificado de la estructura típica de un clúster PostgreSQL:

```text
/
├── etc/postgresql/<versión>/main/
│   ├── postgresql.conf
│   ├── pg_hba.conf
│   └── pg_ident.conf
├── var/lib/postgresql/<versión>/main/
│   ├── base/
│   ├── global/
│   ├── pg_wal/
│   └── PG_VERSION
├── var/log/postgresql/
│   └── postgresql-<versión>-main.log
└── usr/bin/
    ├── psql
    ├── pg_dump
    └── pg_restore
```

`<versión>` representa la versión instalada, por ejemplo `16`. El nombre `main` identifica el clúster creado durante la instalación en Ubuntu.

!!! tip
    Un clúster es el conjunto de archivos y procesos que gestionan una o varias bases de datos de PostgreSQL.

    Para consultar los clústeres instalados, su puerto y su estado, se puede utilizar el comando `pg_lsclusters`. 
    Este comando muestra, entre otros datos, la versión, el nombre del clúster, el puerto, el estado y el directorio de datos.

### Ubicaciones principales

| Ubicación | Contenido principal | Función |
|---|---|---|
| `/etc/postgresql/<versión>/main/` | `postgresql.conf`, `pg_hba.conf`, `pg_ident.conf` | Contiene la configuración general, las reglas de autenticación y la relación entre usuarios del sistema y roles de PostgreSQL. |
| `/var/lib/postgresql/<versión>/main/` | Archivos de las bases de datos | Almacena los datos gestionados por PostgreSQL. Estos archivos no deben modificarse manualmente. |
| `/var/log/postgresql/` | Archivos de registro | Permite revisar errores de arranque, conexiones y funcionamiento del servidor. |
| `/usr/bin/` | `psql`, `pg_dump`, `pg_restore` | Contiene herramientas de cliente, administración, copia y restauración. |

### Inspección de la estructura del directorio

Para inspeccionar la estructura de los directorios del servidor, puede instalarse la utilidad `tree`:

```bash
sudo apt install tree
```

Después, se pueden consultar los directorios principales con una profundidad limitada para que la salida sea manejable:

```bash
sudo tree -L 3 /etc/postgresql
sudo tree -L 3 /var/lib/postgresql
sudo tree -L 2 /var/log/postgresql
```

Para localizar las herramientas de PostgreSQL sin listar todo `/usr/bin/`, se puede utilizar:

```bash
command -v psql pg_dump pg_restore
```

La salida mostrará la ruta completa de cada ejecutable si está instalado y disponible en la variable de entorno `PATH`.

---

## Comprobaciones iniciales

Antes de configurar acceso remoto, es necesario comprobar que PostgreSQL está instalado y funcionando correctamente en el sistema local.

Estas comprobaciones permiten verificar que el servicio está activo, que la versión es la correcta, que la autenticación local funciona, que el puerto de escucha está bien configurado y que el clúster está disponible para aceptar conexiones.

Se recomienda seguir este orden:

1. Comprobar el estado del servicio
2. Comprobar la versión instalada
3. Comprobar la conexión local
4. Comprobar el puerto de escucha
5. Comprobar el estado de los clústeres
6. Comprobar la disponibilidad del servidor

### 1. Estado del servicio

Antes de trabajar con PostgreSQL, es necesario verificar que el servicio del servidor está en ejecución.

**Comprobar el estado del servicio:** 

Ejecuta:

```bash
sudo systemctl status postgresql
```
- Si PostgreSQL funciona correctamente, aparecerá `Active: active (running)`

**Comprobar rápidamente si está activo:**

También podemos realizar una comprobación rápida:

```bash
sudo systemctl is-active postgresql
```
- Si el resultado es `active` el servidor PostgreSQL está funcionando.

**Comprobar el inicio automático:**

Es conveniente comprobar que PostgreSQL está configurado para iniciarse automáticamente cuando arranca Ubuntu:
 
```bash
sudo systemctl is-enabled postgresql
```
- Si aparece `enabled` PostgreSQL se iniciará automáticamente al arrancar el sistema.

!!! warning "Advertencia"
    Si el servicio no está activo, no debe continuarse con la configuración de clientes ni con la administración de bases de datos hasta identificar la causa del problema.

**Si PostgreSQL no está activo:**

Si el servicio aparece como inactive, podemos iniciarlo y después volvemos a comprobar su estado con estos comandos:

```bash
sudo systemctl start postgresql
sudo systemctl status postgresql
```

### 2. Versión instalada

Para comprobar la versión instalada, se debe consultar por separado el cliente `psql` y el servidor PostgreSQL.

**Versión del cliente**

```bash
psql --version
```

Este comando informa sobre la versión del programa `psql` instalado en Ubuntu. La opción `--version` solo muestra el cliente y no conecta con el servidor.

**Versión del servidor**

```bash
sudo -u postgres psql -c "SELECT version();"
```

Con este comando, el cliente `psql` se conecta al servidor local y ejecuta la consulta `SELECT version();`, que devuelve la versión del servidor junto con detalles de compilación. Si aparece el resultado, el servidor ha respondido correctamente a la conexión local.

Las versiones pueden ser distintas porque una corresponde al cliente y la otra al servidor. Es recomendable anotar ambas para saber qué cliente y qué motor están instalados.

<a id="conexion-local"></a>

### 3. Conexión local

Realiza una conexión local con el usuario administrativo `postgres` y ejecuta una consulta sencilla:

```bash
sudo -u postgres psql -c "SELECT current_user, current_database();"
```
 
Ejemplo de salida:
 
```text
current_user
--------------
postgres
```
 
Si la consulta devuelve un resultado, significa que el servidor acepta conexiones y es capaz de ejecutar sentencias SQL correctamente.


### 4. Puerto de escucha

Por defecto, PostgreSQL utiliza el puerto TCP `5432`.

Se puede consultar el puerto configurado desde el propio servidor:

```bash
sudo -u postgres psql -c "SHOW port;"
```

También se puede comprobar si existe un proceso escuchando en ese puerto. Este comando muestra los puertos TCP en escucha y el proceso asociado:

```bash
sudo ss -ltnp | grep 5432
```

Resultado esperado:

- Debe aparecer una línea asociada a PostgreSQL.
- Si no aparece, el servicio puede estar detenido, utilizar otro puerto o tener una configuración incorrecta.

### 5. Estado de los clústeres
 
En Ubuntu y otras distribuciones basadas en Debian, PostgreSQL puede gestionar uno o varios clústeres. Cada clúster dispone de su propia configuración, directorio de datos, procesos y puerto de escucha.
 
Para consultar los clústeres instalados en el sistema, ejecuta:
 
```bash
pg_lsclusters
```
 
Ejemplo de salida:
 
```text
Ver Cluster Port Status Owner Data directory
16 main 5432 online postgres /var/lib/postgresql/16/main
```
Los campos más relevantes son:

| Campo | Significado |
|---|---|
| `Ver` | Versión de PostgreSQL. |
| `Cluster` | Nombre del clúster. |
| `Port` | Puerto utilizado. |
| `Status` | Estado actual (`online` u `offline`). Si el estado aparece como `online`, el clúster está en ejecución. Si aparece como `offline`, el clúster no aceptará conexiones. |
| `Owner` | Usuario propietario del proceso. |
| `Data directory` | Ubicación de los datos. |

Cuando sea necesario administrar un clúster concreto, pueden utilizarse comandos como:
 
```bash
sudo pg_ctlcluster 16 main start
sudo pg_ctlcluster 16 main stop
sudo pg_ctlcluster 16 main restart
```
 
Estas utilidades permiten iniciar, detener o reiniciar un clúster específico sin necesidad de actuar sobre otros clústeres instalados en el servidor.

!!! note
 
    En una instalación estándar de Ubuntu suele crearse automáticamente un clúster llamado `main`. Su estado debería aparecer como `online` tras la instalación.

### 6. Disponibilidad del servidor

La utilidad `pg_isready` permite verificar rápidamente si PostgreSQL acepta conexiones de clientes:

```bash
pg_isready
```
Resultado esperado:

- Un resultado como `accepting connections` indica que el servidor está preparado para recibir conexiones.
- Si aparece `no response`, es necesario revisar el estado del servicio, el puerto y los registros.

Aunque `pg_isready` confirma que el servidor acepta conexiones, es recomendable realizar previamente una [comprobación de conexión local](#conexion-local).
  
!!! info "Importante"
    Tras realizar estas comprobaciones, registra los resultados y la fecha en la documentación de la instalación. No se debe configurar el acceso remoto hasta que se haya verificado el correcto funcionamiento del servicio en local.

---

## Diagnóstico de errores e interpretación de registros

Durante la instalación o el funcionamiento del servidor pueden aparecer errores de paquetes, permisos, configuración, autenticación o red.

Para averiguar la causa, no basta con repetir el comando que ha fallado: hay que comprobar el estado del servicio y consultar los mensajes registrados en el momento del problema.

En Ubuntu, existen dos fuentes principales de información:

1. Consultar el diario del servicio `systemd`;
2. Consultar los archivos de registro de PostgreSQL, si están habilitados en esa instalación.

### 1. Diario del servicio `systemd`

En primer lugar, consulta el estado general del servicio, el tiempo que lleva activo y los procesos asociados:

```bash
sudo systemctl status postgresql --no-pager
```

Resultado esperado:

- Este comando muestra información detallada sobre el servicio PostgreSQL, incluyendo su estado actual, la fecha de inicio y los procesos que tiene asociados.

En caso de producirse un error durante el arranque o el funcionamiento del servidor, los registros pueden consultarse mediante **`journalctl`**, una herramienta fundamental en Ubuntu Server para el diagnóstico de incidencias. Para mostrar las últimas entradas registradas por el servicio PostgreSQL, ejecuta:

```bash
sudo journalctl -u postgresql --no-pager -n 80
```

Resultado esperado:

- `-u postgresql`: muestra únicamente las entradas asociadas al servicio PostgreSQL.
- `-n 80`: limita la salida a las 80 entradas más recientes.
- `--no-pager`: muestra la salida directamente en la terminal sin utilizar un paginador.

Para visualizar los registros más recientes y seguir los eventos en tiempo real, de forma similar a `tail -f`, puede utilizarse:

```bash
sudo journalctl -u postgresql -f
```
La consulta de estos registros es una tarea básica de administración que permite detectar problemas de configuración, errores de conexión o incidencias durante el inicio del servicio.

### 2. Archivos de registro `/var/log/postgresql/`

En muchas instalaciones de Ubuntu, PostgreSQL guarda archivos de registro en `/var/log/postgresql/`. Para consultar sus últimas 50 líneas:

```bash
sudo tail -n 50 /var/log/postgresql/postgresql-*.log
```
Resultado esperado:

- `tail -n 50` muestra las 50 líneas más recientes de cada archivo que coincida con ese patrón.
- Si no hay archivos o el comando indica que no encuentra ninguno, puede que esa instalación no esté guardando registros en ese directorio; en ese caso, conviene consultar el diario de `systemd`.

### 3. Interpretar los mensajes

Al revisar la salida, conviene fijarse en la fecha y la hora para localizar los mensajes relacionados con el fallo. Se debe leer el mensaje completo y las líneas próximas, porque suelen indicar qué operación falló y aportar una pista sobre la causa.

Entre los problemas habituales se encuentran:

- falta de paquetes o dependencias;
- conflicto de puertos o servicios ya ocupados;
- permisos de los directorios de datos o de ejecución;
- errores de sintaxis en archivos de configuración;
- problemas con la autenticación o la red.

!!! tip
    Anota el comando que produjo el problema y conserva el mensaje de error completo. Antes de modificar un archivo de configuración, identifica la causa y guarda una copia del archivo original.

## Secuencia recomendada para investigar una incidencia

1. Comprueba el servicio con `systemctl status` y el estado del clúster con `pg_lsclusters`.
2. Consulta el diario con `journalctl` y busca los mensajes de la hora en que ocurrió el problema.
3. Revisa los archivos de `/var/log/postgresql/`, si existen.
4. Contrasta el mensaje con la configuración, los permisos, el puerto y la operación que estabas realizando.
5. Una vez aplicada una corrección justificada, vuelve a comprobar el clúster y la conexión con `pg_isready`.

---

## Resolución de incidencias de instalación

Una vez reunida la información del apartado anterior, se debe relacionar el síntoma con los mensajes del servicio y del clúster. No se debe reiniciar el servidor ni cambiar archivos de configuración a ciegas: primero se debe identificar una causa probable y comprobar que la acción propuesta puede corregirla.

**Casos frecuentes de incidencia**

Algunos casos frecuentes son:

- el servicio no inicia porque hay un error en `postgresql.conf` o `pg_hba.conf`;
- no existe la base de datos por defecto o la inicialización del clúster falla;
- el puerto `5432` está ocupado por otra aplicación;
- la autenticación local impide el acceso desde clientes;
- no se ha habilitado la escucha en la dirección IP correcta.

**Procedimiento recomendado**

Cuando aparece una incidencia, el procedimiento recomendado es:

1. comprobar el estado del servicio PostgreSQL;
2. revisar el último error registrado en el diario del servicio o en los archivos de log;
3. verificar la sintaxis y la coherencia de los archivos de configuración modificados;
4. restaurar una copia de seguridad de la configuración si fuese necesario;
5. reiniciar el servicio y validar nuevamente su funcionamiento;
6. comprobar que es posible establecer una conexión local mediante herramientas como `psql` o `pg_isready`;
7. documentar la incidencia, la causa identificada y la solución aplicada.

El análisis de la causa raíz constituye una parte fundamental de la administración de bases de datos: un arreglo rápido sin comprender la causa puede provocar que el problema reaparezca en otra fase de la implantación.

---

## Conclusión

En esta unidad se ha visto cómo instalar PostgreSQL en Ubuntu Server, cómo verificar su funcionamiento y cómo interpretar los mensajes del sistema para diagnosticar problemas básicos. Estos pasos son fundamentales porque todo el trabajo posterior con bases de datos dependerá de que el servicio esté instalado, activo y correcto.

Antes de seguir con configuraciones más avanzadas, conviene tener claro lo siguiente:

- el servidor debe estar en ejecución;
- la autenticación local debe funcionar;
- la escucha del puerto debe estar correcta;
- los registros deben revisarse cuando aparece un problema.

Si estos aspectos se controlan correctamente, la configuración de clientes y la administración de bases de datos será mucho más segura y estable.

---

