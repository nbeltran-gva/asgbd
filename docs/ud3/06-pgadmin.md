# 6. Administración gráfica con pgAdmin

La interfaz gráfica permite crear roles, modificar atributos y configurar privilegios sin escribir todas las sentencias manualmente. Es importante comprender que pgAdmin genera y ejecuta operaciones SQL en el servidor.

Los ejemplos continúan los de los capítulos anteriores: se parte de `geo`, de sus tablas y de los roles `usulector`, `usueditor`, `geo_lectura` y `geo_edicion`. Si ya los creaste, no intentes volver a crearlos; revisa sus propiedades y continúa con la membresía o los privilegios que falten.

## Crear, modificar y eliminar bases de datos

!!! summary "Vídeo: gestión de bases de datos en pgAdmin"

    En el siguiente vídeo se muestra la creación, modificación y eliminación de bases de datos en pgAdmin:

    <iframe width="400" style="width: 100%; max-width: 560px; aspect-ratio: 16 / 9; height: auto; border: 0;" src="https://www.youtube-nocookie.com/embed/0CeFpgG1op4" title="Crear, modificar y eliminar bases de datos en pgAdmin" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

    [Ver el vídeo en YouTube](https://www.youtube.com/watch?v=0CeFpgG1op4)

## Crear o revisar un rol de usuario

1. Abre pgAdmin 4 y conecta con el servidor de prácticas.
2. En el navegador, localiza **Login/Group Roles**.
3. Si `usulector` ya existe, abre sus propiedades y comprueba sus atributos. Si no existe, haz clic con el botón derecho y selecciona **Create → Login/Group Role**.
4. En **General**, escribe `usulector` si estás creando el rol.
5. Si estás creando el rol, configura una contraseña de prácticas. Si estás revisando uno existente, conserva su configuración salvo que el ejercicio requiera cambiarla.
6. Al crear el rol, habilita únicamente los atributos necesarios, como **Can login?**.
7. En **SQL**, revisa la sentencia generada si la pestaña está disponible.
8. Guarda los cambios y comprueba que el rol aparece en el navegador.

Los nombres exactos de las pestañas pueden variar según la versión de pgAdmin.

## Crear o revisar un rol de grupo

Si `geo_lectura` ya existe, abre sus propiedades y comprueba que no puede iniciar sesión. Si no existe:

1. Selecciona **Login/Group Roles → Create**.
2. Introduce el nombre `geo_lectura`.
3. Desactiva la capacidad de inicio de sesión (**Can login?**).
4. Guarda el rol.
5. Concede privilegios sobre los objetos que corresponden a ese perfil.

## Crear membresía de un rol

Una membresía permite que un rol sea miembro de otro. Por ejemplo, para hacer que `usulector` pertenezca a `geo_lectura`, ambos roles deben existir y debes conectarte con un rol autorizado para conceder la membresía.

1. En **Login/Group Roles**, haz clic con el botón derecho sobre `usulector` y selecciona **Properties**.
2. Abre la pestaña **Membership**.
3. En **Member of**, comprueba si aparece `geo_lectura`. Si no aparece, pulsa **+** y selecciónalo; esta sección indica los roles de los que `usulector` es miembro.
4. Revisa las opciones de la membresía y deja **Admin Option** desactivada si `usulector` no necesita administrar esa membresía.
5. Si está disponible, revisa la pestaña **SQL** para comprobar la sentencia generada.
6. Pulsa **Save** y vuelve a abrir las propiedades de `usulector` para comprobar que `geo_lectura` aparece en **Member of**.

En PostgreSQL 16 o posterior, pgAdmin puede mostrar también **Inherit Option** y **Set Option**: la primera controla la herencia de los privilegios del grupo y la segunda permite activarlo con `SET ROLE`. Las opciones visibles dependen de las versiones del servidor y de pgAdmin.

Como alternativa, en las propiedades de `geo_lectura` puedes añadir `usulector` en **Members**. Para retirar la membresía, elimina la entrada correspondiente y guarda los cambios; esto no elimina los roles.

Para comprobar la relación mediante SQL, abre **Query Tool** y ejecuta:

```sql
SELECT pg_has_role('usulector', 'geo_lectura', 'MEMBER') AS es_miembro;
```

El resultado `true` confirma que `usulector` es miembro directo o indirecto de `geo_lectura`, pero no indica por sí solo si hereda sus privilegios.

Vídeo de apoyo: [Creación de roles con pgAdmin](https://youtu.be/D57uSCKvCro).

## Conceder privilegios de objetos

Para consultar `public.poblacions` en la base de datos `geo`, el rol necesita privilegios en tres niveles:

| Objeto | Privilegio | Finalidad |
|---|---|---|
| Base de datos `geo` | `CONNECT` | Permitir la conexión a la base de datos. |
| Esquema `public` | `USAGE` | Permitir el acceso a los objetos del esquema por su nombre. |
| Tabla `public.poblacions` | `SELECT` | Permitir consultar los datos de la tabla. |

??? example "Ejemplo: Conceder privilegios con pgAdmin"

    Concede estos privilegios al rol `geo_lectura` desde una conexión con permisos para otorgarlos:

    1. En el navegador, abre las propiedades de la base de datos `geo`.
    2. En **Security → Privileges**, pulsa **+**, selecciona `geo_lectura` como **Grantee**, marca `CONNECT` y guarda.
    3. En `geo`, abre las propiedades de **Schemas → public**. En **Security → Privileges**, añade `geo_lectura`, marca `USAGE` y guarda.
    4. En **Schemas → public → Tables**, abre las propiedades de `poblacions`. En **Security → Privileges**, añade `geo_lectura`, marca `SELECT` y guarda.

Si ya existe una entrada para el rol, modifica los privilegios de esa entrada en lugar de añadir otra. Revisa las concesiones existentes antes de cambiarlas, incluidas las de `PUBLIC`. Los nombres de las opciones pueden variar según la versión de pgAdmin.

Para comprobar los privilegios efectivos de `usulector`, abre **Query Tool** conectado a `geo` y ejecuta:

```sql
SELECT has_database_privilege('usulector', 'geo', 'CONNECT') AS puede_conectar,
       has_schema_privilege('usulector', 'public', 'USAGE') AS puede_usar_esquema,
       has_table_privilege('usulector', 'public.poblacions', 'SELECT') AS puede_consultar;
```

Los tres resultados deben ser `true` para el acceso directo con los privilegios efectivos de `usulector`. Comprueba también la conexión y la consulta como `usulector`: la membresía debe permitirle heredar los privilegios del grupo, salvo que los reciba por otra vía. La autenticación y las reglas de conexión del servidor también deben permitir el acceso.

Para retirar un privilegio, modifica la entrada correspondiente en las propiedades y guarda los cambios. Comprueba después los privilegios efectivos, ya que el rol podría recibirlos por otra concesión o membresía.

Vídeo de apoyo: [Conceder y quitar privilegios con pgAdmin](https://youtu.be/dZz1JMuTe0E).

## Consultar vistas

Las vistas creadas se muestran en el navegador de pgAdmin.

??? example "Ejemplo: Consultar una vista con pgAdmin"

    Para consultar `public.vista_mas_de_700` de la base de datos `geo`:

    1. Despliega **Databases → geo → Schemas → public → Views**.
    2. Si la vista no aparece y ya ha sido creada, actualiza **Views** con la opción **Refresh**.
    3. Haz clic con el botón derecho sobre `vista_mas_de_700` y abre **Properties**. En **Code** puedes consultar la consulta que define la vista; en **SQL** puedes revisar la sentencia correspondiente.
    4. Para ver sus datos, abre **Query Tool** conectado a `geo` y ejecuta:

        ```sql
        SELECT * FROM public.vista_mas_de_700;
        ```

La vista debe existir previamente y el rol conectado necesita los permisos necesarios para acceder a la base de datos, al esquema y a la vista. La creación de este ejemplo se explica en [Gestión de bases de datos y objetos](03-basesdatos-objetos.md).

## Copias de seguridad y restauración

pgAdmin permite configurar copias de seguridad y restauraciones mediante una interfaz gráfica. Para ello utiliza las herramientas cliente de PostgreSQL, como `pg_dump` y `pg_restore`, según el formato de la copia.

**Crear una copia de seguridad**

1. En el navegador, selecciona la base de datos `geo`.
2. Haz clic con el botón derecho y selecciona **Backup**.
3. Indica el nombre y la ubicación del fichero y selecciona el formato **Custom**.
4. Revisa las opciones y pulsa **Backup**.
5. Comprueba en la ventana de procesos que la operación ha finalizado correctamente.

**Restaurar una copia**

1. Crea una base de datos de destino llamada `geo_nueva`, si todavía no existe. Puedes asignar `geo` como propietario para conservar el mismo rol de los objetos originales; la actividad de restauración también utiliza ese nombre.
2. Haz clic con el botón derecho sobre ella y selecciona **Restore**.
3. Selecciona el fichero de copia en formato **Custom** y revisa las opciones de restauración.
4. Pulsa **Restore** y comprueba en la ventana de procesos que la operación ha finalizado correctamente.
5. Actualiza el navegador y verifica que los objetos y datos esperados están disponibles.

La opción **Restore** utiliza `pg_restore` para formatos como **Custom**. Para restaurar una copia SQL de texto plano se utiliza `psql`, como se explica en [Copias de seguridad y restauración](05-copias-restauracion.md).

Vídeo de apoyo: [Copias de seguridad y restauración con pgAdmin](https://www.youtube.com/watch?v=YKCAuic0mD0).

### Herramientas cliente y compatibilidad

Si pgAdmin no encuentra `pg_dump` o `pg_restore`, o muestra un error de versión, comprueba que las herramientas cliente están instaladas y que pgAdmin tiene configurada la ruta a sus ejecutables.

Para configurar la ruta en pgAdmin:

1. Abre **File → Preferences**.
2. Busca **Paths → Binary paths** y localiza la entrada de la versión de PostgreSQL que corresponda.
3. Indica el **directorio** que contiene los ejecutables, no la ruta de un ejecutable concreto. Por ejemplo, en Ubuntu puede ser `/usr/lib/postgresql/16/bin` para PostgreSQL 16.
4. Guarda los cambios y vuelve a intentar la operación. Comprueba en la ventana de procesos qué ejecutable se ha utilizado y si aparece algún error.

La ubicación y los nombres de las opciones pueden variar según la versión y el modo de instalación de pgAdmin. En una instalación web, la ruta debe existir en la máquina o contenedor donde se ejecuta pgAdmin, no necesariamente en el ordenador desde el que se abre el navegador.

`pg_dump` no puede realizar copias de un servidor cuya versión principal sea más reciente que la suya. Utiliza herramientas compatibles con el servidor y comprueba también la compatibilidad con la versión de destino antes de restaurar. Consulta la [documentación de `pg_dump`](https://www.postgresql.org/docs/current/app-pgdump.html) y la de [`pg_restore`](https://www.postgresql.org/docs/current/app-pgrestore.html).

??? example "Ejemplo: Instalar las herramientas cliente en Ubuntu"

    En Ubuntu, si el paquete correspondiente está disponible en los repositorios configurados, para PostgreSQL 16 se puede instalar con:

    ```bash
    sudo apt update
    sudo apt install postgresql-client-16
    ```

La versión y la disponibilidad del paquete dependen de la instalación y de los repositorios. No es necesario eliminar otros paquetes de PostgreSQL para instalar las herramientas cliente.

---

### Actualización de `pgAdmin`

Es posible que `pgAdmin` presente problemas con algunas aplicaciones cliente instaladas, como `pg_dump` o `pg_restore`. Esto puede ocurrir porque, al instalar pgAdmin en Ubuntu MATE, se instalan como dependencias las aplicaciones cliente de la versión disponible en los repositorios de la distribución, que puede no coincidir con la versión del servidor.

Para instalar las aplicaciones cliente de PostgreSQL 16 en Ubuntu MATE, añade los repositorios de PostgreSQL y ejecuta los siguientes comandos:

```bash
sudo apt install curl ca-certificates

sudo install -d /usr/share/postgresql-common/pgdg

sudo curl \
    -o /usr/share/postgresql-common/pgdg/apt.postgresql.org.asc \
    --fail \
    https://www.postgresql.org/media/keys/ACCC4CF8.asc

sudo sh -c 'echo "deb [signed-by=/usr/share/postgresql-common/pgdg/apt.postgresql.org.asc] \
https://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" \
> /etc/apt/sources.list.d/pgdg.list'

sudo apt update
sudo apt -y install postgresql-client-16
```

!!! warning "Comprobar la versión"

    Comprueba que la versión de las aplicaciones cliente coincide con la versión del servidor PostgreSQL para evitar incompatibilidades entre `pg_dump`, `pg_restore` y el servidor.

## Actividades relacionadas

- [Actividad 1: Creación de usuarios y concesión de permisos](00-actividades.md#actividad-1-creacion-de-usuarios-y-concesion-de-permisos).
- [Actividad 2: Creación de un grupo y asignación de permisos](00-actividades.md#actividad-2-creacion-de-un-grupo-y-asignacion-de-permisos).
- [Actividad 8: Copia de seguridad y restauración de la estructura](00-actividades.md#actividad-8-copia-de-seguridad-y-restauracion-de-la-estructura).
- [Actividad 9: Transferencia de datos entre bases de datos](00-actividades.md#actividad-9-transferencia-de-datos-entre-bases-de-datos).

La actividad 2 utiliza los usuarios creados en la actividad 1; la actividad 9 utiliza la base de datos restaurada en la actividad 8.
