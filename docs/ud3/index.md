# UD 3: Control de acceso en PostgreSQL

En esta unidad aprenderás a organizar y administrar bases de datos PostgreSQL, gestionar roles y privilegios, controlar el acceso y realizar copias de seguridad y restauraciones. 

Para comprender cómo se controla el acceso en PostgreSQL, aprenderás:

1. Cómo se organizan los **objetos** de la base de datos.
2. Qué son los **roles** y cómo se gestionan.
3. Qué **privilegios** pueden tener los roles sobre los objetos.

Para ello, utilizarás `psql` y la herramienta gráfica `pgAdmin`.

!!! note "Base de datos de los ejemplos"

    Se parte de la base de datos **`geo`**, que ya existe, y del rol `geo`, propietario de los objetos utilizados en los ejemplos. Los roles de usuario y de grupo que se crearán durante la unidad servirán para practicar la asignación de permisos. En el esquema `public` se encuentran las tablas `comarques`, `poblacions` e `instituts`, así como la vista `vista_mas_de_700`. La estructura lógica es la siguiente:

    ```text
    Clúster de PostgreSQL
    └── Base de datos: geo
        └── Esquema: public
            ├── Tabla: comarques
            ├── Tabla: poblacions
            ├── Tabla: instituts
            └── Vista: vista_mas_de_700
    ```

    El rol `geo` pertenece al clúster de PostgreSQL, no a la base de datos `geo`.
    
---

## Contenidos

1. [Control de acceso y organización lógica](01-control-acceso-organizacion.md)
2. [Roles y membresías de roles](02-roles-membresias.md)
3. [Gestión de bases de datos y objetos](03-basesdatos-objetos.md)
4. [Privilegios sobre objetos](04-privilegios-objetos.md)
5. [Copias de seguridad y restauración](05-copias-restauracion.md)
6. [Administración gráfica con pgAdmin](06-pgadmin.md)

- [Actividades](00-actividades.md)

---

## Objetivos

- Gestionar roles de usuario y de grupo.
- Asignar y retirar permisos sobre bases de datos, esquemas y tablas.
- Crear bases de datos y organizar sus objetos mediante esquemas y tablespaces.
- Crear y modificar tablas y vistas.
- Realizar copias de seguridad.
- Restaurar bases de datos y transferir información entre ellas.
- Utilizar las vistas del sistema para consultar metadatos.

---

## Criterios de evaluación

La unidad desarrolla el **RA3: «Implanta métodos de control de acceso utilizando asistentes, herramientas gráficas y comandos del lenguaje del sistema gestor».**

Se considera que la actividad se ha desarrollado de forma satisfactoria cuando se han cumplido los siguientes criterios:

- a) Se han creado vistas personalizadas para cada tipo de usuario.
- b) Se han creado sinónimos de tablas y vistas.
- c) Se han definido y eliminado cuentas de usuario.
- d) Se han identificado los privilegios sobre las bases de datos y sus elementos.
- e) Se han agrupado y desagrupado privilegios.
- f) Se han asignado y eliminado privilegios a usuarios.
- g) Se han asignado y eliminado grupos de privilegios a usuarios.
- h) Se ha garantizando el cumplimiento de los requisitos de seguridad.

---

## Planificación

La unidad se desarrolla en un tiempo estimado de 8 horas, distribuidas entre la gestión de usuarios y permisos, la administración de bases de datos, la creación y uso de vistas, y la revisión de los criterios de seguridad.
