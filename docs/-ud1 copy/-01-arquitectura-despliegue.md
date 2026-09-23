# 2. Arquitectura necesaria para el despliegue

## Introducción a PostgreSQL

PostgreSQL es un sistema gestor de bases de datos relacional muy usado en entornos profesionales. Su arquitectura sigue el modelo cliente-servidor: el servidor gestiona los datos y los clientes envían consultas para acceder a ellos.

Se ha elegido para las prácticas de clase porque es un SGBD potente, estable, seguro y muy documentado. Además, permite trabajar de forma clara conceptos como instalación, configuración, acceso remoto, usuarios, permisos y comprobación de funcionamiento.

## Modelo cliente-servidor

PostgreSQL utiliza un modelo cliente-servidor. El servidor y el cliente pueden estar en equipos distintos y se comunican mediante TCP/IP. El servidor puede gestionar varias conexiones desde un mismo cliente o desde clientes diferentes.

La implantación básica está formada por:

- un servidor Ubuntu Server con PostgreSQL;
- uno o más clientes con `psql`, pgAdmin u otra aplicación;
- una red que permita la comunicación entre ambos;
- una base de datos y los roles necesarios.

## Elementos que intervienen

- El gestor de procesos administra las conexiones. 
- El procesador de consultas analiza las consultas, genera un plan de ejecución y devuelve los resultados. 
- Las utilidades realizan tareas de mantenimiento 
- y el gestor de almacenamiento administra la caché, los búferes y el espacio de almacenamiento.

## Objetos iniciales

La instalación crea el rol superusuario `postgres`, propietario inicial del servicio. Los roles pertenecen a la instalación completa y no a una base de datos concreta.

Cada base de datos contiene esquemas para organizar tablas, vistas, funciones, índices, secuencias y triggers. El esquema `public` se crea por defecto.

Los tablespaces permiten ubicar físicamente objetos o bases de datos en otros discos o particiones. Pueden utilizarse si el disco inicial se queda sin espacio o para colocar los datos críticos en almacenamiento más rápido.