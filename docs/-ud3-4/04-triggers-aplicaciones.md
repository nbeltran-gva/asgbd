# 4. Triggers y ejemplos de aplicación

Para que salten las excepciones tendremos que utilizar STRICT.

## 3. Triggers

Como hemos definido anteriormente, un TRIGGER o disparador es un procedimiento que se
dispara cuando se cumple una determinada condición, cuando se actualiza una o más filas de una
tabla específica. La forma de escribir el procedimiento es utilizando PL/SQL.
La sintaxis es la siguiente:
CREATE [OR REPLACE] TRIGGER nombre_del_trigger
(BEFORE | AFTER) (INSERT | DELETE | UPDATE) [OR (INSERT | DELETE |
UPDATE) ...]
ON nombre_de_la_tabla
(FOR EACH ROW | FOR EACH STATEMENT)
EXECUTE FUNCTION trigger_function();
CREATE [OR REPLACE] FUNCTION trigger_function()
   RETURNS TRIGGER
AS $$
BEGIN
   instrucciones;
   RETURN (NEW | NULL);
END;
$$ LANGUAGE PLPGSQL;
La opción "OR REPLACE" nos permite reemplazar el trigger sin necesidad de borrarlo si queremos
volver a crearlo.
"BEFORE" o "AFTER" indican cuándo se debe activar el trigger: antes de realizar la acción de
inserción, eliminación o actualización, o después.
"INSERT", "DELETE" o "UPDATE" indican qué acción de actualización de la tabla desencadena
(o puede desencadenar) el trigger.
Una actualización puede afectar a más de una fila. En ese caso, debemos plantearnos si el trigger se
debe activar para cada actualización de cada fila o solo una vez (antes o después de actualizar). Para
cada fila se puede especificar utilizando "FOR EACH ROW". Con "FOR EACH STATEMENT" se
activará antes o después de todas las actualizaciones.
Supongamos que queremos activar un disparador siempre antes de la inserción en la tabla T1, para
cada fila, en caso de que la inserción no sea correcta:
CREATE TRIGGER trigger1 BEFORE INSERT ON T1 FOR EACH ROW
EXECUTE FUNCTION trigger1_function();
Y ahora, si queremos activar otro después de borrar un conjunto de filas (por ejemplo, para
actualizar otra tabla):



CREATE TRIGGER trigger2 AFTER DELETE ON T1 FOR EACH STATEMENT
EXECUTE FUNCTION trigger2_function();
Si deseamos utilizar el nuevo valor de una columna que se va a insertar o modificar, por ejemplo,
para verificar si es correcto, podemos utilizar NEW, que representa toda la fila. Si queremos ver el
valor antiguo de una columna de una fila que se va a borrar o modificar, podemos utilizar OLD.
Veamos un ejemplo para evitar que a un empleado se le reduzca el salario. Solo tiene sentido
controlar esto cuando se modifica la columna SAL. No tiene sentido ni al insertar ni al borrar una
fila. Y es conveniente hacerlo antes de la actualización para evitarlo:
CREATE OR REPLACE FUNCTION fn_before_update_sal()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.sal < OLD.sal THEN
        RAISE EXCEPTION 'Le estamos reduciendo el salario';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE OR REPLACE TRIGGER TR_SUBE_SAL BEFORE UPDATE ON EMP
FOR EACH ROW
EXECUTE FUNCTION fn_before_update_sal();
Observemos  también  la  instrucción  que  permite  provocar  la  cancelación  o  aborto  de  la
modificación:
RAISE EXCEPTION 'Le estamos reduciendo el salario';
Vamos a crear otro trigger. Primero, modificamos la tabla DEPT, agregando un campo llamado
NUMEMP, donde queremos tener el número de empleados en el departamento. Está claro que esto
supondrá tener información redundante. Pero lo que podemos hacer es tener esta información
redundante controlada y actualizada permanentemente.
La sentencia de modificación de la tabla DEPT es la siguiente:
ALTER TABLE DEPT ADD NUMEMP INTEGER;
Y con el trigger lograremos tener la información siempre actualizada. Inmediatamente después de
realizar  cualquier  declaración  de  actualización  en  EMP,  podemos  recalcular  el  número  de
empleados en cada departamento.
CREATE OR REPLACE FUNCTION fn_trigger_cuenta_emp()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE DEPT
        SET NUMEMP = (SELECT COUNT(*)



FROM EMP
                          WHERE EMP.DEPTNO=DEPT.DEPTNO);
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;
CREATE OR REPLACE TRIGGER trigger_cuenta_emp AFTER INSERT OR
DELETE OR UPDATE ON EMP
EXECUTE FUNCTION fn_trigger_cuenta_emp();
Otro ejemplo. Vamos a crear un trigger para poder establecer una especie de campo autonumérico.
Lo haremos en la tabla DEPT, en la que los números de departamento parecen estar en incrementos
de 10. Por lo tanto, crearemos un trigger que cuando se inserte en esta tabla, tomará 10 unidades
más que el valor más alto. En este momento, el número más alto es 40. Entonces, sumará 10 y este
será el nuevo valor de DEPTNO. No importará si no insertamos un valor para este campo o si le
damos cualquier valor. Siempre tomará el próximo número en incrementos de 10 (50, luego 60,
70, ...).
CREATE OR REPLACE FUNCTION fn_trigger_dept_auto()
RETURNS TRIGGER AS $$
DECLARE
i int;
BEGIN
SELECT MAX(DEPTNO) INTO i FROM DEPT;
NEW.DEPTNO := i + 10;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE OR REPLACE TRIGGER trigger_dept_auto BEFORE INSERT ON DEPT
FOR EACH ROW
EXECUTE FUNCTION fn_trigger_dept_auto();

## 4. Más ejemplos de aplicación

Llenar una tabla
La creación de una tabla no presenta ningún problema. Con una simple sentencia SQL (DDL), la
tendremos creada. Pero llenarla de datos es diferente. Si deseamos crear una tabla de muestra con
datos de ejemplo que puedan generarse de manera conveniente, esta es una tarea sencilla mediante
un procedimiento.
Por ejemplo, si queremos crear la tabla T_MIL con solo un campo numérico, es decir, con la
siguiente estructura:
CREATE TABLE T_MIL (C1 INT);



Posteriormente, queremos llenar esta tabla de manera consecutiva con los números del 1 al 1000. El
procedimiento será tan sencillo como configurar un bucle que se repita 1000 veces, utilizando la
variable  contador  para  proporcionar  valores  a  las  diferentes  filas  en  un  INSERT.  Dado  la
simplicidad del procedimiento, lo crearemos de forma anónima:
DO $$
BEGIN
    FOR i IN 1..1000 LOOP
        INSERT INTO T_MIL VALUES(i);
    END LOOP;
END $$;
Puedes verificar que la tabla tiene 1000 filas realizando una consulta SELECT con COUNT para
ver el número de filas o revisando el contenido de la tabla.
Puedes modificar ligeramente el procedimiento anterior para crear una tabla con muchas más filas
(por ejemplo, un millón). En este caso, te recomiendo que utilices la función COUNT, ya que
consultar toda la tabla llevaría mucho tiempo.
Reorganización masiva de índices
Como veremos en un tema posterior, los índices son estructuras que permiten ordenar por un campo
específico o buscar un valor en ese campo. A medida que se insertan o eliminan filas, pueden
quedar desorganizados.
Una buena tarea de mantenimiento puede ser reorganizar los índices para que vuelvan a ser
óptimos. Organizar un índice no es un problema, pero aquí nos planteamos organizar todos los
índices de las tablas de un esquema.
Lo haremos a través de un procedimiento en el que declaramos un cursor que contiene los nombres
de las tablas del esquema. Luego, configuramos un bucle que recorre el cursor anterior, de modo
que en f.tablename tengamos consecutivamente el nombre de todas las tablas. Aprovechamos esto
para reorganizar los índices de las tablas. Esta operación es dinámica ya que el nombre de la tabla lo
tenemos en una variable, para que se ejecute, debemos utilizar EXECUTE.
CREATE OR REPLACE PROCEDURE reorg_index()
AS
$$
DECLARE
C CURSOR FOR SELECT tablename FROM pg_tables where schemaname
= 'public';
BEGIN
FOR f in C LOOP
EXECUTE 'REINDEX TABLE ' || f.tablename;
RAISE NOTICE 'Tabla %s reindexada', f.tablename;
END LOOP;
END;
$$ language plpgsql;



Luego, deberemos ejecutar este procedimiento.
Utilizando el mismo esquema de procedimiento, podríamos crear otros que actuaran sobre otros
objetos del esquema.
Creación de una tabla de incidencias sobre otra tabla
Podría ser interesante registrar todas las actualizaciones realizadas en una tabla, guardando la fecha
y hora en que se realizó la modificación e, incluso, el autor que la hizo. Lo mejor sería crear un
trigger que actúe después de modificar esta tabla.
Como ejemplo, nos basaremos en la tabla EMP de SCOTT. Primero, creamos la tabla que recogerá
las incidencias sobre EMP. La llamaremos EMP_LOG, y en un principio solo guardaremos la fecha
y el autor de la actualización. Por comodidad, no crearemos ninguna clave principal.
CREATE TABLE EMP_LOG
( dia_hora TIMESTAMP,
  autor VARCHAR(50) );
Luego, crearemos el trigger en la tabla EMP, de manera que después de realizar una inserción,
modificación o eliminación, se insertará una nueva fila en EMP_LOG.
CREATE OR REPLACE FUNCTION fn_tr_emp_log()
RETURNS TRIGGER AS $$
BEGIN
INSERT INTO EMP_LOG VALUES(current_timestamp, current_user);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE OR REPLACE TRIGGER trigger_dept_auto AFTER INSERT ON EMP
FOR EACH ROW
EXECUTE FUNCTION fn_tr_emp_log();
Una variante de lo anterior sería guardar también la operación que se ha realizado en la tabla:
inserción, modificación o eliminación. Incluso se podría incluir el nuevo valor o el valor anterior,
etc.
Hay que tener en cuenta que, por defecto, no tenemos la timezone de ‘Europe/Madrid’. Para
corregirlo en la base de datos podemos utilizar:
SET TIMEZONE = ‘Europe/Madrid’;
También podemos corregir esto en el fichero de configuración postgresql.conf.
