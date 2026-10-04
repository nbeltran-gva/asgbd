# 1. Introducción

Tras la instalación del servidor PostgreSQL y la configuración de los clientes de acceso, el siguiente paso es configurar el servicio para adaptarlo a las necesidades del entorno.

La configuración permite controlar aspectos como las conexiones locales y remotas, los mecanismos de autenticación, los recursos utilizados por el servidor y otros parámetros relacionados con la seguridad y el funcionamiento del sistema. 

Una vez realizados los cambios, será necesario comprobar que el servicio sigue funcionando correctamente y que los clientes pueden conectarse sin problemas.

# 2. Archivos de configuración de PostgreSQL

Una vez instalado el servidor PostgreSQL, es necesario conocer dónde se almacena su configuración y qué archivos intervienen en su funcionamiento. La mayoría de los cambios relacionados con las conexiones, la autenticación y el comportamiento del servidor se realizan mediante archivos de configuración.

Antes de modificar cualquier parámetro, es recomendable localizar los archivos correspondientes y realizar una copia de seguridad.

## Principales archivos de configuración

PostgreSQL utiliza varios archivos para almacenar su configuración. Los más importantes son:

| Archivo | Función |
|----------|----------|
| `postgresql.conf` | Configuración general del servidor. |
| `pg_hba.conf` | Control de acceso y autenticación de clientes. |
| `pg_ident.conf` | Mapeo entre usuarios del sistema operativo y usuarios de PostgreSQL. |

En esta unidad nos centraremos principalmente en los archivos `postgresql.conf` y `pg_hba.conf`, ya que son los más utilizados en la administración diaria del servidor.

## Localización de los archivos

La ubicación puede variar según la distribución y el método de instalación.

En instalaciones realizadas mediante los repositorios oficiales de Ubuntu, los archivos suelen encontrarse en:

```text
/etc/postgresql/16/main/
 
Antes de modificar cualquier parámetro, es recomendable localizar los archivos correspondientes y realizar una copia de seguridad.


## Localizar los archivos desde PostgreSQL

No es necesario conocer la ubicación exacta del sistema de archivos. PostgreSQL permite consultar la ubicación de sus archivos de configuración mediante comandos SQL.

Para conocer el archivo principal de configuración:

SHOW config_file; --> Para conocer el archivo principal de configuración:
SHOW hba_file; --> Para localizar el archivo de autenticación:
SHOW ident_file; --> Para localizar el archivo de identificación:

## Realizar una copia de seguridad

Antes de modificar cualquier archivo de configuración es recomendable guardar una copia de seguridad.

sudo cp postgresql.conf postgresql.conf.bak

Aplicación de los cambios
Después de modificar un archivo de configuración, PostgreSQL debe volver a cargar la configuración para aplicar los cambios.
En algunos casos es suficiente realizar una recarga:

sudo systemctl reload postgresql

Si el cambio afecta a parámetros que requieren reiniciar el servicio:

sudo systemctl restart postgresql

Es recomendable comprobar posteriormente que el servicio continúa funcionando correctamente:

sudo systemctl status postgresql


## Buenas prácticas

Localizar y documentar la ubicación de los archivos de configuración.
Realizar una copia de seguridad antes de modificar cualquier parámetro.
Modificar un número reducido de parámetros cada vez.
Comprobar el resultado de los cambios antes de continuar.
Mantener un registro de las modificaciones realizadas.
Utilizar comentarios en los archivos para justificar configuraciones especiales.

!!! tip Antes de editar un archivo de configuración, consulta su ubicación mediante SHOW config_file; o SHOW hba_file;. Esto evita trabajar sobre archivos incorrectos y facilita la administración de distintas versiones de PostgreSQL.

# 3. El archivo `postgresql.conf`

`postgresql.conf` es el principal archivo de configuración de PostgreSQL. En él se definen numerosos parámetros que controlan el funcionamiento del servidor, como el puerto utilizado, las direcciones de escucha, el número máximo de conexiones o el uso de memoria.

Cuando PostgreSQL se inicia, lee este archivo y aplica los parámetros configurados. Algunas modificaciones pueden activarse mediante una recarga del servicio, mientras que otras requieren un reinicio completo.

## Localización del archivo

En sistemas Ubuntu, el archivo suele encontrarse en una ruta similar a:

```text
/etc/postgresql/<versión>/main/postgresql.conf


