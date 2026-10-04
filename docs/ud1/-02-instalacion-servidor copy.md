# 3. Instalación del servidor

PostgreSQL es un sistema de gestión de bases de datos relacional (SGBD) de código abierto que funciona bajo una arquitectura cliente-servidor. En este modelo, el servidor se encarga de almacenar y administrar las bases de datos, mientras que los clientes se conectan para realizar consultas y operaciones sobre los datos.

La comunicación con el servidor se realiza mediante el lenguaje SQL (Structured Query Language), que permite crear, consultar, modificar y eliminar información de forma eficiente. PostgreSQL destaca por ofrecer características avanzadas como el control de concurrencia multiversión (MVCC), la gestión de transacciones y distintos mecanismos de replicación, garantizando la integridad, consistencia y disponibilidad de los datos.

Este SGBD puede instalarse en diferentes sistemas operativos, como Linux, Windows o macOS. En esta unidad se utilizará Ubuntu Server como plataforma de trabajo para la instalación y administración del servidor PostgreSQL.

## Instalación desde Ubuntu

Antes de comenzar, hay que asegurarse de que el sistema está actualizado:

```bash
sudo apt update && sudo apt upgrade -y
```
Para instalar PostgreSQL, ejecuta el siguiente comando, que descargará e instalará la versión más reciente disponible:

```bash
sudo apt install postgresql postgresql-contrib -y
```
Para instalar la versión más reciente se debe seguir la guía oficial de PostgreSQL para Ubuntu: 
[postgresql.org/download/linux/ubuntu](https://www.postgresql.org/download/linux/ubuntu/).

## Primer acceso al SGBD con usuario del sistema `postgres`

Durante la instalación se crea el usuario del sistema `postgres`, que es el propietario del servicio y del clúster de PostgreSQL. Este usuario permite administrar el servidor desde el sistema operativo y ejecutar la consola de PostgreSQL (`psql`). 

Para acceder a la **consola del servidor PostgreSQL (psql)** se puede cambiar a este usuario `postgres` y abrir `psql`. Con estas acciones:

```bash
sudo -i -u postgres
psql
```

También es posible entrar directamente desde la línea de comandos:

```bash
sudo -u postgres psql
```
Al entrar en la consola interactiva de PostgreSQL (psql) o lo que es lo mismo, haber iniciado una sesión de psql cambiará el prompt a ;

```text
postgres=#
```
El prompt o indicador de línea de comandos cambia porque dejamos la shell de Linux y accedemos al intérprete de comandos de PostgreSQL (psql). A partir de ese momento, los comandos se ejecutan sobre el gestor de bases de datos y no sobre el sistema operativo. Es decir, que los comandos que puedes utilizar son SQL (SELECT, CREATE DATABASE, DROP TABLE, etc.) o comandos propios de psql (\l, \dt, \q).

Para salir del entorno consola, debes escribir \q

```text
postgres=#\q
```

!!! info
	En este punto, el **usuario del sistema** `postgres` tiene permisos para administrar el servicio y el clúster. 
	
	Sin embargo, dentro de PostgreSQL también existe un *rol inicial* llamado `postgres`, que actúa como **usuario administrador del SGBD** y es el responsable de gestionar las bases de datos y sus objetos durante la configuración inicial. 
	
	Aunque ambos compartan el mismo nombre, pertenecen a ámbitos distintos: el sistema operativo y el propio SGBD.

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
	
	Para consultar los clústeres instalados, su puerto y su estado se puede utilizar el comando `pg_lsclusters` (este comando muestra, entre otros datos, la versión, el nombre del clúster, el puerto, el estado y el directorio de datos). 

Las ubicaciones principales son:

| Ubicación | Contenido principal | Función |
|---|---|---|
| `/etc/postgresql/<versión>/main/` | `postgresql.conf`, `pg_hba.conf` y `pg_ident.conf` | Contiene la configuración general, las reglas de autenticación y la relación entre usuarios del sistema y roles de PostgreSQL. |
| `/var/lib/postgresql/<versión>/main/` | Archivos de las bases de datos | Almacena los datos gestionados por PostgreSQL. Estos archivos no deben modificarse manualmente. |
| `/var/log/postgresql/` | Archivos de registro | Permite revisar errores de arranque, conexiones y funcionamiento del servidor. |
| `/usr/bin/` | `psql`, `pg_dump` y `pg_restore` | Contiene herramientas de cliente, administración, copia y restauración. |


Otra forma que puedes utilizar para conocer la ubicación exacta de los **archivos de configuración** desde PostgreSQL se puede ejecutar:

```bash
sudo -u postgres psql -c "SHOW config_file;"
sudo -u postgres psql -c "SHOW hba_file;"
sudo -u postgres psql -c "SHOW data_directory;"
```
Estas consultas son preferibles a suponer una ruta, especialmente cuando hay varias versiones o varios clústeres instalados. 

Para inspeccionar esta estructura en el servidor se puede instalar la utilidad `tree`:

```bash
sudo apt install tree
```
Después, se pueden consultar los directorios principales con una profundidad limitada para que la salida sea manejable:

```bash
sudo tree -L 3 /etc/postgresql
sudo tree -L 3 /var/lib/postgresql
sudo tree -L 2 /var/log/postgresql
```

Para localizar las **herramientas de PostgreSQL** en lugar de listar todo `/usr/bin/`, se puede utilizar el siguiente comando:

```bash
command -v psql pg_dump pg_restore
```
La salida mostrará la ruta completa de cada ejecutable si está instalado y disponible en la variable de entorno <code>PATH</code>.

## Comprobaciones iniciales

Una vez comprobado el acceso local a PostgreSQL, revisada la estructura de sus directorios y verificada la ubicación de los archivos de configuración, realiza las comprobaciones siguientes. Su objetivo es confirmar que la instalación funciona correctamente antes de configurar el acceso desde otros equipos.

Realiza las comprobaciones siguientes en este orden.

### 1. Comprobar el estado del servicio

Antes de comenzar a trabajar con PostgreSQL, es necesario verificar que el servicio del servidor se encuentra en ejecución.

Para consultar su estado, ejecuta el siguiente comando:

```bash
sudo systemctl status postgresql
```
También es posible realizar una comprobación más rápida mediante:

```bash
sudo systemctl is-active postgresql
```

Resultado de ejecución:

- Si devuelve active, el servicio está funcionando correctamente.
- Si devuelve inactive, el servicio está detenido.
- Si devuelve failed, el servicio ha producido algún error durante su inicio o funcionamiento.

Si el servicio no está activo, no se debe continuar con la configuración de clientes ni con la administración de bases de datos hasta identificar la causa del problema mediante la revisión de los registros del sistema.

En caso necesario, se puede iniciar el servicio y configurarlo para que se ejecute automáticamente al arrancar el sistema:

```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
```


### 2. Comprobar la versión instalada

Para comprobar la versión instalada, consulta por separado el cliente `psql` y el servidor PostgreSQL. Ambos comandos se escriben en la terminal de Ubuntu.

- Versión del cliente:

```bash
psql --version
```

Este comando muestra la versión del programa `psql` instalado en Ubuntu. La opción `--version` solo informa sobre el cliente: no se conecta al servidor ni comprueba si este está funcionando.

- Versión del servidor:

```bash
sudo -u postgres psql -c "SELECT version();"
```

 Con este comando el cliente `psql` se conecta al servidor local y con la opción `-c` le indica que ejecute la consulta `SELECT version();` que devuelve la versión del servidor y detalles de su compilación. Si aparece el resultado, el servidor ha respondido a la conexión local.

Las versiones pueden ser distintas porque una corresponde al cliente y la otra al servidor. Anota ambas: así podrás identificar qué cliente y qué motor están instalados.

### 3. Comprobar la conexión local

Realiza una conexión local con el usuario administrador `postgres` y ejecuta una consulta sencilla:

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

Tras realizar estas comprobaciones, registra los resultados y la fecha en la documentación de la instalación. **No se debe configurar el acceso remoto hasta que se haya verificado el correcto funcionamiento del servicio en local.**

## Diagnóstico de errores e interpretación de registros

Durante la instalación o el funcionamiento del servidor pueden aparecer errores de paquetes, permisos, configuración, autenticación o red. 

Para averiguar la causa, no basta con repetir el comando que ha fallado: hay que comprobar el estado del servicio y consultar los mensajes registrados en el momento del problema.

En Ubuntu se pueden consultar dos fuentes principales:

1. el **diario del servicio `systemd`**, que recoge mensajes de los servicios del sistema, 
2. y los **archivos de registro `logs`de PostgreSQL**, si están habilitados en esa instalación.

**1. CONSULTAR EL ESTADO Y EL DIARIO DEL SERVICIO SYSTEMD**

Antes de comenzar a trabajar con PostgreSQL, es recomendable comprobar que el servicio se encuentra en ejecución y revisar los registros del sistema en caso de incidencias.

En primer lugar, consulta el estado general del servicio, el tiempo que lleva activo y los procesos asociados:
 
```bash
sudo systemctl status postgresql --no-pager
```
 
Este comando muestra información detallada sobre el servicio PostgreSQL, incluyendo su estado actual, la fecha de inicio y los procesos que tiene asociados.

En caso de que se produzca algún error durante el arranque o funcionamiento del servidor, los registros pueden consultarse mediante la utilidad **journalctl**, una herramienta fundamental en Ubuntu Server para el diagnóstico de incidencias que permite acceder al diario gestionado por **systemd**.

Para mostrar las últimas entradas registradas por el servicio PostgreSQL, ejecuta:
 
```bash
sudo journalctl -u postgresql --no-pager -n 80
```
 
Opciones utilizadas:

- `-u postgresql`: muestra únicamente las entradas asociadas al servicio PostgreSQL.
- `-n 80`: limita la salida a las 80 entradas más recientes.
- `--no-pager`: muestra la salida directamente en la terminal sin utilizar un paginador.

Para visualizar los registros más recientes y seguir los eventos en tiempo real, de forma similar al comando `tail -f`, puede utilizarse:

```bash
sudo journalctl -u postgresql -f
```

La consulta de estos registros es una tarea básica de administración que permite detectar problemas de configuración, errores de conexión o incidencias durante el inicio del servicio.

**2. CONSULTAR LOS ARCHIVOS DE REGISTRO logs de PostgreSQL**

En muchas instalaciones de Ubuntu, PostgreSQL guarda archivos de registro en `/var/log/postgresql/`. Para consultar sus últimas 50 líneas:

```bash
sudo tail -n 50 /var/log/postgresql/postgresql-*.log
```

- `tail -n 50` muestra las 50 líneas más recientes de cada archivo que coincida con ese patrón. Si no hay archivos o el comando indica que no encuentra ninguno, puede que esa instalación no esté guardando registros en ese directorio; consulta el diario de `systemd`.

**3. INTERPRETAR LOS MENSAJES**

Al revisar la salida, fíjate en la fecha y la hora para localizar los mensajes relacionados con el fallo. Lee el mensaje completo y las líneas próximas: suelen indicar qué operación falló y aportar una pista sobre la causa. Entre los problemas habituales se encuentran:

- falta de paquetes o dependencias;
- conflicto de puertos o servicios ya ocupados;
- permisos de directorios de datos o de ejecución;
- errores de sintaxis en ficheros de configuración;
- problemas con la autenticación o la red.

!!! tip
    Anota el comando que produjo el problema y conserva el mensaje de error completo. Antes de modificar un archivo de configuración, identifica la causa y guarda una copia del archivo original.

Como resumen, sigue este orden cuando investigues una incidencia:

1. Comprueba el servicio con `systemctl status` y el estado del clúster con `pg_lsclusters`.
2. Consulta el diario con `journalctl` y busca los mensajes de la hora en que ocurrió el problema.
3. Revisa los archivos de `/var/log/postgresql/`, si existen.
4. Contrasta el mensaje con la configuración, los permisos, el puerto y la operación que estabas realizando.
5. Una vez aplicada una corrección justificada, vuelve a comprobar el clúster y la conexión con `pg_isready`.

## Resolución de incidencias de instalación

Una vez reunida la información del apartado anterior, relaciona el síntoma con los mensajes del servicio y del clúster. No reinicies el servidor ni cambies archivos de configuración a ciegas: primero identifica una causa probable y comprueba que la acción propuesta puede corregirla.

**CASOS FRECUENTES DE INCIDENCIA**

Algunos casos frecuentes son:

- el servicio no inicia porque hay un error en `postgresql.conf` o `pg_hba.conf`;
- no existe la base de datos por defecto o la inicialización del cluster falla;
- el puerto `5432` está ocupado por otra aplicación;
- la autenticación local impide el acceso desde clientes;
- no se ha habilitado la escucha en la dirección IP correcta.

**PASOS PARA RESOLVER UNA INCIDENCIA**

Cuando aparece una incidencia, el procedimiento recomendado es:

1. comprobar el estado del servicio PostgreSQL;
2. revisar el último error registrado en el diario del servicio o en los archivos de log;
3. verificar la sintaxis y la coherencia de los archivos de configuración modificados;
4. restaurar una copia de seguridad de la configuración si fuese necesario;
5. reiniciar el servicio y validar nuevamente su funcionamiento;
6. comprobar que es posible establecer una conexión local mediante herramientas como psql o pg_isready;
7. documentar la incidencia, la causa identificada y la solución aplicada.

El análisis de la causa raíz constituye una parte fundamental de la administración de bases de datos: un arreglo rápido sin comprender la causa puede provocar que el problema reaparezca en otra fase de la implantación.

---

## Actividad. Instalación del Servidor PostgreSQL

**Objetivo:**

Implantar el servidor PostgreSQL en un entorno Linux dedicado.

**Tareas:**

1. Crear un servidor Ubuntu Server utilizando uno de los siguientes entornos: a) Una máquina virtual importada desde la plantilla OVA proporcionada en AULES. b) Una instancia EC2 de AWS creada en el Laboratorio de clase.
2. Configurar una dirección IP estática.  a) En una máquina virtual, configurar una dirección IP estática mediante **Netplan**. b) En una instancia EC2 de AWS, identificar la dirección IP privada asignada por la VPC y asociar, si es necesario, una **Elastic IP** para disponer de una dirección pública permanente.
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

Breve informe técnico (2-4 páginas) descriendo el proceso de instalación y adjuntado las capturas de evidencias.

