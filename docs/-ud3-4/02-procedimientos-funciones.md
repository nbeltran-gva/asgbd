# 2. Procedimientos y funciones

RAISE NOTICE '%', v;
    v := v + 1;
END LOOP;
...

## 4. Funciones y procedimientos

Un procedimiento o una función es un conjunto de sentencias diseñadas para lograr un objetivo. Se
les asigna un nombre y se pueden llamar desde otro lugar. La diferencia entre ellos radica en que
cuando se ejecuta un procedimiento, solo se ejecutan las sentencias contenidas en él. En cambio, en
una función, además de ejecutar las sentencias, también devuelve un valor. Esto es válido en
cualquier lenguaje de programación. PL/PGSQL también incluye procedimientos anónimos.

### 4.1. Procedimientos anónimos

La primera cuestión es que se pueden declarar procedimientos anónimos, que se ejecutan una sola
vez (como las sentencias SQL que no guardamos). No se les asigna un nombre ni nada,
simplemente se definen y se ejecutan. La estructura, como la de cualquier procedimiento o función,
es la que se vio en la sección 2.
Por ejemplo (en psql), el siguiente procedimiento anónimo muestra en la salida estándar la fecha de
hoy, la fecha dentro de una semana y la fecha dentro de 4 semanas (primero se guarda en la variable
"a" la fecha de hoy, utilizando la función current_date). Suponiendo que estamos en la base de datos
scott:
scott=# do $$
scott$# declare
scott$# a date;
scott$# begin
scott$# a:= current_date;
scott$# raise notice ‘%’, a;
scott$# raise notice ‘%’, a+7;
scott$# raise notice ‘%’, a+28;
scott$# end $$;
NOTICE:  2024-10-11
NOTICE:  2024-10-18
NOTICE:  2024-11-08
DO
Para tener más clara la construcción del procedimiento anónimo. A continuación se muestra sin el
prompt de psql:
do $$
declare
a date;
begin
a := current_date;



raise notice '%', a;
raise notice '%', a+7;
raise notice '%', a+28;
end $$;
Este procedimiento se puede volver a ejecutar (\g) e incluso guardar en un archivo (\w fichero) y
luego ejecutarlo desde el archivo (\i fichero). También podemos editarlo (\e). Sin embargo, no se
puede llamar desde otro lugar, ya que ni siquiera tiene nombre. Si deseas hacer esto último, debes
declararlo como un procedimiento o función.
Una vez guardado, otra manera de ejecutarlo sería utilizando el comando psql desde la línea de
comandos, por ejemplo, si el procedimiento anónimo estuviera almacenado en el fichero
ej_current_date.sql:
psql -U postgres -h 10.0.2.200 -f ej_current_date.sql
Si queremos editarlo de una manera más cómoda, podemos utilizar la herramienta de consulta
(query tool) de pgAdmin.  La ejecución del procedimiento anónimo anterior en pgAdmin es la
siguiente:



Podemos teclear el procedimiento anónimo y utilizar el botón execute script o la tecla F5 para
ejecutarlo. La salida nos aparece en la pestaña Messages. También tenemos la posibilidad de
guardar el fichero para poder utilizarlo en otra ocasión.
Si por alguna razón cometemos un error de programación, la ejecución nos avisa de que hemos
cometido un error:
Enlazando con la sección anterior, un procedimiento anónimo utilizando un bucle for sería el
siguiente:
DO $$
BEGIN
FOR v IN 1 .. 10 LOOP
RAISE NOTICE '%', v;
END LOOP;
END $$;

### 4.2. Procedimientos

La sintaxis de definición es la siguiente:
CREATE [OR REPLACE] PROCEDURE nombre_procedimiento
[(lista_parámetros)]



AS $$
DECLARE
declaración de variables
BEGIN
instrucciones
END;
$$ LANGUAGE plpgsql;
Así, por ejemplo, podremos definir esto de obtener las tres fechas como un procedimiento que
aceptará la fecha inicial como parámetro:
create or replace procedure Tres_Fechas (fecha_inicial date)
as $$
begin
raise notice '%', fecha_inicial;
raise notice '%', fecha_inicial + 7;
raise notice '%', fecha_inicial + 28;
end;
$$ language plpgsql;
Al ejecutar lo anterior el procedimiento se guarda en la base de datos. Podemos ejecutarlo con el
comando CALL desde la consola de psql:
call tres_fechas(current_date);
En el entorno de pgAdmin, cuando ejecutemos este código con query tool, el procedimiento nos
aparecerá en la sección Procedures del esquema public (después de refrescar):



Para ejecutarlo, podemos hacerlo desde la consola del propio pgAdmin (PSQL Tool):
Vamos a ver otro ejemplo. Crearemos un procedimiento que mostrará en la salida la tabla de
multiplicar del 7:
create or replace procedure tabla_multiplicar_7()
as
$$
declare
m int;
begin
m := 7;
for i in 1..10 loop
raise notice 'multiplicando % x % = %', m, i, m*i;
end loop;
end;
$$ language plpgsql;
Para ejecutarlo:
call tabla_multiplicar7();




### 4.3. Funciones

La forma de declarar funciones es muy similar, pero debemos recordar que una función devuelve un
valor:
CREATE [OR REPLACE] FUNCTION nombre_función ([lista_parámetros])
RETURNS tipo_del_valor_devuelto AS $$
DECLARE
  declaración de variables
BEGIN
  instrucciones
  RETURN expresión;
END;
$$ LANGUAGE plpgsql;
Por ejemplo, vamos a crear una función que convierte de euros a pesetas:
create or replace function a_pts(euros real)
returns int as
$$
begin
return round(euros * 166.);
end;
$$ language plpgsql;
Dado que la función devuelve un valor, podemos verlo, por ejemplo, de la siguiente manera:
SELECT A_PTS(6);
Otra ejemplo, donde mostramos los salarios de los empleados en euros y en pesetas:
SELECT ENAME, SAL, A_PTS(SAL) FROM EMP;
Esta consulta la podemos incluir también en un procedimiento, por ejemplo:
create or replace procedure consulta()
as
$$
begin
SELECT ENAME, SAL, A_PTS(SAL) FROM EMP;
end;
$$ language plpgsql;
Desde una función o un procedimiento podemos también llamar a una función o a un
procedimiento. Por ejemplo:
create or replace procedure llamadas()
as
$$
declare
valor_en_euros int;



valor_en_pesetas int;
begin
valor_en_euros := 6;
valor_en_pesetas := a_pts(valor_en_euros);
raise notice 'El valor en pesetas es: %', valor_en_pesetas;
call tabla_multiplicar_7();
end;
$$ language plpgsql;
Si creamos una función en pgAdmin, la función nos aparecerá en el apartado Functions del esquema
public (después de refrescar).
Existen también funciones predefinadas en el sistema. Para más información:
https://www.postgresql.org/docs/current/functions.html
