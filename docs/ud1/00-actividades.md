
# Actividades de Implantación. 

## Actividad 1. Selección de un SGBD para implantación

Una empresa necesita desplegar una base de datos para una aplicación web con cientos de usuarios simultáneos, requisitos de seguridad, almacenamiento de información crítica y necesidad de disponibilidad razonable. El alumnado debe comparar al menos cuatro SGBD relacionales y decidir cuál es el más adecuado para ese escenario, teniendo en cuenta no solo el rendimiento, sino también la implantación real del sistema.

SGBD a comparar:

- PostgreSQL
- MySQL / MariaDB
- Microsoft SQL Server
- Oracle Database

Criterios de análisis:

- coste y licencia;
- tipo de entorno recomendado y requisitos de instalación;
- prestaciones de concurrencia y transacciones;
- seguridad y control de accesos;
- rendimiento y escalabilidad;
- herramientas de administración y monitorización;
- mecanismos de copia de seguridad y recuperación;
- compatibilidad con sistemas operativos, clientes y aplicaciones;
- documentación, soporte y comunidad.

Tareas:

1. Investiga las principales características de cada SGBD desde una perspectiva de implantación.
2. Completa una tabla comparativa con los criterios anteriores.
3. Analiza qué requisitos del caso de uso condicionan la elección del SGBD.
4. Debate en grupo cuál sería la solución más adecuada para desplegar el sistema en producción.
5. Justifica la decisión final con argumentos técnicos y documenta la conclusión en una breve exposición o informe.

Plantilla de comparación:

| SGBD | Licencia | Uso recomendado | Seguridad | Rendimiento | Escalabilidad | Herramientas | Ventajas | Desventajas |
|---|---|---|---|---|---|---|---|---|
| PostgreSQL |  |  |  |  |  |  |  |  |
| MySQL / MariaDB |  |  |  |  |  |  |  |  |
| Microsoft SQL Server |  |  |  |  |  |  |  |  |
| Oracle Database |  |  |  |  |  |  |  |  |

	
Entrega: Documento PDF bien explicado con los puntos que se piden en Tareas después de realizar el ánalisis.

---

## Actividad 2. Instalación del servidor PostgreSQL

Objetivo: Implantar el servidor PostgreSQL en un entorno Linux dedicado.

Tareas:

1. Crear un servidor Ubuntu Server utilizando los siguientes entornos:
    1. Máquina virtual importada desde la plantilla OVA proporcionada en AULES (**Ubuntu Server 22.04**).
    2. Instancia EC2 de AWS creada en el laboratorio de clase (**Ubuntu Server 24.04 LTS**). Consulta la guía [Servidor Linux](../ud0_aws/02-servidor-linux.md) para más detalles.
2. Configurar una dirección IP estática:
    1. En una máquina virtual, configurarla mediante **Netplan**.
    2. En una instancia EC2 de AWS, identificar la dirección IP privada asignada por la VPC y asociar, si es necesario, una **Elastic IP** para disponer de una dirección pública permanente. Consulta la guía [IP elástica](../ud0_aws/03-ip-elastica.md) para más detalles.
4. Comprobar el estado del servicio.
5. Identificar la versión instalada.
6. Localizar los principales directorios de configuración y almacenamiento de datos.
7. Verificar que el servidor escucha en el puerto por defecto.
8. Registrar las incidencias que se hayan encontrado durante la instalación y cómo se han resuelto.

> No se modificará ninguna configuración interna de PostgreSQL.

Evidencias:

- Captura de la configuración de red donde se visualice la dirección IP estática asignada.
- Captura del resultado del comando de verificación de la conectividad (`ip a`, `ping`, etc.).
- Captura de la instalación de PostgreSQL.
- Captura del servicio PostgreSQL en ejecución (`systemctl status postgresql`).
- Captura de la versión instalada (`psql --version` o consulta equivalente).
- Tabla identificando los principales directorios de PostgreSQL: configuración, datos y logs.

Entrega: Breve informe técnico (2-6 páginas) describiendo el proceso de instalación de ambas instalaciones en los dos entornos y adjuntando las capturas de las evidencias solicitadas.

---

## Actividad 3. Instalación de cliente gráfico `pgAdmin`

Objetivo: Instalar y probar un cliente PostgreSQL para conectar con un servidor configurado previamente utilizando una interfaz gráfica.

Tareas:

1. Crear una máquina cliente **Ubuntu Mate** utilizando uno de los siguientes entornos:
   1. una máquina virtual importada desde la plantilla OVA proporcionada en AULES;
   2. una instancia EC2 de AWS creada en el laboratorio de clase.
2. Instalar `pgAdmin` en la máquina cliente.
3. Iniciar la aplicación.
4. Configurar una conexión con el usuario `postgres` hacia el servidor PostgreSQL.
5. Comprobar que la conexión se muestra correctamente en el árbol de objetos.
6. Registrar los datos de conexión: nombre del servidor, dirección, puerto, usuario y base de datos.

Evidencias:

- Captura de la instalación de `pgAdmin`.
- Captura de la configuración de la conexión al servidor PostgreSQL.
- Captura del árbol de objetos con el servidor conectado correctamente.
- Captura de los datos de conexión registrados: servidor, puerto, usuario y base de datos.

Entrega: Informe breve (2-6 páginas) con la descripción del proceso de instalación y las evidencias 

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

Entrega: Informe breve (2-6 páginas) con la descripción del proceso de instalación y las evidencias 

## Actividad 5. Instalación de cliente `psql`

Objetivo: Conocer las herramientas cliente disponibles para interactuar con PostgreSQL.

Tareas:

1. Utilizar Ubuntu Mate. (Utilizar máquina virtual de la actividad anterior).
2. Instalar el cliente de línea de comandos `psql`.
3. Comprobar la versión instalada con `psql --version`.
4. Conectarte a una base de datos local.
5. Probar una conexión remota utilizando el parámetro `-h`.
6. Ejecutar comandos básicos como `\l`, `\d` y `\conninfo`.
7. Comprobar que la conexión funciona correctamente y anotar los parámetros necesarios: host, puerto, usuario y base de datos.

Evidencias:

- Captura de la comprobación de la versión con `psql --version`.
- Captura de una conexión local correcta a la base de datos.
- Captura de una conexión remota utilizando `-h` y `-p`.
- Captura de la salida de al menos dos comandos internos, como `\l` y `\conninfo`.

Entrega: Informe breve (2-6 páginas) con la descripción del proceso de instalación y las evidencias 


