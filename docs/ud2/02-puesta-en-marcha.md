# 2. Puesta en marcha y comprobación

## Iniciar y detener PostgreSQL

El servicio suele iniciarse y detenerse automáticamente con el sistema operativo. También se puede controlar con:

```bash
sudo service postgresql status
sudo service postgresql start
sudo service postgresql stop
sudo service postgresql restart
```

Desde la carpeta de ejecutables también se puede utilizar `pg_ctl`:

```bash
sudo su postgres
cd /usr/lib/postgresql/16/bin
./pg_ctl -D /var/lib/postgresql/16/main restart
./pg_ctl -D /var/lib/postgresql/16/main -m s stop
```

La opción `-m s` espera a que los usuarios se desconecten. `-m f` fuerza la desconexión y `-m i` detiene el servidor inmediatamente.

## Comprobar el acceso desde un cliente

Desde el cliente hay que verificar que:

1. el servidor responde en su dirección IP;
2. el puerto configurado está accesible;
3. el usuario existe y tiene contraseña;
4. `listen_addresses` permite la conexión;
5. `pg_hba.conf` contiene una regla que coincide;
6. el cliente puede abrir `psql` o pgAdmin.

En `psql` se pueden utilizar estos comandos:

```text
\l
\conninfo
\d
\q
```

`\l` muestra las bases de datos, `\conninfo` informa de la conexión actual, `\d` lista las tablas y `\q` cierra el cliente.

## Verificación funcional

Antes de considerar la configuración completa, es necesario confirmar que el servidor responde, que las credenciales son correctas y que el servicio no presenta errores en su arranque.

```bash
sudo systemctl status postgresql
sudo ss -tulpn | grep 5432
sudo -u postgres psql -l
```

En caso de fallo, es recomendable consultar el historial de errores del servicio:

```bash
sudo journalctl -u postgresql --no-pager -n 50
sudo tail -n 50 /var/log/postgresql/postgresql-*.log
```

Importa la base de datos `geo`, conéctate desde el cliente y ejecuta una consulta sobre una de sus tablas. Comprueba también que puedes guardar un resultado:

```text
\copy (SELECT * FROM comarques) TO '/tmp/prueba.csv' WITH CSV DELIMITER ';';
```

Una configuración se considera comprobada cuando el servicio arranca, el cliente conecta con las credenciales previstas, las consultas funcionan y los cambios realizados están documentados.

## Documentación de la configuración

Cada cambio debe registrarse para que otra persona pueda revisarlo o reproducirlo. Como mínimo, anota:

| Dato | Ejemplo |
|---|---|
| Fecha y responsable | 20/09/2026, nombre del administrador |
| Necesidad del cambio | Permitir conexiones desde la red de prácticas |
| Archivo y parámetro | `postgresql.conf`, `listen_addresses` |
| Valor anterior y nuevo | `localhost` -> `192.168.1.10` |
| Acción aplicada | Recarga o reinicio del servicio |
| Comprobación realizada | Conexión desde `psql` y consulta `\conninfo` |
| Resultado | Correcto, pendiente o incidencia detectada |

Esta documentación debe conservarse junto con las copias de seguridad de los archivos modificados y los registros relevantes de la comprobación.
