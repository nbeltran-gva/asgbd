
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

	
Entrega: Documento PDF bien explicado con los puntos que se piden en Tareas después de realizar el ánalisis.

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

Entrega: Breve informe técnico (2-6 páginas) describiendo el proceso de implantación en ambos entornos, adjuntando las evidencias solicitadas.

---

## Actividad 3. Instalación y Conexión al servidor mediante cliente gráfico.

Objetivo: 

Instalar y utilizar un cliente gráfico PostgreSQL para conectar con los servidores PostgreSQL instalados previamente.

Situación: 

El servidor PostgreSQL ya está implantado. Ahora se necesita acceder a él desde una máquina cliente mediante una herramienta gráfica. Se utilizarán:

- a. **pgAdmin 4**, instalar en la máquina cliente Ubuntu MATE.
- b. **DBeaver**, disponible en los equipos del aula.

Importante: En esta actividad no se crearán ni modificarán bases de datos, usuarios ni objetos.

Tareas:

1. Preparación del Cliente: 
    1. Crear una máquina cliente **Ubuntu MATE Desktop** importada desde la plantilla OVA proporcionada en AULES. Instalar `pgAdmin` en esta máquina cliente.
    2. Utilizar cliente **DBeaver** ya instalado en los equipos.
2. Iniciar la aplicación cliente.
3. Configurar una conexión con el usuario `postgres` hacia los servidores PostgreSQL creados anteriormente, Local y Cloud.
4. Comprobar que la conexión se muestra correctamente en el árbol de objetos.
5. Registrar los datos de conexión: nombre del servidor, dirección, puerto, usuario y base de datos.

Evidencias:

- Captura de la instalación de `pgAdmin`.
- Captura de la configuración de la conexión a los servidores PostgreSQL -local y cloud- desde los clientes utilizados.
- Captura del árbol de objetos con el servidor conectado correctamente.
- Captura de los datos de conexión registrados: servidor, puerto, usuario y base de datos.

Entrega: Informe breve (2-6 páginas) con la descripción del proceso de instalación y las evidencias o ficha de conexión.

## Actividad 4. Instalación de cliente `psql`

Objetivo: 

Utilizar la herramienta de línea de comandos `psql` para conectarse y obtener información del servidor PostgreSQL.

Situación: 

Utiliza la máquina Ubuntu MATE de la actividad anterior.

Tareas:

1. Instalar el cliente de línea de comandos `psql`.
2. Comprobar la versión instalada con `psql --version`.
3. Conectarse desde el cliente `plsql`a los dos servidores PostgreSQL -local y cloud-
4. Probar una conexión remota utilizando el parámetro `-h`.
5. Ejecutar comandos básicos como `\l`, `\d` y `\conninfo`.
6. Comprobar que la conexión funciona correctamente y anotar los parámetros necesarios: host, puerto, usuario y base de datos.

Evidencias:

- Captura de la comprobación de la versión con `psql --version`.
- Captura de una conexión local correcta a la base de datos.
- Captura de una conexión remota utilizando `-h` y `-p`.
- Captura de la salida de al menos dos comandos internos, como `\l` y `\conninfo`.

Entrega: Informe breve (2-6 páginas) con la descripción del proceso de instalación y las evidencias (ficha de comandos).


# OPCIONAL

## Actividad 5. Administración remota mediante pgAdmin Web (Opcional)

Objetivo: 

Instalar y utilizar pgAdmin 4 en modo Web para administrar servidores PostgreSQL desde un navegador y comparar esta solución con la versión de escritorio.

Situación: 

Utiliza la máquina Ubuntu MATE de la actividad anterior.

Tareas:

1. Instalar pgAdmin 4 en modo web.
2. Acceder a la aplicación mediante un navegador web remoto.
3. Registrar una conexión con los servidores PostgreSQL -local y cloud-.
4. Verificar que ambos servidores aparecen correctamente en el árbol de objetos.
5. Comparar las características y casos de uso de pgAdmin Web y pgAdmin Desktop.

Evidencias:

- Captura de la instalación.
- Captura del acceso mediante navegador.
- Captura de la interfaz principal de pgAdmin Web.
- Captura de la conexión registrada.
- Captura del árbol de objetos.
- Esquema de arquitectura.
- Tabla comparativa entre las dos modalidades de pgAdmin Destop/Web de las características principales (Instalación, Acceso remot, Dependencias, Administración multiusuario, Facilidad de despliegue, Ventajas, Inconvenientes).

Entrega: Informe breve (2-6 páginas) con la descripción del proceso de instalación y las evidencias 

