
# Actividades de Implantación. 

## Actividad 1. Selección de un SGBD para implantación

Objetivo:

Analizar las características de diferentes sistemas gestores de bases de datos relacionales y seleccionar el más adecuado para una determinada infraestructura, teniendo en cuenta aspectos técnicos, económicos y de administración.

Situación profesional:

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

	
Entrega: 

Documento PDF bien explicado con los puntos que se piden en Tareas después de realizar el ánalisis.

---

## Actividad 2. Implantación y verificación del servidor PostgreSQL

Objetivo: 

Instalar y verificar un servidor PostgreSQL en dos infraestructuras diferentes —local y cloud— y reconocer los elementos básicos necesarios para su administración.

Se implantará PostgreSQL en dos entornos:

- **a. Servidor local**: máquina virtual Ubuntu Server 22.04 proporcionada mediante OVA.
- **b. Servidor cloud**: instancia AWS EC2 con Ubuntu Server 24.04 LTS.

El objetivo es comprobar que ambos servidores quedan correctamente instalados y operativos.

Importante: en esta actividad no se modificará todavía la configuración interna de PostgreSQL (postgresql.conf ni pg_hba.conf). La configuración avanzada se realizará en la siguiente UD2.

Tareas:

1. Preparación del entorno:
    1. Servidor Local: Crear máquina virtual importada desde la plantilla OVA proporcionada en AULES (**Ubuntu Server 22.04**).
    2. Servidor Cloud: Crear una Instancia EC2 con **Ubuntu Server 24.04 LTS**. ( Configurar el Security Group permitiendo conectarse mediante SSH (22)). Consulta la guía [Servidor Linux](../ud0_aws/02-servidor-linux.md) para más detalles.
2. Configurar de red:
    1. Servidor Local: Configurar la dirección IP estática mediante **Netplan**.
    2. Servidor Cloud: Identificar la dirección IP privada asignada por la VPC y asociar, si es necesario, una **Elastic IP** para disponer de una dirección pública permanente. Consulta la guía [IP elástica](../ud0_aws/03-ip-elastica.md) para más detalles.
3. Instalación de PostgreSQL. 
4. Comprobar el estado del servicio.
5. Comprobar la versión instalada.
6. Localizar los principales directorios de configuración y almacenamiento de datos.
7. Verificar que el servidor escucha en el puerto por defecto.
8. Registrar las incidencias que se hayan encontrado durante la instalación y cómo se han resuelto.
9. Finalmente elaborar una Tabla comparativa de los entornos con sus características (Sistema operativo, CPU, Memoria  RAM, Espacio disco, Versión PostgreSQL, Dirección IP, Accesibilidad remota, Ventajas, Inconvenientes)

Evidencias:

- Captura de la configuración de red donde se visualice la dirección IP estática asignada.
- Captura del resultado del comando de verificación de la conectividad (`ip a`, `ping`, etc.).
- Captura de la instalación de PostgreSQL.
- Captura del servicio PostgreSQL en ejecución (`systemctl status postgresql`).
- Captura de la versión instalada (`psql --version` o consulta equivalente).
- Tabla identificando los principales directorios de PostgreSQL: configuración, datos y logs.
- Registro de incidencias, si las hubiera.

Entrega: 

Breve informe técnico (2-6 páginas) describiendo el proceso de implantación en ambos entornos, adjuntando las evidencias solicitadas.

---

## Actividad 3. Instalación del cliente pgAdmin 4.

Objetivo: 

Instalar y verificar el funcionamiento de pgAdmin 4 como herramienta gráfica de administración para PostgreSQL.

Situación: 

En esta actividad nos centraremos únicamente en la instalación y puesta en marcha de la herramienta cliente **pgAdmin 4**. La conexión con servidores PostgreSQL se trabajará en la siguiente unidad didáctica.

Tareas:

1. Crear una máquina cliente **Ubuntu MATE Desktop** importada desde la plantilla OVA proporcionada en AULES. 
2. Instalar pgAdmin 4 en la máquina cliente.
3. Iniciar la aplicación cliente y comprobar que se abre correctamente.
4. Explorar las principales opciones de la interfaz gráfica (panel de navegación, menús y preferencias).
5. Identificar la versión instalada de pgAdmin 4.

Evidencias:

- Captura de la instalación de pgAdmin 4.
- Captura de la ventana principal de la aplicación iniciada correctamente.
- Captura donde se visualice la versión instalada.

Entrega:

Informe breve (1-3 páginas) describiendo el proceso de instalación e incluyendo las evidencias solicitadas.

---
!!! warning "Advertencia"
    En esta unidad no es necesario realizar conexiones a servidores PostgreSQL, ni locales ni remotos. La configuración del servidor y las conexiones desde los distintos clientes se abordarán en la siguiente unidad didáctica.

## Actividad 4. Instalación de cliente `psql`

Objetivo: 

Instalar y verificar el funcionamiento básico de la herramienta de línea de comandos psql.

Situación: 

Se utilizará la misma máquina Ubuntu MATE creada en la actividad anterior.

Tareas:

1. Instalar el cliente de línea de comandos `psql`.
2. Comprobar que la instalación se ha realizado correctamente mediante el comando:  `psql --version`.
3. Ejecutar el comando `command -v psql` para verificar que el sistema reconoce correctamente el cliente PostgreSQL y localizar su ejecutable.
4. Registrar la versión instalada y la ruta del programa.
5. Ejecutar alguno de los comandos básicos dentro del entorno plsql.

Evidencias:

- Captura de la instalación del cliente PostgreSQL.
- Captura de la comprobación de la versión con `psql --version`.
- Captura de la salida del comando which psql.
- Captura de la salida de al menos dos comandos internos.

Entrega:

Informe breve (1-3 páginas) describiendo el proceso de instalación e incluyendo las evidencias solicitadas.

---
!!! warning "Advertencia"
    En esta unidad no es necesario realizar conexiones a servidores PostgreSQL, ni locales ni remotos. La configuración del servidor y las conexiones desde los distintos clientes se abordarán en la siguiente unidad didáctica.

# OPCIONAL

## Actividad 5. Instalación de pgAdmin 4 en modo Web (Opcional)

Objetivo: 

Instalar y verificar el funcionamiento de pgAdmin 4 en modo Web como alternativa a la versión de escritorio.

Situación: 

Las organizaciones pueden desplegar pgAdmin como una aplicación web accesible desde un navegador. En esta actividad se realizará la instalación y configuración básica de pgAdmin Web, sin necesidad de conectarlo a ningún servidor PostgreSQL.

Utiliza la máquina Ubuntu MATE de la actividad anterior.

Tareas:

1. Instalar pgAdmin 4 en modo Web siguiendo la documentación oficial.
2. Realizar la configuración inicial de la aplicación.
3. Acceder a pgAdmin Web mediante un navegador.
4. Verificar que la aplicación se inicia correctamente y que es posible acceder a la pantalla principal.
5. Identificar la dirección de acceso (URL) y el puerto utilizado por la aplicación.
6. Elaborar una breve comparativa entre pgAdmin Desktop y pgAdmin Web indicando sus principales ventajas e inconvenientes.

Evidencias:

- Captura de la instalación de pgAdmin Web.
- Captura de la configuración inicial.
- Captura del acceso desde el navegador web.
- Captura de la pantalla principal de pgAdmin Web.
- Captura donde se visualice la URL o dirección de acceso utilizada.
- Tabla comparativa entre pgAdmin Desktop y pgAdmin Web.

Entrega: 

Informe breve (2-6 páginas) con la descripción del proceso de instalación y las evidencias 

Nota:

En esta actividad no es necesario registrar conexiones ni conectarse a servidores PostgreSQL. El objetivo es únicamente instalar, configurar y verificar el funcionamiento de pgAdmin Web.

---
!!! warning "Advertencia"
    En esta unidad no es necesario realizar conexiones a servidores PostgreSQL, ni locales ni remotos. La configuración del servidor y las conexiones desde los distintos clientes se abordarán en la siguiente unidad didáctica.
