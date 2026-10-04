# Soluciones de las prácticas de configuración

Estas soluciones son orientativas. Las direcciones IP, las versiones, los nombres de usuario y las rutas deben adaptarse al entorno de prácticas. No se deben publicar contraseñas ni utilizar el superusuario para las tareas habituales.

## Actividad 1. Configuración de una conexión local

Desde el servidor se inicia una sesión local con PostgreSQL:

```bash
sudo -u postgres psql
```

Dentro de `psql` se ejecutan:

```text
\conninfo
\l
```

`\conninfo` muestra el usuario, la base de datos, el servidor y el método de conexión utilizado. `\l` muestra las bases de datos disponibles y sus propietarios.

Una salida correcta debe indicar que la conexión se realiza contra el servidor local y que el usuario tiene permiso para consultar las bases de datos. Para finalizar la sesión:

```text
\q
```

### Comprobación alternativa

También se puede realizar la consulta directamente desde el terminal:

```bash
sudo -u postgres psql -c "SELECT current_user, current_database();"
```

El resultado debe mostrar el usuario utilizado y la base de datos activa.

## Actividad 2. Configuración de conexiones remotas

Se parte de este ejemplo de red:

| Elemento | Valor de ejemplo |
|---|---|
| Servidor PostgreSQL | `192.168.1.50` |
| Cliente | `192.168.1.60` |
| Red de prácticas | `192.168.1.0/24` |
| Puerto PostgreSQL | `5432` |
| Base de datos | `geo` |
| Usuario | `alumno` |

### 1. Localizar los archivos de configuración

La ruta exacta se consulta desde PostgreSQL:

```bash
sudo -u postgres psql -c "SHOW config_file;"
sudo -u postgres psql -c "SHOW hba_file;"
```

Antes de modificar los archivos se crea una copia:

```bash
sudo cp /ruta/postgresql.conf /ruta/postgresql.conf.bak
sudo cp /ruta/pg_hba.conf /ruta/pg_hba.conf.bak
```

Se deben sustituir las rutas del ejemplo por las que devuelvan las consultas anteriores.

### 2. Configurar `postgresql.conf`

Se edita el archivo con permisos de administración:

```bash
sudo nano /ruta/postgresql.conf
```

Se comprueban o ajustan estos parámetros:

```text
listen_addresses = '192.168.1.50'
port = 5432
```

También se puede utilizar `listen_addresses = '*'`, pero solo cuando las reglas de `pg_hba.conf` y el cortafuegos limiten correctamente los equipos autorizados.

### 3. Configurar `pg_hba.conf`

Se edita el archivo:

```bash
sudo nano /ruta/pg_hba.conf
```

Para autorizar únicamente al cliente `192.168.1.60` a acceder a `geo`, se añade una regla como esta:

```text
host    geo    alumno    192.168.1.60/32    scram-sha-256
```

Para autorizar toda la red de prácticas:

```text
host    geo    alumno    192.168.1.0/24    scram-sha-256
```

La primera regla que coincide es la que PostgreSQL aplica. Por eso, una regla amplia situada antes de una regla específica puede permitir o denegar conexiones de forma inesperada.

### 4. Aplicar la configuración

Se comprueba el estado y se recarga el servicio:

```bash
sudo systemctl status postgresql
sudo systemctl reload postgresql
```

Si la modificación no se aplica mediante una recarga, se reinicia el servicio:

```bash
sudo systemctl restart postgresql
sudo systemctl status postgresql
```

### 5. Probar desde el cliente

Desde el equipo cliente se prueba la conexión sin escribir la contraseña en el comando:

```bash
psql -h 192.168.1.50 -p 5432 -U alumno -d geo -W
```

Dentro de `psql`:

```text
\conninfo
SELECT current_user, current_database();
\q
```

Si falla, se comprueban el estado del servicio, el puerto, `listen_addresses`, la regla de `pg_hba.conf`, la contraseña y el cortafuegos.

## Actividad 3. Creación y configuración de una base de datos

Se crea una base de datos de prácticas con una codificación adecuada:

```sql
CREATE DATABASE geo
    WITH TEMPLATE template0
    ENCODING 'UTF8';
```

La creación debe realizarse desde una sesión con permisos suficientes, por ejemplo:

```bash
sudo -u postgres psql
```

Se consultan las características de la base de datos y del servidor:

```sql
\l geo
SHOW server_encoding;
SHOW lc_collate;
SHOW lc_ctype;
```

Si la base de datos ya existe, se utiliza la proporcionada por el profesor y no se vuelve a crear. Para importar un archivo SQL:

```bash
psql -h 192.168.1.50 -p 5432 -U alumno -d geo -W -f geo.sql
```

Después se comprueba que existen las tablas:

```bash
psql -h 192.168.1.50 -p 5432 -U alumno -d geo -W
```

Dentro de `psql`:

```text
\dt
\d nombre_de_la_tabla
```

La solución debe documentar la plantilla, la codificación y la configuración regional utilizadas. Estos valores deben decidirse antes de crear la base de datos, porque modificarlos posteriormente puede requerir una migración.

## Actividad 4. Configuración de herramientas cliente

Se comparan las herramientas de esta forma:

| Herramienta | Uso recomendado |
|---|---|
| `psql` | Consultas, comprobaciones rápidas, administración desde terminal y automatización mediante scripts. |
| pgAdmin de escritorio | Administración gráfica, exploración de objetos y ejecución de consultas. |
| pgAdmin web | Administración gráfica desde un navegador, especialmente útil en equipos donde no se instala un cliente de escritorio. |

En pgAdmin se registra el servidor con estos datos:

| Campo | Valor de ejemplo |
|---|---|
| Nombre | `PostgreSQL servidor` |
| Host | `192.168.1.50` |
| Puerto | `5432` |
| Base de datos de mantenimiento | `geo` o `postgres` |
| Usuario | `alumno` |
| Contraseña | Se introduce de forma segura en el formulario |

La comprobación consiste en conectarse desde pgAdmin, abrir la base de datos `geo` y ejecutar una consulta. Después se repite la prueba desde `psql`:

```bash
psql -h 192.168.1.50 -p 5432 -U alumno -d geo -W
```

Ambas herramientas deben acceder al mismo servidor con los permisos previstos. La instalación de la herramienta cliente y la configuración de las reglas del servidor son tareas distintas.

## Actividad 5. Consultas y exportación de resultados

Se inicia una sesión sobre la base de datos `geo`:

```bash
psql -h 192.168.1.50 -p 5432 -U alumno -d geo -W
```

Primero se comprueba el nombre real de la tabla y de la columna de altura:

```text
\dt
\d comarques
```

Si los nombres coinciden con los de la actividad, se ejecuta:

```sql
SELECT COUNT(*)
FROM comarques
WHERE elevacio > 700;
```

Para guardar las poblaciones en un CSV separado por punto y coma:

```text
\copy (SELECT * FROM comarques WHERE elevacio > 700) TO '/tmp/poblacions.csv' WITH CSV DELIMITER ';' HEADER;
```

Se comprueba que el archivo existe y que contiene datos:

```bash
ls -l /tmp/poblacions.csv
head /tmp/poblacions.csv
```

`\copy` escribe el archivo desde el equipo donde se ejecuta `psql`, mientras que `COPY` utiliza el sistema de archivos del servidor y requiere permisos adicionales. Esta diferencia debe aparecer en la explicación.

## Actividad 6. Parámetros y puesta en marcha

Se abre una conexión desde el cliente y, desde el servidor, se solicita una parada ordenada:

```bash
sudo -u postgres pg_ctl \
  -D /var/lib/postgresql/16/main \
  -m s stop
```

La opción `-m s` indica una parada inteligente: PostgreSQL espera a que finalicen las sesiones activas. Por tanto, la conexión del cliente puede permanecer abierta hasta que termine la actividad o puede quedar esperando.

Se comprueba el estado y se inicia de nuevo el servicio:

```bash
sudo systemctl status postgresql
sudo systemctl start postgresql
sudo systemctl status postgresql
```

Después se comprueba el puerto y la conexión:

```bash
sudo ss -ltnp | grep 5432
pg_isready -h 192.168.1.50 -p 5432
psql -h 192.168.1.50 -p 5432 -U alumno -d geo -W
```

Si el comando queda esperando por conexiones activas, no se debe forzar la parada sin valorar sus consecuencias. En una práctica controlada, la parada forzada se documentaría expresamente y se utilizaría solo con autorización:

```bash
sudo -u postgres pg_ctl \
  -D /var/lib/postgresql/16/main \
  -m f stop
```

Finalmente se revisan los registros:

```bash
sudo journalctl -u postgresql --no-pager -n 50
sudo tail -n 50 /var/log/postgresql/postgresql-*.log
```

## Actividad 7. Documentación de la configuración

La ficha final puede utilizar esta plantilla:

| Campo | Ejemplo de solución |
|---|---|
| Fecha y responsable | Fecha de la práctica y nombre del alumno o alumna |
| Necesidad | Permitir conexiones desde el cliente de prácticas |
| Servidor | `192.168.1.50` |
| Cliente o red autorizada | `192.168.1.60/32` o `192.168.1.0/24` |
| Base de datos | `geo` |
| Usuario | `alumno` |
| Archivo modificado | `postgresql.conf` o `pg_hba.conf` |
| Cambio realizado | Dirección de escucha o regla de autenticación |
| Valor anterior y nuevo | Valores obtenidos y valores aplicados |
| Acción aplicada | `systemctl reload` o `systemctl restart` |
| Pruebas | `pg_isready`, `\conninfo`, consulta SQL y exportación CSV |
| Resultado | Correcto o incidencia detectada |
| Copia de seguridad | Nombre de los archivos `.bak` conservados |

La configuración se considera correctamente documentada cuando otra persona puede conocer qué se modificó, por qué se modificó, cómo se aplicó y cómo se comprobó.

## Conclusión

Las prácticas están resueltas cuando se ha configurado el acceso previsto, se han definido las características de la base de datos, se han probado las herramientas cliente, se ha comprobado el funcionamiento del servicio y se han documentado tanto los cambios como las incidencias.
