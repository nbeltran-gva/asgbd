
# Actividades. Implantación de un SGBD PostgreSQL

**Situación de aprendizaje**

Una empresa necesita desplegar un sistema gestor de bases de datos PostgreSQL para dar servicio a sus aplicaciones corporativas. Como administradores de sistemas, deberéis instalar y configurar el servidor, preparar las herramientas de administración y verificar que los distintos clientes pueden conectarse correctamente.

## Actividad 1. Preparación del servidor PostgreSQL

Objetivo: Implantar el servidor PostgreSQL en un entorno Linux dedicado.

Tareas:

1. Instalar Ubuntu Server. (Utilizar EC2 AWS)
2. Configurar una dirección IP estática mediante **Netplan**.
3. Instalar la última versión estable de PostgreSQL.
4. Comprobar el estado del servicio.
5. Identificar la versión instalada.
6. Localizar los principales directorios de configuración y almacenamiento de datos.
7. Verifica que el servidor escucha en el puerto por defecto.

**No se modificará ninguna configuración interna de PostgreSQL.**

Evidencias:

- Captura de la configuración de red donde se visualice la dirección IP estática asignada.
- Captura del resultado del comando de verificación de la conectividad (ip a, ping, etc.).
- Captura de la instalación de PostgreSQL.
- Captura del servicio PostgreSQL en ejecución (systemctl status postgresql).
- Captura de la versión instalada (psql --version o consulta equivalente).
- Tabla identificando los principales directorios de PostgreSQL: Configuración, Datos, Logs.

ENTREGA: Breve informe técnico (1-2 páginas) descriendo el proceso de instalación.

## Actividad 2. Instalación y verificación de herramientas cliente

Objetivo: Conocer las herramientas cliente disponibles para interactuar con PostgreSQL.

Tareas:

1. Instalar el paquete cliente PostgreSQL en Ubuntu Mate.
2. Verificar la disponibilidad de la herramienta psql.
3. Identificar la versión instalada.
4. Explorar las utilidades incluidas: psql, pg_dump, pg_restore, createdb, createuser.
5. Elaborar una tabla indicando la función de cada utilidad.

Evidencias:

- Capturas de la ejecución de las herramientas.
- Tabla descriptiva de utilidades cliente.

## Actividad 3. Administración gráfica mediante pgAdmin Desktop

Objetivo: Gestionar PostgreSQL utilizando una interfaz gráfica.

Tareas: 

1. Instalar pgAdmin Desktop en Ubuntu Mate.
2. Iniciar la aplicación.
3. Analizar la interfaz de administración.

Documentar:

- Explorador de objetos.
- Gestión de bases de datos.
- Gestión de usuarios y roles.
- Herramienta de consultas SQL.
- Monitorización.
- Comparar el uso de pgAdmin con la herramienta psql.

Evidencias:

- Capturas de la interfaz.
- Informe comparativo entre administración gráfica y administración por consola.

## Actividad 4. Administración remota mediante pgAdmin Web

Objetivo: Implementar una solución de administración basada en navegador.

Tareas: 

1. Instalar pgAdmin 4 en modo servidor (Web).
2. Configurar los requisitos software necesarios.
3. Publicar el servicio web.
4. Acceder desde un navegador remoto.
5. Registrar una conexión con el servidor PostgreSQL.
6. Comparar esta solución con pgAdmin Desktop.

Evidencias:

- Captura del acceso web.
- Esquema de la arquitectura desplegada.
- Tabla comparativa entre las dos modalidades de pgAdmin.

## Actividad final integradora

Escenario: 

A partir de la infraestructura creada, deberéis demostrar que un administrador puede gestionar el servidor PostgreSQL utilizando tres métodos distintos:

Consola (psql).
pgAdmin Desktop.
pgAdmin Web.
Producto final

Informe técnico que incluya:

Arquitectura del entorno desplegado.
Direccionamiento IP utilizado.
Versiones instaladas.
Herramientas empleadas.

Comparativa entre:
Administración por consola.
Administración gráfica local.
Administración gráfica web.

Secuenciación recomendada:
Sesión	Actividad
1	Preparación del servidor PostgreSQL
2	Herramientas cliente PostgreSQL
3	Administración con psql
4	Instalación y uso de pgAdmin Desktop
5	Instalación de pgAdmin Web
6	Actividad final integradora

