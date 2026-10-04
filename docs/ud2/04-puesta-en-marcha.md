# 4. Puesta en marcha y comprobación

En un servidor PostgreSQL es necesario saber cómo **iniciar, detener, reiniciar, recargar y comprobar el estado** del servicio.

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


### Inicio automático con Ubuntu

Además de iniciar o detener PostgreSQL manualmente, podemos indicar si el servicio debe iniciarse automáticamente cuando arranca Ubuntu.

Para gestionar el inicio automático del servicio, se pueden utilizar estas opciones:

| Comando | Acción |
|---|---|
| `sudo systemctl is-enabled postgresql` | Comprueba si PostgreSQL está configurado para arrancar automáticamente al iniciar Ubuntu. |
| `sudo systemctl enable postgresql` | Activa el inicio automático del servicio. |
| `sudo systemctl enable --now postgresql` | Activa el inicio automático y arranca PostgreSQL inmediatamente. |
| `sudo systemctl disable postgresql` | Desactiva el inicio automático del servicio. |


## Herramienta de control de PostgreSQL `pg_ctl`

PostgreSQL incluye una herramienta llamada pg_ctl que permite iniciar, detener, reiniciar y consultar el estado de un servidor PostgreSQL.

En Ubuntu, la gestión habitual del servicio se realiza mediante systemctl. pg_ctl se utiliza principalmente cuando queremos trabajar directamente con un clúster PostgreSQL y conocemos su directorio de datos.

La opción -D permite indicar el directorio de datos del clúster.

En este ejemplo, pg_ctl consulta el estado del clúster situado en `/var/lib/postgresql/16/main` :

```bash
pg_ctl -D /var/lib/postgresql/16/main status
```

---

### Modos de parada de `pg_ctl`

Al utilizar pg_ctl stop, podemos indicar mediante la opción -m cómo queremos detener PostgreSQL.

| Modo | Descripción |
|---|---|
| `smart` | Espera a que los usuarios se desconecten antes de detener el servidor. |
| `fast` | Es el modo habitual de parada. Finaliza las conexiones activas y deshace las transacciones no confirmadas. |
| `immediate` | Detiene PostgreSQL inmediatamente, sin realizar una parada ordenada. Debe utilizarse solo en situaciones excepcionales, porque PostgreSQL tendrá que realizar una **recuperación automática** durante el siguiente arranque.|

Por ejemplo, para detener el servidor utilizando el modo fast:

```bash
pg_ctl -D /var/lib/postgresql/16/main -m fast stop
```

---
