# 4. Puesta en marcha y comprobación

Una vez instalado PostgreSQL, el administrador debe saber cómo **iniciar, detener, reiniciar, recargar y comprobar el estado del servicio** para realizar tareas de mantenimiento y aplicar cambios de configuración.

## Gestión mediante **systemd**

En Ubuntu Server, PostgreSQL se gestiona habitualmente mediante **systemd**, por lo que la herramienta principal es `systemctl`.

### Comprobar el estado del servidor

Para consultar si PostgreSQL está funcionando:

```bash
sudo systemctl status postgresql
```

El resultado permite comprobar si el servicio está:

- `active (running)` → PostgreSQL está funcionando.
- `inactive` → el servicio está detenido.
- `failed` → se ha producido un error al iniciar o ejecutar el servicio.

Para salir de la información mostrada por `status`, pulsa `q`.

---

### Iniciar y detener PostgreSQL

Los principales comandos son:

| Comando | Función |
|---|---|
| `sudo systemctl start postgresql` | Inicia PostgreSQL. |
| `sudo systemctl stop postgresql` | Detiene PostgreSQL. |
| `sudo systemctl restart postgresql` | Detiene y vuelve a iniciar PostgreSQL. |
| `sudo systemctl reload postgresql` | Recarga la configuración sin reiniciar completamente el servidor. |
| `sudo systemctl status postgresql` | Muestra el estado del servicio. |

!!! tip "¿Reiniciar o recargar?"
    `restart` detiene y vuelve a iniciar completamente PostgreSQL.
    `reload` vuelve a leer los archivos de configuración compatibles con recarga sin interrumpir las conexiones activas.

    Siempre que sea posible, es preferible utilizar `reload`, ya que evita detener el servicio.

### ¿Se puede reiniciar PostgreSQL desde SQL?

No existe un comando SQL para reiniciar completamente el servidor PostgreSQL. Desde una sesión SQL sí se puede solicitar una **recarga** de la configuración:

```sql
SELECT pg_reload_conf();
```

Esta función no detiene ni vuelve a iniciar el servidor. Si un cambio necesita un reinicio, hay que salir de `psql` y ejecutarlo desde el sistema operativo, por ejemplo en Ubuntu:

```bash
sudo systemctl restart postgresql
```

También se puede usar `pg_ctl` sobre el clúster correspondiente, como se explica más adelante en esta unidad. Para la administración habitual de una instalación gestionada por `systemd`, se recomienda `systemctl`.

### Inicio automático con Ubuntu

Además de iniciar o detener PostgreSQL manualmente, podemos indicar si el servicio debe iniciarse automáticamente cuando arranca Ubuntu.

Para gestionar el inicio automático del servicio se pueden utilizar los siguientes comandos:

| Comando | Acción |
|---|---|
| `sudo systemctl is-enabled postgresql` | Comprueba si PostgreSQL está configurado para arrancar automáticamente al iniciar Ubuntu. |
| `sudo systemctl enable postgresql` | Activa el inicio automático del servicio. |
| `sudo systemctl enable --now postgresql` | Activa el inicio automático y arranca PostgreSQL inmediatamente. |
| `sudo systemctl disable postgresql` | Desactiva el inicio automático del servicio. |

---

## Herramienta de control de PostgreSQL `pg_ctl`

PostgreSQL incluye una herramienta llamada `pg_ctl` que permite **iniciar, detener, reiniciar, recargar y consultar el estado de un servidor PostgreSQL**.

En sistemas Linux como Ubuntu, la administración habitual del servicio suele realizarse mediante `systemctl`.

Sin embargo, `pg_ctl` resulta especialmente útil cuando se trabaja directamente con un clúster PostgreSQL concreto, ya que permite gestionarlo indicando su directorio de datos.



!!! info "Clúster PostgreSQL"

    En PostgreSQL, un clúster es el conjunto de bases de datos gestionadas por una misma instancia del servidor y almacenadas en un mismo directorio de datos.

    No debe confundirse con un clúster de alta disponibilidad formado por varios servidores.

### Sintaxis general
    
```bash
pg_ctl [opciones] acción
```
Donde:

- opciones modifica el comportamiento del comando.
- acción indica la operación que se desea realizar sobre el servidor PostgreSQL.

#### Opciones

| Opción | Descripción |
|----------|----------|
| `-D directorio` | Indica el directorio de datos del clúster PostgreSQL sobre el que se va a trabajar. |
| `-l fichero` | Envía los mensajes de inicio y funcionamiento a un fichero de registro. |
| `-m modo` | Especifica el modo de parada (`smart`, `fast` o `immediate`). |
| `-w` | espera a que la operación termine y devuelve su resultado. |
| `-W` | No espera a que la operación finalice y devuelve el control inmediatamente. |
| `-t segundos` | Establece el tiempo máximo de espera para determinadas operaciones. |
| `-s` | Muestra únicamente mensajes de error, reduciendo la información mostrada en pantalla. |

#### Acciones

En todas estas acciones puede utilizarse la **opción `-D`** directorio para indicar el clúster sobre el que se desea trabajar.

| Acción | Descripción |
|---------|-------------|
| `start` | Inicia el servidor PostgreSQL.|
| `stop` | Detiene el servidor PostgreSQL.|
| `restart` | Reinicia el servidor PostgreSQL.|
| `reload` | Recarga los archivos de configuración sin reiniciar el servidor. |
| `status` | Muestra el estado actual del servidor PostgreSQL. |

#### Modos de parada

Al utilizar pg_ctl stop, podemos indicar mediante la **opción `-m`** cómo queremos detener PostgreSQL.

| Modo | Descripción |
|---|---|
| `smart` | No acepta nuevas conexiones y espera a que finalicen todas las sesiones activas antes de detener el servidor. |
| `fast` | Finaliza las conexiones activas y cancela las transacciones no confirmadas. Es el modo de parada habitual. |
| `immediate` | Detiene PostgreSQL inmediatamente sin realizar una parada ordenada. Debe utilizarse únicamente en situaciones excepcionales. Durante el siguiente arranque PostgreSQL ejecutará una recuperación automática.|


### Ejemplos de uso

**Ejemplo: Iniciar el servidor PostgreSQL**

```bash
pg_ctl -D /var/lib/postgresql/16/main start
```
Este comando inicia el servidor PostgreSQL asociado al clúster almacenado en el directorio /var/lib/postgresql/16/main.

**Ejemplo: Comprobar el estado del servidor PostgreSQL**

Por ejemplo:

```bash
pg_ctl -D /var/lib/postgresql/16/main status
```
Este comando permite comprobar si el servidor PostgreSQL asociado al clúster situado en /var/lib/postgresql/16/main se encuentra en ejecución.

Si PostgreSQL está funcionando, se mostrará información similar a:

```text
pg_ctl: server is running (PID: 3456)
/usr/lib/postgresql/16/bin/postgres ...
```

Si el servidor está detenido, aparecerá un mensaje parecido a:

```text
pg_ctl: no server running
```

**Ejemplo: Detener el servidor PostgreSQL**

Por ejemplo:

```bash
pg_ctl -D /var/lib/postgresql/16/main -m fast stop
```
Este comando detiene el servidor PostgreSQL asociado al clúster situado en /var/lib/postgresql/16/main utilizando el modo de parada fast, que es el método recomendado para una parada normal del servicio.

El modo fast:

- impide nuevas conexiones;
- finaliza las sesiones activas;
- cancela las transacciones que no hayan sido confirmadas;
- realiza una parada segura y controlada del servidor.

**Ejemplo: Recargar la configuración**

Después de modificar archivos como `postgresql.conf` o `pg_hba.conf`, normalmente es suficiente ejecutar `reload` para que PostgreSQL vuelva a leer la configuración sin detener el servidor:

```bash
   pg_ctl -D /var/lib/postgresql/16/main reload
```


### Usuario propietario del clúster

La herramienta pg_ctl debe ejecutarse como el usuario propietario del clúster, que normalmente es postgres. Ejecutarla con otro usuario puede producir errores de permisos.

Realizamos el cambio de usuario:

```bash
sudo -i -u postgres
```

A partir de ese momento, los comandos pg_ctl se ejecutarán con los permisos adecuados.

### Ubicación de `pg_ctl`

En muchas distribuciones Linux, los ejecutables de PostgreSQL se almacenan dentro del directorio de instalación de PostgreSQL.

Por ejemplo, en Ubuntu y Debian para PostgreSQL 16 es habitual encontrarlos en:

```bash
/usr/lib/postgresql/16/bin
```
Hay que tener en cuenta que la ruta exacta puede variar según la distribución y la versión instalada.

Si el comando `pg_ctl` no se encuentra disponible desde cualquier ubicación del sistema, podemos acceder primero a dicho directorio:

```bash
cd /usr/lib/postgresql/16/bin
```
y ejecutar posteriormente los comandos de administración:

```bash
./pg_ctl -D /var/lib/postgresql/16/main status
```
```bash
./pg_ctl -D /var/lib/postgresql/16/main -m fast stop
```

También es posible ejecutar `pg_ctl` indicando su ruta completa:

```bash
/usr/lib/postgresql/16/bin/pg_ctl -D /var/lib/postgresql/16/main status
```

## Recomendación final

!!! warning "No mezclar herramientas"

    Cuando PostgreSQL está gestionado por `systemd`, lo habitual es utilizar `systemctl` para iniciar, detener o reiniciar el servicio.

    Aunque `pg_ctl` puede realizar operaciones similares, no conviene alternar ambas herramientas sin conocer su funcionamiento.

    En Ubuntu se recomienda utilizar `systemctl` para la administración cotidiana y reservar `pg_ctl` para tareas específicas o cuando se trabaja directamente con un clúster concreto.

En la mayoría de instalaciones Ubuntu administradas mediante `systemctl`, normalmente no será necesario acceder directamente a este directorio.
