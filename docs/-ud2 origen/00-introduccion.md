# 0. Introducción

## Administrar el acceso y los objetos

La gestión de un SGBD consiste en organizar sus usuarios y objetos, proteger la información y mantener la posibilidad de recuperar el sistema. En PostgreSQL estas tareas se realizan desde `psql` o desde pgAdmin.

La unidad se centra en cuatro áreas:

- **Usuarios y permisos**: autenticación, roles, grupos y privilegios.
- **Bases de datos**: creación, modificación, eliminación, esquemas y tablespaces.
- **Copias de seguridad**: generación, restauración y transferencia de bases de datos.
- **Vistas**: consultas guardadas que presentan una parte de la información.

## Idea clave

Los usuarios no deben recibir más privilegios de los necesarios. Los roles de grupo permiten centralizar permisos, las copias protegen frente a errores y las vistas pueden limitar o simplificar la información que consulta cada persona.

!!! warning "Trabaja con copias"
	Las operaciones `DROP`, los cambios de permisos y las restauraciones pueden eliminar o modificar información. Comprueba siempre la base de datos y el usuario antes de ejecutar una orden.
