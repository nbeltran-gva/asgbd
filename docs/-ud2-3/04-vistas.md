# 4. Vistas



## 1. Introducción

Una vista es una alternativa para mostrar datos de varias tablas. Una vista es como una tabla virtual
que almacena una consulta. Los datos accesibles a través de la vista no están almacenados en la
base de datos como un objeto.
Entonces, una vista almacena una consulta como un objeto para utilizarse posteriormente. Las
tablas consultadas en una vista se llaman tablas base. En general, se puede dar un nombre a
cualquier consulta y almacenarla como una vista.
Una vista suele llamarse también tabla virtual porque los resultados que retorna y la manera de
referenciarlos es la misma que para una tabla.

## 2. Creación de vistas

Para crear una vista se utiliza CREATE VIEW con la siguiente sintaxis:
CREATE [ OR REPLACE ] VIEW name [ ( column_name [, ...] ) ]
AS query
Por ejemplo, si queremos crear una vista con las poblaciones que están a más de 700 metros de
altura, seleccionando solamente las columnas: nom, comarca y altura. Escribiremos lo siguiente:
CREATE VIEW mas_de_700 AS SELECT nom, comarca, altura FROM poblacions WHERE
altura>700;
Para poder ver el resultado, realizaremos una consulta como si de una tabla se tratara:
SELECT * FROM mas_de_700;
Si estamos, en pgAdmin podemos ver la nueva vista en el esquema correspondiente.
Si estamos en psql, la vista se puede ver utilizando \dv. También se puede visualizar la definición
de la vista con \d nombre_vista.

## 3. Borrado de vistas

Para eliminar una vista podemos utilizar la orden DROP de la siguiente manera:
DROP VIEW view_name [,…] [CASCADE | RESTRICT]
Con la opción CASCADE se borran automáticamente los objetos dependientes de la vista, como
pueden ser otras vistas.
Con RESTRICT no se borra la vista si hay objetos que dependen de ella. Es la opción por defecto.




## 4. Vistas del sistema

PostgreSQL dispone de algunas vistas ya predefinidas. Algunas vistas del sistema permiten acceder
a las consultas más utilizadas en los catálogos del sistema. Otras proporcionan acceso al estado
interno del servidor.
Algunas de las principales vistas disponibles son las siguientes:
- pg_indexes: índices
- pg_rules: reglas
- pg_settings: parámetros
- pg_stats: estadísticas
- pg_tables: tablas
- pg_user: usuarios
- pg_group: grupos
- pg_roles: roles
- pg_shadow: contraseñas
- pg_views: vistas
Cualquiera de las vistas anteriores utiliza otras vistas también ya definidas.

## 5. Ventajas de las vistas

Las vistas nos ofrecen lo siguiente:
- Seguridad: las vistas pueden proporcionar un nivel adicional de seguridad. Por ejemplo, en
la tabla de empleados, cada jefe de departamento solo tendrá acceso a la información de sus
propios empleados.
- Simplicidad: las vistas permiten ocultar la complejidad de los datos. Una base de datos está
compuesta por muchas tablas. La información de dos o más tablas se puede recuperar
utilizando una combinación de varias tablas, y estas combinaciones pueden llegar a ser muy
confusas. Al crear una vista como resultado de la combinación, se puede ocultar esa
complejidad al usuario.
- Organización: las vistas ayudan a mantener nombres organizados en la base de datos para
acceder a consultas complejas.
- Precisión de los datos solicitados: permiten acceder a un subconjunto de datos específicos,
omitiendo información innecesaria e irrelevante para el usuario.



- Adaptación: proporcionan diversos modelos de información basados en los mismos datos,
adaptándolos a diferentes usuarios con necesidades específicas.
- Independencia en las modificaciones: el usuario final no se verá afectado por los cambios o
alteraciones que se realicen en el esquema conceptual de la base de datos. Si el sistema
requiere una modificación en su funcionamiento interno, varias estructuras que proveen ese
funcionamiento pueden verse afectadas, pero se espera que los usuarios finales no perciban
estas alteraciones.
6 Ejercicios
Adjunta las capturas de pantalla y explicaciones que veas necesarias.

### Ejercicio 2.11

Crea dos vistas en la base de datos geo, una de ellas deberá combinar dos tablas. Da permisos al
usuario usu1 para poder consultar estas vistas. Comprueba que usu1 puede consultar estas vistas
(hacer un SELECT) y que, por ejemplo, usu2 no.

### Ejercicio 2.12

Conéctate a la base de datos geo y muestra las vistas creadas en el esquema public, utilizando una
de las vistas predefinidas del sistema.
