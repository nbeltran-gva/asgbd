# 0. Introducción

## Automatizar tareas con PL/pgSQL

PL/pgSQL es el lenguaje procedimental que proporciona PostgreSQL. Permite combinar sentencias SQL con variables, condiciones, bucles, procedimientos y funciones.

Con este lenguaje se pueden automatizar tareas de administración y crear accesos más potentes a los datos. En la unidad se trabajará con procedimientos anónimos, rutinas almacenadas, cursores, excepciones y triggers.

## Conceptos principales

- **Procedimiento**: conjunto de instrucciones con nombre que se ejecuta mediante `CALL`.
- **Función**: rutina que, además de ejecutar instrucciones, devuelve un valor.
- **Cursor**: variable que permite recorrer las filas producidas por una consulta.
- **Excepción**: mecanismo para tratar errores durante la ejecución.
- **Trigger**: rutina que se activa automáticamente ante un `INSERT`, `UPDATE` o `DELETE`.

Los ejemplos utilizan la base de datos `scott`. Para la entrega de actividades se debe incluir el código de cada ejercicio, una captura de ejecución y el resultado obtenido.

!!! note "Estructura general"
	Los bloques PL/pgSQL se organizan normalmente en las secciones `DECLARE`, `BEGIN`, `EXCEPTION` y `END`. Todas las instrucciones terminan en punto y coma.
