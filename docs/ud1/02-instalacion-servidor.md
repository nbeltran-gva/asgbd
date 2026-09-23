# 2. Instalación del servidor

PostgreSQL se puede instalar en Linux, Windows y otros sistemas operativos. En esta unidad se utiliza Ubuntu Server.

## Instalación desde Ubuntu

Los repositorios de Ubuntu permiten instalar PostgreSQL con `apt`:

```bash
sudo apt-get update
sudo apt-get install postgresql
```

Este método puede no instalar la última versión. Para instalar la versión más reciente se debe seguir la guía oficial de PostgreSQL para Ubuntu: [postgresql.org/download/linux/ubuntu](https://www.postgresql.org/download/linux/ubuntu/).

## Primer acceso con usuario del sistema 

Durante la instalación se crea el usuario del sistema `postgres`, que es el propietario del servicio y del clúster de PostgreSQL. Este usuario permite administrar el servidor desde el sistema operativo y ejecutar la consola de PostgreSQL (`psql`). 

Para acceder a la consola del servidor se puede cambiar a ese usuario y abrir `psql`:

```bash
sudo -i -u postgres
psql
```

También es posible entrar directamente desde la línea de comandos:

```bash
sudo -u postgres psql
```

En este punto, el **usuario del sistema** `postgres` tiene permisos para administrar el servicio y el clúster. Sin embargo, dentro de PostgreSQL también existe un *rol inicial* llamado `postgres`, que actúa como **usuario administrador del SGBD** y es el responsable de gestionar las bases de datos y sus objetos durante la configuración inicial. Aunque ambos compartan el mismo nombre, pertenecen a ámbitos distintos: el sistema operativo y el propio SGBD.

Este concepto se profundizará en la unidad 3, cuando se estudien los usuarios, los roles y los permisos del sistema gestor. Por ahora, basta con reconocer que el rol `postgres` es la identidad administrativa inicial de PostgreSQL y que debe manejarse con precaución.

Una vez verificado este acceso local, se puede preparar la conexión desde los clientes remotos o locales con permisos específicos.

## Estructura típica de un servidor PostgreSQL

Tras la instalación y el primer acceso inicial, es útil conocer la distribución de los archivos y directorios del servidor. En Ubuntu, PostgreSQL organiza la configuración, los datos y los registros en ubicaciones diferenciadas para facilitar la administración y la resolución de incidencias.

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

`<versión>` representa la versión instalada, por ejemplo `16`. El nombre `main` identifica habitualmente el clúster creado durante la instalación en Ubuntu.

!!! tip
    Un clúster es el conjunto de archivos y procesos que gestionan una o varias bases de datos de PostgreSQL.

Las ubicaciones principales son:

| Ubicación | Contenido principal | Función |
|---|---|---|
| `/etc/postgresql/<versión>/main/` | `postgresql.conf`, `pg_hba.conf` y `pg_ident.conf` | Contiene la configuración general, las reglas de autenticación y la relación entre usuarios del sistema y roles de PostgreSQL. |
| `/var/lib/postgresql/<versión>/main/` | Archivos de las bases de datos | Almacena los datos gestionados por PostgreSQL. Estos archivos no deben modificarse manualmente. |
| `/var/log/postgresql/` | Archivos de registro | Permite revisar errores de arranque, conexiones y funcionamiento del servidor. |
| `/usr/bin/` | `psql`, `pg_dump` y `pg_restore` | Contiene herramientas de cliente, administración, copia y restauración. |

Para consultar los clústeres instalados, su puerto y su estado se puede utilizar:

```bash
pg_lsclusters
```

Este comando muestra, entre otros datos, la versión, el nombre del clúster, el puerto, el estado y el directorio de datos. 

Para conocer la ubicación exacta de los **archivos de configuración** desde PostgreSQL se puede ejecutar:

```bash
sudo -u postgres psql -c "SHOW config_file;"
sudo -u postgres psql -c "SHOW hba_file;"
sudo -u postgres psql -c "SHOW data_directory;"
```
Estas consultas son preferibles a suponer una ruta, especialmente cuando hay varias versiones o varios clústeres instalados. La siguiente tabla resume su función:

| Comando | Qué muestra | Uso principal |
|---|---|---|
| `sudo -u postgres psql -c "SHOW config_file;"` | La ruta del archivo principal de configuración del clúster, normalmente `postgresql.conf`. | Localizar la configuración general del servidor. |
| `sudo -u postgres psql -c "SHOW hba_file;"` | La ruta del archivo `pg_hba.conf`. | Revisar qué clientes pueden conectarse y cómo se autentican. |
| `sudo -u postgres psql -c "SHOW data_directory;"` | El directorio donde PostgreSQL almacena los datos de las bases de datos. | Identificar la ubicación física de los datos del clúster. |

## Comprobaciones iniciales

Antes de configurar el acceso desde otros equipos, hay que comprobar que la instalación local funciona correctamente. 

Realiza las comprobaciones siguientes en este orden.

### 1. Comprobar el estado del servicio

Consulta el estado del servicio de PostgreSQL:

```bash
sudo systemctl status postgresql
```
Resultado de ejecución:
- El resultado debe indicar `active (running)`. 

También se puede comprobar de forma más breve con:

```bash
sudo systemctl is-active postgresql
```
Resultado de ejecución:
- Si devuelve `active`, el servicio está funcionando. 
- Si devuelve `inactive` o `failed`, no se debe continuar con la configuración de clientes; primero habrá que consultar los registros logs para conocer la causa.

### 2. Comprobar la versión instalada

Comprueba la versión del cliente y del servidor:

```bash
psql --version
sudo -u postgres psql -c "SELECT version();"
```
Resultado de ejecución:
- Ambas versiones deberían ser compatibles para garantizar un funcionamiento correcto de la instalación.


| Comando | Qué comprueba |
|---|---|
| `psql --version` | Muestra la versión del cliente `psql` instalado en el sistema. |
| `sudo -u postgres psql -c "SELECT version();"` | Confirma que el servidor PostgreSQL responde correctamente y muestra la versión del motor instalado. |


También se puede obtener información inicial sobre las herramientas instaladas:

```bash
psql --version
pg_config --bindir
pg_config --help
```

| Comando | Información que proporciona |
|---|---|
| `psql --version` | Muestra la versión del cliente de PostgreSQL instalado. |
| `pg_config --bindir` | Indica el directorio que contiene los programas ejecutables de PostgreSQL, como `psql`, `pg_dump` o `pg_restore`. |
| `pg_config --help` | Muestra las opciones disponibles de `pg_config`, una herramienta que proporciona información sobre la instalación de PostgreSQL. |

!!! note
	Si el sistema no reconoce `pg_config`, puede que no esté instalado el paquete de desarrollo o que su directorio no esté incluido en la variable `PATH`. Esto no significa necesariamente que el servidor no esté instalado.

### 3. Comprobar la conexión local

Realiza una conexión local con el usuario administrador y ejecuta una consulta sencilla:

```bash
sudo -u postgres psql -c "SELECT current_user, current_database();"
```
Resultado de ejecución:
- La salida debe mostrar el usuario `postgres` y la base de datos a la que se ha conectado. 

Esta prueba confirma que el servidor está disponible y que la autenticación local funciona.

### 4. Comprobar el puerto de escucha

Por defecto, PostgreSQL utiliza el **puerto TCP `5432`**. El puerto configurado puede consultarse desde el propio servidor:

```bash
sudo -u postgres psql -c "SHOW port;"
```

También se puede comprobar si existe un proceso escuchando en ese puerto:

```bash
sudo ss -ltnp | grep 5432
```
Resultado de ejecución:
- Debe aparecer una línea asociada a PostgreSQL. 
- Si no aparece, el servicio puede estar detenido, utilizar otro puerto o tener una configuración incorrecta.

### 5. Comprobar la disponibilidad del servidor

La utilidad `pg_isready` permite verificar rápidamente si PostgreSQL acepta conexiones:

```bash
pg_isready
```
Resultado de ejecución:
- Un resultado como `accepting connections` indica que el servidor está preparado para recibir conexiones. 
- Si aparece `no response`, hay que revisar el estado del servicio, el puerto y los registros.

Tras realizar estas comprobaciones, registra los resultados y la fecha en la documentación de la instalación. No se debe configurar el acceso remoto hasta que se haya verificado el correcto funcionamiento del servicio en local.

## Diagnóstico de errores e interpretación de registros

Durante la instalación puede aparecer un error de dependencias, permisos, formato de ficheros o incompatibilidad de versiones. En esos casos, hay que interpretar correctamente los mensajes del sistema y revisar los registros para localizar la causa real.

Los registros o archivos **log** guardan los mensajes generados por PostgreSQL y por el sistema. En ellos se pueden encontrar avisos, conexiones, errores de configuración, problemas de permisos y fallos producidos durante el arranque del servicio. En Ubuntu, esta información se consulta principalmente mediante dos mecanismos:

- el **diario del servicio `systemd`**, que se consulta con `journalctl` y no tiene por qué corresponder a un archivo visible en una carpeta;
- el **directorio `/var/log/postgresql/`**, donde se almacenan los archivos de registro específicos de PostgreSQL.

La ubicación concreta y el nivel de detalle dependen de la configuración del servidor. Por eso, cuando se investiga una incidencia, conviene consultar primero el estado y el diario del servicio y después los archivos de `/var/log/postgresql/`, si existen.

Los siguientes comandos permiten consultar el estado del servicio y sus registros:

```bash
sudo systemctl status postgresql
sudo journalctl -u postgresql --no-pager -n 80
sudo tail -n 50 /var/log/postgresql/postgresql-*.log
```

Cada comando aporta información diferente:

| Comando | Información que muestra | Utilidad |
|---|---|---|
| `sudo systemctl status postgresql` | Estado actual del servicio, momento de inicio y últimos mensajes asociados. | Permite saber si PostgreSQL está activo, detenido o ha fallado. |
| `sudo journalctl -u postgresql --no-pager -n 80` | Las 80 últimas entradas del registro del servicio PostgreSQL. | Ayuda a localizar errores del servicio. `-u` filtra el servicio y `--no-pager` muestra el resultado directamente en la terminal. |
| `sudo tail -n 50 /var/log/postgresql/postgresql-*.log` | Las 50 últimas líneas de los archivos de registro de PostgreSQL, si están disponibles. | Permite revisar errores recientes de configuración, arranque o conexiones. |

Cuando se produce una incidencia, conviene ejecutar primero `systemctl status` para conocer el estado general, después `journalctl` para revisar los mensajes del servicio y, finalmente, `tail` para consultar el registro específico de PostgreSQL.

Los mensajes de error suelen indicar:

- falta de paquetes o dependencias;
- conflicto de puertos o servicios ya ocupados;
- permisos de directorios de datos o de ejecución;
- errores de sintaxis en ficheros de configuración;
- problemas con la autenticación o la red.

!!! tip
    La clave es identificar el mensaje de error completo, comprobar la ruta del archivo afectado y relacionar la hora del error con el momento en que se produjo la incidencia. También conviene contrastar la versión de PostgreSQL con la versión y la configuración del sistema operativo.

## Resolución de incidencias de instalación

Una instalación correcta requiere no solo instalar el paquete, sino comprobar que el servicio arranca, que el directorio de datos tiene permisos adecuados y que el usuario del sistema `postgres` puede iniciar la sesión. Algunos fallos típicos son:

- el servicio no inicia porque hay un error en `postgresql.conf` o `pg_hba.conf`;
- no existe la base de datos por defecto o la inicialización del cluster falla;
- el puerto `5432` está ocupado por otra aplicación;
- la autenticación local impide el acceso desde clientes;
- no se ha habilitado la escucha en la dirección IP correcta.

Cuando aparece una incidencia, el procedimiento recomendado es:

1. confirmar el estado del servicio;
2. consultar el registro del servicio y el último error;
3. verificar la sintaxis y la estructura de los ficheros modificados;
4. restaurar la copia de seguridad si es necesario;
5. reiniciar el servicio y comprobar la conexión local;
6. documentar la corrección realizada.

El análisis de la causa raíz es esencial: un arreglo rápido sin comprender la causa puede provocar que el problema reaparezca en otra fase de la implantación.

---

## Actividad. Instalación del Servidor PostgreSQL

**Objetivo:**

Implantar el servidor PostgreSQL en un entorno Linux dedicado.

**Tareas:**

1. Instalar Ubuntu Server. (Vamos a utilizar máquina virtual o EC2 AWS)
2. Configurar una dirección IP estática mediante **Netplan** (al tratarse un servidor).
3. Instalar la última versión estable de PostgreSQL.
4. Comprobar el estado del servicio.
5. Identificar la versión instalada.
6. Localizar los principales directorios de configuración y almacenamiento de datos.
7. Verifica que el servidor escucha en el puerto por defecto.
8. Registra las incidencias que haya ido encontrando durante la instalación y como las has resuelto.

**No se modificará ninguna configuración interna de PostgreSQL.**

**Evidencias:**

- Captura de la configuración de red donde se visualice la dirección IP estática asignada.
- Captura del resultado del comando de verificación de la conectividad (ip a, ping, etc.).
- Captura de la instalación de PostgreSQL.
- Captura del servicio PostgreSQL en ejecución (systemctl status postgresql).
- Captura de la versión instalada (psql --version o consulta equivalente).
- Tabla identificando los principales directorios de PostgreSQL: Configuración, Datos, Logs.

**ENTREGA:** 

Breve informe técnico (1-2 páginas) descriendo el proceso de instalación y adjuntado las capturas de evidencias.