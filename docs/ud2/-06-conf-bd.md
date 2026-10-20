# 6. Configuración base de datos

## Características por defecto de las bases de datos

Al crear una base de datos conviene revisar sus características por defecto, como la plantilla utilizada, la codificación y la configuración regional. Estas propiedades afectan a la forma de almacenar y comparar los datos.

Se pueden consultar algunos valores del servidor con:

```sql
SHOW server_encoding;
SHOW lc_collate;
SHOW lc_ctype;
```

Para una base de datos de prácticas se puede especificar una codificación adecuada desde su creación:

```sql
CREATE DATABASE practicas
	WITH TEMPLATE template0
	ENCODING 'UTF8';
```

La codificación y la configuración regional deben decidirse antes de crear la base de datos, porque cambiarlas posteriormente puede requerir migrar la información.

## Parámetros de las conexiones

Los siguientes son parámetros del **servidor** y se configuran habitualmente en `postgresql.conf`. Puedes comprobar la ruta del archivo activo con `SHOW config_file;`. Los cambios en `max_connections` requieren reiniciar PostgreSQL; los demás pueden aplicarse recargando la configuración.

| Parámetro | Función | Configuración |
|---|---|---|
| `max_connections` | Define el número máximo de conexiones simultáneas al servidor. | `postgresql.conf`; requiere reiniciar el servidor. |
| `authentication_timeout` | Establece el tiempo máximo permitido para completar la autenticación. | `postgresql.conf`; se aplica al recargar la configuración. |
| `statement_timeout` | Limita el tiempo de ejecución de una sentencia. El valor `0` significa sin límite. | `postgresql.conf`; también puede definirse por base de datos, rol o sesión. |
| `idle_in_transaction_session_timeout` | Cierra una sesión que permanece inactiva dentro de una transacción durante demasiado tiempo. | `postgresql.conf`; también puede definirse por base de datos, rol o sesión. |

`statement_timeout` y `idle_in_transaction_session_timeout` también pueden configurarse con comandos SQL como `ALTER ROLE` o `ALTER DATABASE`; así se aplican a las sesiones del rol o la base de datos elegidos, en lugar de establecer un valor general para el servidor.

En cambio, `connect_timeout` es una opción del **cliente** `psql` (libpq), no un parámetro de `postgresql.conf`. Limita cuánto espera el cliente para establecer la conexión:


```bash
psql "host=192.168.1.50 port=5432 dbname=practicas user=alumno connect_timeout=5"
```

Los valores deben adaptarse a la carga de trabajo. Un número excesivo de conexiones puede agotar la memoria del servidor y unos tiempos demasiado bajos pueden interrumpir operaciones legítimas.
