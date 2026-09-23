# 1. PL/pgSQL y fundamentos del lenguaje



## 1. Introducción

El objetivo de este tema es practicar la programación, lo que, además de permitirnos hacer accesos
más potentes (al menos, diferentes a los que hemos hecho), nos permitirá automatizar tareas de
administración de PostgreSQL.
Utilizaremos el lenguaje procedimental que nos proporciona PostgreSQL: PL/PGSQL. Crearemos
procedimientos anónimos, procedimientos normales y funciones.
Más adelante, utilizaremos cursores, crearemos triggers (o disparadores) y utilizaremos también
excepciones. Los cursores son variables que nos permite desplazarnos por las filas de una consulta
de SQL.  Los triggers son procedimientos que se ejecutarán en respuesta a un evento en la Base de
Datos, ya sea antes o después de que este evento (una actualización) se produzca. Las excepciones
nos proporcionan tratamiento a posibles errores que se puedan producir en ejecución.

## 2. PL/pgSQL

PL/SQL nos permite construir procedimientos y funciones utilizando un lenguaje procedural.
Podremos definir variables, crear bucles, etc., pero también incorporar sentencias de SQL. Será
posible definir cursores, que son variables que nos permiten recoger línea por línea el resultado de
un SELECT.
Una aplicación muy importante será la creación de triggers, que son módulos de programa que se
activarán cuando se cumpla una condición específica que afecta a la Base de Datos, por ejemplo,
después de una inserción, modificación o eliminación en una tabla determinada.
Cualquier cosa que definamos en PL/SQL (procedimiento, función, trigger, etc.) tendrá la siguiente
estructura:
$$
[DECLARE declaración de variables]
BEGIN
Instrucciones
[EXCEPTION excepciones]
END;
$$
Todo estará organizado en bloques:
- Bloque de declaraciones de variables
- Bloque del cuerpo de la función o procedimiento
- Bloque de excepciones (para el manejo de errores).
Todas las instrucciones deben terminar con un punto y coma.




## 3. Aspectos básicos del lenguaje

En esta sección veremos un poco por encima las principales sentencias. Aún no podremos probar
ningún programa, ya que en PL/SQL todas las sentencias deben formar parte de una función o
procedimiento (aunque sea anónimo). Esto es lo que veremos en la siguiente sección.

### 3.1. Declaración de variables

Una variable es un nombre simbólico en el que podemos guardar un valor que puede variar. Son
similares a las variables matemáticas y pueden ser de diferentes tipos. Así, una variable numérica
puede tomar diferentes valores numéricos, y una variable de tipo fecha puede tomar diferentes
fechas válidas.
Las variables se deben declarar en el bloque DECLARE, y algunso de los tipos válidos son:
- boolean o bool: cuyos valores válidos son true y false.
- char(n): define una cadena de longitud fija determinada por el argumento n. Las cadenas se
asignan con comillas simples, ‘cadena de texto’.
- varchar(n): define una cadena de caracteres de longitud variable en la cual determinamos el
máximo de caracteres con el argumento n que va entre paréntesis.
- int: entero de 4 bytes.
- float(n): número de coma flotante, siendo n el número de bytes. n=8 es el máximo.
- real: float(8).
- numeric(p, s): número real con p dígitos y s dígitos después de la coma.
- date: almacena fecha.
- time: almacena tiempo.
- timestamp: almacena fecha y tiempo.
Para más información:
https://www.postgresql.org/docs/current/datatype.html
Opcionalmente, se puede asignar un valor inicial a la variable. Por ejemplo, declaramos la variable
v1 de tipo VARCHAR (de texto) y v2 de tipo numérico (con 5 dígitos) con el valor inicial 0.
DECLARE
v1 VARCHAR(10);
v2 NUMBERIC(5) := 0;

### 3.2. Operadores

Los operadores nos permitirán realizar operaciones con las variables y constantes (valores que
introducimos directamente).
Pueden ser de diferentes tipos:



- Operadores de comparación: =, <> (!=), <, >, <=, >=, IS NULL.
- Operadores aritméticos: +, -, *, /, ** (exponenciación).
- Operadores  lógicos  (permiten  combinar  diferentes  expresiones  lógicas  con  valores
verdaderos o falsos): AND, OR y NOT.
- Concatenación (unión de cadenas de texto): ||.
Para más información:
https://www.postgresql.org/docs/current/functions.html

### 3.3. Instrucciones

Asignación de un valor a una variable
- Directamente con el operador :=
a := 10;
b := a * 0.5;
- Asignar el resultado de una subconsulta (un solo valor) con INTO:
SELECT Max(sal) INTO a FROM EMP;
Llamada a un procedimiento
Simplemente escribir su nombre y, en todo caso, los parámetros entre paréntesis.
call nombre_procedimiento(parámetros);
Llamada a una función
Se puede ejecutar con la sentencia select:
select nombre_función(parámetros);
O desde otra función para asignar un valor:
a := nombre_función(parámetros);
Salida por pantalla
Para imprimir mensajes por pantalla se utiliza RAISE NOTICE de la siguiente manera:
raise notice ‘cadena de texto’;




### 3.4. Estructuras de control

Condicional
Si se cumple la condición, se ejecutarán las sentencias que van después de THEN; si no se cumple
la condición, se ejecutarán las del ELSE (si existe).
IF condición
THEN
    Sentencias;
[ELSE
    Sentencias;]
END IF;
También se puede utilizar ELSIF, que equivale a un ELSE seguido de IF. De esta manera, solo
habrá un END IF al final. Se asemeja más al CASE. Quedaría así:
IF condición1
THEN
    Sentencias1;
ELSIF condición2
THEN
    Sentencias2;
ELSIF condición3
THEN
    Sentencias3;
END IF;
Por ejemplo, el siguiente fragmento calcularía el mayor de dos números y luego lo mostraría en la
salida estándar.
…
a := 10;
b := 15;
IF a >= b
THEN
max := a;
ELSE
max := b;
END IF;
RAISE NOTICE ‘El mayor es %', max;
Bucles
Un bucle es la repetición de una serie de sentencias un número determinado de veces.



Se logra a través de LOOP ... END LOOP.
Bucle FOR
Se repite un número determinado de veces. Hay una variable que actúa como contador, tomando un
valor que va desde un valor inicial y que aumenta en cada repetición del bucle, hasta que alcanza el
valor final, momento en el que finaliza el bucle.
Tenemos la posibilidad de que, en lugar de aumentar, disminuya, con la opción REVERSE (pero
tendremos que invertir los valores). La variable contador de un bucle FOR no necesita ser declarada
en la zona de declaraciones (DECLARE).
FOR variable IN valor_mín .. valor_máx LOOP
    Sentencias
END LOOP;
FOR variable IN REVERSE valor_max .. valor_min LOOP
    Sentencias
END LOOP;
Por ejemplo, este fragmento mostraría los números del 1 al 10 en la salida estándar. La variable
contador es v. Inicialmente toma el valor 1 y se incrementa en cada pasada del bucle, hasta que llega
al valor 10 y el bucle finaliza.
...
FOR v IN 1 .. 10 LOOP
RAISE NOTICE '%', v;
END LOOP;
...
Bucle WHILE
Se repite mientras la condición sea verdadera. Por lo tanto, en la condición debemos poner algo que
pueda cambiar, y cuando la condición ya no sea verdadera, el bucle terminará.
WHILE condición LOOP
    Sentencias
END LOOP;
Por ejemplo, este fragmento haría lo mismo que en el ejemplo anterior, mostrando los números del
1 al 10 en la salida estándar. Ahora, la variable v recibe el valor inicial 1, y en la condición del bucle
nos preguntamos si esta variable es menor o igual que 10 (inicialmente está claro que sí). Dentro del
bucle, además de mostrar en la salida estándar, incrementamos en una unidad el valor de la variable.
Después de alcanzar el valor 10, se convierte en 11, momento en el que la condición ya no se
cumple.
...
v := 1;
WHILE v <= 10 LOOP
