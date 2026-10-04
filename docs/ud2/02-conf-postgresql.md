# 3. Archivo de configuración `postgresql.conf`

Este archivo es el principal archivo de configuración de PostgreSQL. En él se definen numerosos parámetros que controlan el funcionamiento del servidor, como el **puerto de escucha, las direcciones de red, el número máximo de conexiones, la memoria y la seguridad**.

Cuando PostgreSQL se inicia, lee este archivo y aplica los valores configurados.

## Parámetros

Algunos de los parámetros más relevantes relacionados con las conexiones y la seguridad son:

| Parámetro | Función |
|---|---|
| `hba_file` | Indica la ruta del archivo `pg_hba.conf`, donde se definen las reglas de acceso y autenticación. |
| `listen_addresses` | Indica las direcciones de red en las que PostgreSQL acepta conexiones. |
| `port` | Define el puerto de escucha. Por defecto es `5432`. |
| `max_connections` | Establece el número máximo de conexiones simultáneas. |
| `authentication_timeout` | Define el tiempo máximo permitido para completar la autenticación. |
| `ssl` | Habilita o deshabilita las conexiones mediante SSL/TLS. |
| `password_encryption` | Define el formato utilizado para almacenar las contraseñas cuando se establecen o cambian. |

Los parámetros precedidos por `#` están **comentados** y, por tanto, no se aplican directamente. En estos casos, PostgreSQL utiliza el valor predeterminado del parámetro, salvo que este se haya establecido por otro medio de configuración.

## Configurar `listen_addresses`

`listen_addresses` es especialmente importante cuando se necesitan **conexiones desde otros equipos de la red**.

Algunos valores habituales son:

- `localhost`: PostgreSQL acepta conexiones únicamente a través de la interfaz local.
- `*`: PostgreSQL escucha en todas las interfaces de red disponibles.
- Una o varias direcciones IP concretas: permite limitar las interfaces en las que PostgreSQL aceptará conexiones.

Por ejemplo:

```text
listen_addresses = 'localhost'
```

o:

```text
listen_addresses = '*'
```

> **Importante:** Configurar `listen_addresses` no es suficiente para permitir conexiones remotas. También es necesario establecer correctamente las reglas de acceso en `pg_hba.conf` y, cuando corresponda, configurar el cortafuegos o las reglas de red.

#### Ejemplo de configuración segura

Si PostgreSQL solo necesita aceptar conexiones desde el propio servidor, una configuración básica y segura sería:

```text
listen_addresses = 'localhost'
port = 5432
ssl = on
```

Con esta configuración:

- `listen_addresses = 'localhost'` limita las conexiones a las realizadas desde el propio servidor.
- `port = 5432` mantiene el puerto predeterminado de PostgreSQL.
- `ssl = on` habilita las conexiones cifradas mediante SSL/TLS.

Si se necesitan **conexiones desde otros equipos de la red**, `listen_addresses` deberá configurarse para escuchar en la interfaz de red correspondiente. En ese caso, el acceso deberá restringirse mediante **`pg_hba.conf`** y las reglas del **cortafuegos**, evitando exponer PostgreSQL innecesariamente.

> **Importante:** Una configuración segura no depende únicamente de `postgresql.conf`. La seguridad de las conexiones debe configurarse conjuntamente mediante `postgresql.conf`, `pg_hba.conf` y, cuando corresponda, el cortafuegos.

## Aplicación de los cambios

Después de modificar `postgresql.conf`, los cambios deben aplicarse mediante una **recarga (`reload`) o un reinicio (`restart`)**, dependiendo del parámetro modificado.

- **`reload`**: suficiente para los parámetros que PostgreSQL permite aplicar sin reiniciar.
- **`restart`**: necesario para los parámetros que requieren reiniciar el servidor.

```bash
sudo systemctl reload postgresql
sudo systemctl restart postgresql
```

La comprobación del servicio y la aplicación de cambios se han explicado en el apartado anterior.
