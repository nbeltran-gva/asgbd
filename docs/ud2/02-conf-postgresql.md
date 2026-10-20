# 2. Archivo de configuración `postgresql.conf`

Este archivo es el principal archivo de configuración de PostgreSQL. En él se definen numerosos parámetros que controlan el funcionamiento del servidor, como el **puerto de escucha, las direcciones de red, el número máximo de conexiones, la memoria y la seguridad**.

Cuando PostgreSQL se inicia, lee este archivo y aplica los valores configurados.

## Parámetros

Algunos de los parámetros más relevantes relacionados con las **conexiones y la seguridad** son:

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

El parámetro `listen_addresses` determina en qué interfaces de red PostgreSQL acepta conexiones, por lo que debe configurarse si se accederá al servidor desde otros equipos de la red.

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

Para que PostgreSQL escuche únicamente en una interfaz concreta, indica la dirección IP asignada a esa interfaz. Por ejemplo, si la IP del servidor en la red local es `192.168.1.10`:

```text
listen_addresses = '192.168.1.10'
```

También se pueden especificar varias direcciones separadas por comas:

```text
listen_addresses = 'localhost,192.168.1.10'
```

!!! warning "Importante"

    Configurar `listen_addresses` no es suficiente para permitir conexiones remotas. También es necesario establecer correctamente las reglas de acceso en `pg_hba.conf` y, cuando corresponda, configurar el cortafuegos o las reglas de red.

**Ejemplo para conexiones desde el propio servidor**

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

**Ejemplo para conexiones remotas**

Si se necesitan **conexiones desde otros equipos de la red**, `listen_addresses` deberá configurarse para escuchar en la interfaz de red correspondiente. En ese caso, el acceso deberá restringirse mediante **`pg_hba.conf`** y las reglas del **cortafuegos**, evitando exponer PostgreSQL innecesariamente.

Por ejemplo, si el servidor tiene la IP `192.168.1.10` y solo deben conectarse equipos de la red `192.168.1.0/24`, se puede configurar `postgresql.conf` así:

```text
listen_addresses = 'localhost,192.168.1.10'
```

Y añadir en `pg_hba.conf` una regla que permita la autenticación de esos equipos:

```text
host    all    all    192.168.1.0/24    scram-sha-256
```

El cortafuegos también debe permitir conexiones al puerto `5432` únicamente desde esa red. Así, PostgreSQL escucha en la interfaz indicada y solo autoriza conexiones de clientes dentro del rango especificado.

## Diagnóstico rápido de problemas

| Error o síntoma | Revisar | Solución |
|-----------------|----------|----------|
| Los cambios realizados en `postgresql.conf` no tienen efecto. | Que se está editando el archivo correcto. | Comprobar la ruta activa con `SHOW config_file;` y editar ese archivo. |
| Un parámetro modificado parece ignorarse. | Que la línea no esté comentada con `#` y que la sintaxis sea correcta. | Utilizar el formato `nombre = valor` y respetar las comillas cuando sean necesarias. |
| PostgreSQL no arranca después de modificar la configuración. | Errores de sintaxis o valores inválidos en `postgresql.conf`. | Revisar los registros del servicio y corregir el parámetro indicado. |
| No es posible conectar desde otros equipos. | Valor de `listen_addresses`. | Configurar la dirección adecuada o utilizar `listen_addresses = '*'` cuando sea necesario. |
| Las conexiones remotas siguen siendo rechazadas. | Configuración de `pg_hba.conf`, cortafuegos y conectividad de red. | Crear una regla válida en `pg_hba.conf` y comprobar la red. |
| PostgreSQL no inicia tras configurar una dirección IP concreta en `listen_addresses`. | Que la dirección IP pertenezca realmente al servidor. | Utilizar una dirección IP válida o corregir la configuración de red. |
| Un cambio en la configuración no se aplica tras ejecutar `reload`. | Si el parámetro admite recarga o requiere reinicio. | Reiniciar PostgreSQL cuando el parámetro lo requiera. |
| El servidor escucha en más redes de las necesarias. | Uso de `listen_addresses = '*'`. | Limitar el parámetro a las direcciones que realmente deban aceptar conexiones. |
| Los clientes no pueden conectarse al puerto configurado. | Valor del parámetro `port` y cortafuegos. | Verificar el puerto configurado y permitir el tráfico correspondiente. |
| PostgreSQL alcanza rápidamente el límite de conexiones. | Valor de `max_connections`. | Ajustar `max_connections` según la capacidad del servidor y la carga prevista. |
| Algunas consultas se cancelan automáticamente. | Valor de `statement_timeout`. | Revisar el tiempo configurado o optimizar las consultas. |
| Sesiones inactivas dentro de una transacción se cierran automáticamente. | Valor de `idle_in_transaction_session_timeout`. | Ajustar el tiempo de espera según las necesidades de la aplicación. |
| Tras modificar la configuración no se comprueba si los cambios han funcionado. | Estado del servicio y registros de PostgreSQL. | Verificar el servicio mediante `systemctl status postgresql` y revisar los logs ante cualquier error. |


## Buenas prácticas

- Haz una copia de seguridad de `postgresql.conf` antes de modificarlo.
- Cambia pocos parámetros cada vez y documenta los cambios para facilitar su revisión y reversión.
- Mantén los valores predeterminados cuando no haya una necesidad concreta de modificarlos.
- Limita `listen_addresses` a las interfaces necesarias; evita usar `'*'` si no es imprescindible.
- Para permitir conexiones remotas, configura también las reglas de acceso en `pg_hba.conf` y restringe el tráfico mediante el cortafuegos.
- Aplica los cambios con `reload` o `restart` según el parámetro y comprueba después el estado del servicio.
