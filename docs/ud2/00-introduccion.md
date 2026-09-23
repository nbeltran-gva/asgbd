# UD 2: Configuración de un SGBD

Configurar un sistema gestor de bases de datos consiste en adaptar su funcionamiento a las necesidades del servicio y del entorno donde se ejecuta. Después de instalar PostgreSQL, es necesario revisar sus parámetros, definir cómo se aceptan las conexiones y comprobar que el servidor funciona de forma segura y estable.

La configuración no consiste únicamente en cambiar valores. Cada modificación debe responder a una necesidad concreta, realizarse de forma controlada y comprobarse después. Antes de editar un archivo, conviene conocer el valor actual, guardar una copia de seguridad y anotar el cambio realizado.

## Objetivos de la unidad

- Identificar los principales archivos y parámetros de configuración de PostgreSQL.
- Justificar la selección del motor de base de datos según los requisitos de explotación.
- Asegurar las cuentas de administración y configurar las herramientas cliente.
- Configurar el puerto y las direcciones de escucha del servidor.
- Definir qué usuarios, bases de datos y equipos pueden conectarse.
- Establecer las características por defecto de las bases de datos.
- Ajustar los parámetros principales de las conexiones.
- Aplicar cambios mediante una recarga o un reinicio controlado del servicio.
- Comprobar el acceso desde `psql` o pgAdmin.
- Interpretar errores y registros relacionados con la configuración.
- Documentar los cambios para facilitar el mantenimiento y la resolución de incidencias.

## Ámbitos de configuración

La configuración de un SGBD afecta a varios ámbitos:

| Ámbito | Ejemplos |
|---|---|
| Servicio | Inicio, parada, reinicio y estado del servidor. |
| Red | Direcciones de escucha, puerto y conexiones locales o remotas. |
| Autenticación | Usuarios, bases de datos, direcciones de origen y métodos de acceso. |
| Recursos | Número de conexiones, memoria, sesiones y otros límites del servidor. |
| Operación | Registros, copias de seguridad, comprobaciones y documentación. |

En esta unidad se utilizará PostgreSQL como ejemplo. Los principios pueden aplicarse a otros SGBD, aunque cambien los nombres de los archivos, los comandos y la forma de aplicar los cambios.

!!! tip
    Una configuración correcta debe ser funcional, segura, documentada y adecuada a los recursos disponibles. No se deben aplicar cambios sin conocer su efecto.
