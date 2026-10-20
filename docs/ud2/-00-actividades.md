# Actividades de Configuración

Realiza un documento con explicaciones y capturas que demuestre cada resultado. Trabaja sobre las máquinas virtuales creadas en la unidad anterior  y conserva copias de seguridad de los ficheros de configuración modificados.

## Actividad 1. Configuración de una conexión local

Conéctate al servidor PostgreSQL con `psql` utilizando el usuario `postgres` y comprueba la conexión mediante:

```text
\conninfo
\l
```

Explica qué información proporciona cada comando y documenta la base de datos y el usuario utilizados.

## Actividad 2. Configuración de conexiones remotas

Configura PostgreSQL para permitir que el usuario `postgres` se conecte desde el equipo cliente a una base de datos de prácticas.

1. Consulta los archivos `postgresql.conf` y `pg_hba.conf`.
2. Configura la dirección de escucha y el puerto necesarios.
3. Añade una regla específica para la IP del cliente.
4. Recarga o reinicia el servicio.
5. Comprueba la conexión desde `psql` y desde pgAdmin.
6. Explica por qué el orden de las reglas de `pg_hba.conf` es importante.

No utilices reglas más amplias de lo necesario si la actividad puede resolverse autorizando únicamente la red de prácticas.

## Actividad 3. Creación y configuración de una base de datos

Crea una base de datos llamada `geo` proporcionada por el profesor. Consulta sus características de codificación y configuración regional:

```sql
SHOW server_encoding;
SHOW lc_collate;
SHOW lc_ctype;
```

Importa los datos y comprueba que las tablas se han creado correctamente. Documenta la base de datos, la plantilla y las características por defecto utilizadas.

## Actividad 4. Configuración de herramientas cliente

Instala o utiliza `psql` y la versión web de pgAdmin. 

Desde Ubuntu Mate, accede al servidor y crea una conexión en pgAdmin.

Compara ambas herramientas y explica en qué situaciones utilizarías cada una. Comprueba que las dos permiten conectarse con el mismo usuario y consultar la base de datos `geo`.

## Actividad 5. Consultas y exportación de resultados

Averigua cuántas poblaciones se encuentran a más de 700 metros de altura. Guarda el resultado con `\copy` en un CSV separado por `;` y comprueba que el archivo se ha generado correctamente:

```text
\copy (SELECT * FROM comarques WHERE elevacio > 700) TO '/tmp/poblacions.csv' WITH CSV DELIMITER ';';
```

Documenta el comando y el resultado obtenido.

## Actividad 6. Parámetros y puesta en marcha

Desde el equipo cliente, establece una conexión con PostgreSQL y, mientras está activa, ejecuta desde el servidor:

```bash
/usr/lib/postgresql/16/bin/pg_ctl -D /var/lib/postgresql/16/main -m s stop
```

Explica qué ocurre, termina la ejecución del comando si es necesario y reinicia el SGBD. Comprueba después el estado del servicio, el puerto de escucha, la conexión desde el cliente y los mensajes del registro.

## Actividad 7. Documentación de la configuración

Elabora una ficha de configuración que incluya:

- fecha y responsable;
- archivos modificados;
- valores anteriores y nuevos;
- usuarios, bases de datos y redes autorizadas;
- comandos utilizados para aplicar los cambios;
- comprobaciones realizadas;
- incidencias y solución aplicada.


Actividad 6. Consulta y exportación de datos
Obtener información de las poblaciones con una elevación superior a 700 metros y entregar el resultado en un archivo CSV.

Tareas

Consultar los datos. Identifica la información de las poblaciones que supera los 700 metros de elevación.
Localiza la tabla que contiene las poblaciones y el campo que representa su elevación.
Prepara una consulta SQL que seleccione las poblaciones cuya elevación sea superior a 700 metros.
Calcula cuántas poblaciones cumplen esta condición.
Exportar los resultados. Guarda en un archivo CSV los registros obtenidos con la consulta.
Utiliza el punto y coma (;) como separador de campos.
Incluye los campos necesarios para identificar cada población y su elevación.
Comprobar el archivo. Verifica que el CSV contiene los resultados esperados.
Comprueba que los campos están separados por punto y coma.
Confirma que los registros corresponden a la consulta realizada.
Verifica que el número de registros coincide con el resultado obtenido en PostgreSQL.
Evidencias

Consulta SQL realizada
Resultado de la consula con el número de poblaciones que cumple la condición.
Archivo CSV generado.
Comprobación de la estructura y de algunos registros exportados.
Resultado esperado

Has obtenido el número de poblaciones con una elevación superior a 700 metros y has generado un archivo CSV con los registros correspondientes, utilizando el punto y coma como separador.

Entrega

Elabora un documento con los procedimientos realizados, los comandos utilizados, las explicaciones necesarias y las capturas de pantalla que demuestren los resultados.

