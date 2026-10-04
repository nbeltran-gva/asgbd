# 6. Ejercicios

Ejercicios
Realiza un documento con explicaciones y capturas para demostrar que has realizado los ejercicios
correctamente. Los ejercicios se realizarán sobre máquinas virtuales que se encuentran en el Drive
de Aules.

### Ejercicio 1.1

Instala la última versión de PostgreSQL en una Ubuntu Server. Al tratarse de un servidor deberás
asignarle una ip estática (modifica el fichero de netplan).

### Ejercicio 1.2

Instala la última versión de pgAdmin en una Ubuntu Mate. Configura una conexión con el usuario
postgres al servidor que se encuentra en la Ubuntu Server. Para ello tendrás que modificar los
ficheros de configuración de PostgreSQL. Haz copias de seguridad de los ficheros que modifiques.

### Ejercicio 1.3

Importa la base de datos geo.
Después de instalar la última versión de pgAdmin también tendrás disponible el comando psql en la
Ubuntu Mate. Conéctate con psql desde la Ubuntu Mate con el usuario postgres y haz un SELECT
en una de las tablas de la base de datos geo.

### Ejercicio 1.4

Modifica el fichero  pg_hba.conf para permitir conectar con el usuario  postgres desde el equipo
cliente a cualquier base de datos.
Modifica el fichero pg_hba.conf para permitir conectar con el usuario geo desde cualquier IP de la
red local a la base de datos geo. Si tienes problemas con la contraseña del usuario geo, cambiala del
mismo modo que lo has hecho con postgres
Realiza las comprobaciones pertinentes.

### Ejercicio 1.5

Averigua cuántas poblacions están situadas a más de 700 metros de altura.
Desde  psql podemos utilizar el comando  \copy para guardar el resultado de una consulta en un
fichero. Aquí tienes dos ejemplos:
\copy (select * from comarques) TO /tmp/prueba.txt;
\copy (select * from comarques) TO /tmp/prueba.csv WITH CSV DELIMITER ';';
Guarda el resultado de la consulta anterior en un fichero y comprueba que el fichero se ha generado
de forma correcta.




### Ejercicio 1.6

Instala la versión web de pgAdmin en la Ubuntu Server. Accede desde la Ubuntu Mate con el
navegador. Crea también una conexión.
¿Necesitamos alguna entrada de tipo host en pg_hba.conf para poder conectarnos de esta manera?

### Ejercicio 1.7

Conéctate con psql desde una terminal de Ubuntu Mate. Desde el servidor ejecuta:
/usr/lib/postgresql/16/bin/pg_ctl -D /var/lib/postgresql/16/main -m s stop
¿Qué ocurre? Haz que termine la ejecución de este comando y reinicia el SGBD?
