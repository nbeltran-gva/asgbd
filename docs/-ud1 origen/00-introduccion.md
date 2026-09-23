# 0. Introducción


## 1. Introducción

Definido de forma rápida, PostgreSQL es un SGBD Relacional que incorpora conceptos de objetos.
Al ser un SGBD relacional, significa que soporta perfectamente la integridad referencial, las
restricciones, disparadores o triggers, transacciones, etc. Además ofrece soporte prácticamente total
al estandar SQL 92 / SQL 3.
Intenta ser muy flexible permitiendo tipos de datos nuevos creados por el usuario, operadores
nuevos, etc.
Y sobretodo, incorpora también conceptos de BD orientadas a objetos. No es un SGBD
completamente orientado a objetos, sino que incorpora algunos conceptos como la herencia y las
clases.
El origen de PostgreSQL fue un proyecto de la Universidad de Berkeley. El nombre de Postgres se
creó en 1986. En 1987 se lanzó la primera versión que fue mejorando hasta llegar a la versión 4. En
1994 se lanzó un “descendiente” de Postgres de dominio público y código abierto que e denominó
Postgre95. Este nombre no podía tener futuro y en 1996 se cambió a PostgreSQL. La primera
versión de PostgreSQL fue la 6.0 para continuar con la secuencia del proyecto original de la
Universidad.
En Linux, o mejor dicho, en el mundo del software libre, e utilizan principalmente dos SGBD:
PostgreSQL  y MySQL:
- PostgreSQL se puede definir como “más serio”, y, aunque no llega a ser tan rápido como
MySQL, puede ser perfectamente un SGBD para sitios o empresas realmente grandes y que
necesiten entornos seguros.
- En MySQL se intenta, por encima de todo, que sea muy rápido y que gaste pocos recursos.
Para conseguir esto incluso sacrifica (en algunos casos) cosas impensables como la
integridad referencial, transacciones, etc. MySQL se ha impuesto en la creación de páginas
web (junto con Apache, PHP y Perl) donde se busca sobretodo la velocidad.
Existen muchas comparativas en Internet de SGBDs, y normalmente, la conclusión no es que uno
sea mejor que otro, sino que depende de lo que se quiera hacer. ¿Qué necesitamos, velocidad o
potencia?
