# 3. Cursores y excepciones



## 1. Cursores

Un cursor es una variable que nos permite desplazarnos por las filas de una consulta de SQL.
Existen dos tipos de cursores: los explícitos y los implícitos.
Los cursores explícitos deben declararse explícitamente en la sección de declaraciones. En cambio,
los cursores implícitos no necesitan declaración; son simplemente una sentencia SQL que almacena
el resultado en una variable. Los cursores implícitos llevan incorporada toda la mecánica de los
cursores (declaración, apertura, uso, cierre) que debemos realizar en los explícitos.
1.1 Cursores implícitos
Consistirán en una sentencia SQL dentro de un procedimiento o función PL/PGSQL con una
cláusula especial: INTO, que va después de las columnas y antes del FROM.
Deben devolver solo un valor, o mejor dicho, una fila. Se almacenan en una variable (o variables,
tantas como columnas tenga la sentencia SQL) que se colocarán después de la cláusula INTO. Por
ejemplo, este procedimiento anónimo obtendrá el número de empleados.
do $$
declare
n int;
begin
select count(*) into n from emp;
raise notice 'Hay % empleados.', n;
end $$;
Y este otro obtendrá el nombre y el trabajo (job) del empleado número 7900:
do $$
declare
nom varchar(10);
feina varchar(9);
begin
select ename, job into nom, feina from emp where empno = 7900;
raise notice 'Nombre: %', nom;
raise notice 'Trabajo: %', feina;
end $$;
1.2 Cursores explícitos
Estos cursores deben declararse. En la sección de instrucciones, primero debemos abrir (OPEN) el
cursor (cuando se realiza la consulta SQL y se almacena en una zona de memoria, y el cursor se
coloca en la primera fila). Luego, nos desplazamos fila por fila para realizar un tratamiento
específico (FETCH: recoge el valor y se coloca en la siguiente fila). Finalmente, debemos cerrar el
cursor (CLOSE).



DO $$
DECLARE
  nom VARCHAR(10);
  cur CURSOR FOR SELECT ename FROM EMP;
BEGIN
  OPEN cur;
  ....
  FETCH cur INTO nom;
  ....
  CLOSE cur;
  ....
END $$;
Lo habitual es recorrer todo el cursor. Por ejemplo, para obtener todos los nombres de los
empleados utilizando un cursor, podríamos hacerlo de la siguiente manera (sería un procedimiento
anónimo):
do $$
declare
nom varchar(10);
cur cursor for select ename from emp;
begin
open cur;
fetch cur into nom;
while found loop
raise notice '%', nom;
fetch cur into nom;
end loop;
close cur;
end $$;
Hay una variante de uso del cursor que podríamos decir que es una utilización implícita de un
cursor explícito. Aunque lo declaramos (por lo tanto, es un cursor explícito), no realizamos las
acciones de abrir, desplazar y cerrar el cursor. Estas acciones se realizan de forma implícita al
construir un bucle como el siguiente:
do $$
declare
cur cursor for select ename from emp order by ename;
begin
for f in cur LOOP
raise notice '%', f.ename;
end loop;
end $$;
Aquí, no es necesario declarar la variable f (que representa una fila), y la operación FETCH está
implícita en el bucle FOR. Tampoco es necesario abrir ni cerrar el cursor.
El uso del cursor, además de recorrerlo, se describe de la siguiente manera:



- FETCH cur INTO var1 [, var2, ...]  nos permite acceder a los diferentes
campos de las filas sucesivas del cursor y almacenar los valores en las variables var1 (y
var2, etc.) que deben declararse previamente del mismo tipo. Por ejemplo, en el penúltimo
ejemplo, el cursor está definido en base a una sentencia SQL que devuelve solo una columna
(ename) de tipo VARCHAR. Si devolviera dos columnas (por ejemplo, empno y ename), la
sentencia FETCH debería ser:
FETCH cur INTO num, nom
donde num y nom serían de tipo INTEGER y VARCHAR(10), respectivamente.
Si utilizamos el cursor de forma implícita, como en el bucle FOR:
FOR rec_cur IN cur LOOP
entonces, la forma de acceder a un campo (por ejemplo, ename) es simplemente:
rec_cur.ename
- Para poder acabar un bucle while podemos utilizar la variable global FOUND. Esta variable
es booleana y nos indica si FETCH ha encontrado una nueva fila.
Veamos un ejemplo adicional. Queremos obtener el nombre del empleado y el nombre del
departamento al que pertenecen. Si analizamos esto, el procedimiento anónimo es muy similar al
que se muestra arriba. Ahora también queremos obtener el nombre del departamento. Lo que
podemos hacer es simplemente complicar la sentencia SQL del cursor para que también obtenga el
nombre del departamento. Esta es una buena técnica: realizamos una consulta SQL más elaborada
para que la base de datos nos devuelva los datos, y así el procedimiento se vuelve más sencillo.
do $$
declare
cur cursor for select ename, dname
from emp, dept
where emp.deptno = dept.deptno
order by ename;
begin
for f in cur LOOP
raise notice '% -> %', f.ename, f.dname;
end loop;
end $$;
Vamos a ver un último ejemplo que está bastante elaborado.
En estadística, hay dos valores centrales en una serie de datos, es decir, números que "representan"
la serie de datos aproximadamente en el centro. De hecho, existe otro valor central, la moda, pero
no nos interesa.
1. Media: Se define como la suma de todos los valores dividida por el número de valores.



2. Mediana: Se define como el valor que se encuentra en el medio de todos los valores, el
valor central. Obviamente, solo tiene sentido si los valores están ordenados, ya que solo
estará aproximadamente en el centro. Pueden darse dos posibilidades:
- Si el número de elementos es impar, la mediana será el valor del medio, de la cual
solo hay uno (1, 2, 3, 4, 10).
- Si el número de elementos es par, como hay 2 valores centrales, tomamos la media
entre estos dos valores centrales (1, 2, 3, 4, 10, 20) → 3.5.
Ahora vamos a crear una función que calcule la MEDIANA de los salarios de los empleados.
CREATE OR REPLACE FUNCTION MEDIANA()
RETURNS REAL AS $$
DECLARE
    cur CURSOR FOR SELECT Sal FROM EMP ORDER BY Sal;
    aux REAL;
    aux1 REAL;
    i INTEGER;
    n INTEGER;
    n1 INTEGER;
BEGIN
    OPEN cur;
    SELECT COUNT(Sal) INTO n FROM EMP;
    IF MOD(n, 2) = 0
    THEN
        n1 := n;
    ELSE
        n1 := n + 1;
    END IF;
    FOR i IN 1..n1/2 LOOP
        FETCH cur INTO aux;
    END LOOP;
    IF MOD(n, 2) = 0
    THEN
        FETCH cur INTO aux1;
        aux := (aux + aux1) / 2;
    END IF;
    RETURN(aux);
END; $$ language plpgsql;
Puedes verificar el resultado de la siguiente manera:
SELECT MEDIANA();
Dado que hay 14 empleados, la mediana es el promedio entre el salario del empleado 7 y el del
empleado 8 (si los ordenas, verás que los salarios son 1500 y 1600).



En resumen, lo que hace esta función es:
- El cursor  cur contiene los salarios ordenados (lo cual es esencial, como se mencionó
anteriormente).
- Obtenemos el número total de empleados (a través del cursor implícito) y lo almacenamos
en n.
- En n1, guardamos el valor de n si es par o n + 1 si es impar. De esta manera, n1 será
siempre par.
- Recorremos el cursor n1 / 2 veces, lo que nos coloca en el registro que está en el medio.
- Si el número de empleados era impar, ya tenemos la mediana en aux.
- Si el número de empleados era par, la mediana es el promedio entre aux y el siguiente valor.
Almacenamos el siguiente valor en aux1 y calculamos el promedio entre aux y aux1.

## 2. Excepciones

El tratamiento de excepciones consiste en prever posibles errores en un programa y proporcionar
una solución para que el programa no se interrumpa cuando ocurra un error. Por ejemplo,
podríamos tener problemas al dividir por cero o al intentar insertar una fila en una tabla con una
clave primaria duplicada, entre otros. Si no manejamos los errores, el programa siempre se
interrumpirá.
Por ejemplo, en el siguiente procedimiento anónimo se produce un error de división por cero:
DO $$
DECLARE
R REAL;
BEGIN
RAISE NOTICE 'Antes del error...';
R := 5 / 0;
RAISE NOTICE 'Después del error...';
END $$;
Salida:
NOTICE:  Antes del error...
ERROR:  división por cero
CONTEXT:  asignación PL/pgSQL «R := 5 / 0»
función PL/pgSQL inline_code_block en la línea 6 en asignación
SQL state: 22012
En el momento en que ocurre esta división, la ejecución del bloque finaliza.



La definición de excepciones se realiza en la sección EXCEPTION, después de las instrucciones
normales y antes de END, y tiene el siguiente formato:
...
EXCEPTION
    WHEN nombre_excepción THEN
        instrucciones;
    ...
   [WHEN OTHERS THEN (para manejar todas las excepciones no
definidas)
        instrucciones;]
END $$;
En nuestro caso, el error es una división por cero, por lo que si deseamos manejarlo, lo haremos de
la siguiente manera:
DO $$
DECLARE
R REAL;
BEGIN
RAISE NOTICE 'Antes del error...';
R := 5 / 0;
RAISE NOTICE 'Después del error...';
EXCEPTION
WHEN DIVISION_BY_ZERO THEN
RAISE NOTICE 'Error: intento de división por cero.';
END $$;
Salida:
NOTICE:  Antes del error...
NOTICE:  Error: intento de división por cero.
DO
El procedimiento PL/SQL se completó correctamente.
Como puedes ver, en lugar de finalizar abruptamente, el procedimiento finaliza con nuestro
mensaje. Incluso si no deseamos que la ejecución del programa finalice, podemos colocarlo en un
bloque y así finalizará solo ese bloque:
DO $$
DECLARE
R REAL;
BEGIN
RAISE NOTICE 'Antes del error...';
BEGIN
R := 5 / 0;
EXCEPTION
WHEN DIVISION_BY_ZERO THEN



RAISE NOTICE 'Error: intento de división por cero.';
END;
RAISE NOTICE 'Después del error...';
END $$;
Salida:
NOTICE:  Antes del error...
NOTICE:  Error: intento de división por cero.
NOTICE:  Después del error...
DO
A continuación, se presenta una tabla con algunos errores comunes:
Código de
Error Excepción Explicación
22012 DIVISION_BY_ZERO Ocurre cuando se intenta dividir un
número por cero.
22003 NUMERIC_VALUE_OUT_OF_RANGE
Se lanza cuando una operación
aritmética da como resultado un valor
que excede el rango permitido para el
tipo de dato numérico en uso.
P0002 NO_DATA_FOUND
Ocurre cuando se intenta recuperar
una fila utilizando una instrucción
SELECT INTO o FETCH y no se
encuentra ninguna fila que coincida
con los criterios.
P0003 TOO_MANY_ROWS
Ocurre cuando una instrucción
SELECT INTO devuelve más de una
fila. En PL/pgSQL, SELECT INTO
espera que la consulta retorne una
única fila, y si no es así, se lanza una
excepción.
24000 INVALID_CURSOR_STATE
Se lanza cuando se intenta manipular
un cursor que no está en un estado
válido, como intentar hacer FETCH
en un cursor que no ha sido abierto, o
intentar usar un cursor fuera de una
transacción.
22P02 INVALID_TEXT_REPRESENTATION Ocurre cuando se intenta convertir
una cadena en un tipo de dato no
compatible, como convertir una
cadena que no es numérica a un
número.



Por supuesto, hay muchos más:
https://www.postgresql.org/docs/current/errcodes-appendix.html
Veamos otro ejemplo. Supongamos que queremos obtener al empleado que gana más en cada
departamento.
Para no complicarnos demasiado, primero construimos un cursor con todos los departamentos que
recorreremos completamente.
Y para cada departamento (es decir, dentro del bucle), queremos encontrar al empleado que gana
más en ese departamento. En principio, parece que no debería haber problema.
Sin embargo, puede haber un problema por dos razones: primero, porque puede haber más de un
empleado que gane el máximo salario en el departamento (de hecho, esto ocurre en el departamento
20); y segundo, porque puede haber departamentos que no tienen ningún empleado, y en ese caso
no hay un máximo salario (de hecho, esto ocurre en el departamento 40).
Vamos a resolverlo con el manejo de excepciones y lo haremos en un solo bloque (con BEGIN y
EXCEPTION) dentro del bucle:
DO $$
DECLARE
SALARIO INT;
NOMBRE VARCHAR(10);
C CURSOR FOR SELECT * FROM DEPT;
BEGIN
  RAISE NOTICE 'DEPARTAMENTO NOMBRE SALARIO';
  RAISE NOTICE '----------- ---------- ----------';
  FOR FC IN C LOOP
BEGIN
SELECT ENAME, SAL INTO STRICT NOMBRE, SALARIO
FROM EMP
WHERE SAL = (SELECT MAX(SAL) FROM EMP WHERE DEPTNO =
FC.DEPTNO);
RAISE NOTICE '% % %', RPAD(FC.DNAME, 12), RPAD(NOMBRE,
11), SALARIO;
EXCEPTION
WHEN TOO_MANY_ROWS THEN
RAISE NOTICE 'Más de un salario máximo en %', FC.DNAME;
WHEN NO_DATA_FOUND THEN
RAISE NOTICE 'No hay empleados en %', FC.DNAME;
END;
  END LOOP;
END; $$
Esto mostrará los empleados con los salarios más altos en cada departamento. Si hay varios
empleados con el salario máximo en un departamento, mostrará un mensaje de error. Si un
departamento no tiene empleados, también mostrará un mensaje de error.
