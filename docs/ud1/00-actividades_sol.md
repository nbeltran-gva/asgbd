# Soluciones de las prácticas de implantación e instalación

Estas soluciones son orientativas. Las direcciones IP, las versiones y los nombres de las interfaces de red deben adaptarse al entorno de prácticas. No se deben incluir contraseñas en capturas, scripts o documentos públicos.

## Actividad de comparación de SGBD relacionales

### Tabla comparativa orientativa

| SGBD | Licencia | Uso recomendado | Seguridad | Rendimiento y escalabilidad | Herramientas | Ventajas | Desventajas |
|---|---|---|---|---|---|---|---|
| PostgreSQL | Código abierto, licencia PostgreSQL | Aplicaciones empresariales, científicas y web | Roles, permisos, autenticación, SSL y auditoría | Buen rendimiento, transacciones y escalabilidad | `psql`, pgAdmin y herramientas externas | Robustez, integridad, extensibilidad y buen cumplimiento de SQL | Requiere conocimientos de administración |
| MySQL / MariaDB | Código abierto, con ediciones comerciales | Aplicaciones web y servicios con gran comunidad | Usuarios, privilegios, autenticación y cifrado | Buen rendimiento en muchas aplicaciones web | Clientes de consola, herramientas gráficas y paneles web | Facilidad de uso y amplia adopción | Algunas funciones dependen de la edición o del motor utilizado |
| Microsoft SQL Server | Comercial, con ediciones gratuitas o de evaluación | Entornos integrados con productos Microsoft | Active Directory, roles, auditoría y cifrado | Alto rendimiento y buenas herramientas empresariales | SQL Server Management Studio y Azure Data Studio | Integración empresarial y administración gráfica | Coste de licencia en algunas ediciones |
| Oracle Database | Comercial | Aplicaciones críticas y grandes organizaciones | Amplias funciones de seguridad, auditoría y alta disponibilidad | Muy alto rendimiento y escalabilidad | SQL Developer y Enterprise Manager | Funciones avanzadas y soporte empresarial | Coste y complejidad elevados |

### Elección propuesta

Para una aplicación web con cientos de usuarios, concurrencia y requisitos de seguridad se propone **PostgreSQL**, porque:

- soporta transacciones y control de integridad;
- dispone de roles, permisos y mecanismos de autenticación;
- puede crecer con la aplicación;
- ofrece herramientas de consola y gráficas;
- funciona en Linux y tiene una licencia adecuada para las prácticas y muchos entornos empresariales.

La elección podría cambiar si la organización necesitara una integración específica con Microsoft, una plataforma Oracle ya existente o un soporte comercial concreto. La decisión final siempre debe basarse en los requisitos técnicos y económicos.

## Actividad 1. Instalación del servidor PostgreSQL

### Configurar una IP estática

Primero se identifica la interfaz de red y el archivo de Netplan:

```bash
ip address
ls /etc/netplan/
```

Se realiza una copia del archivo antes de modificarlo:

```bash
sudo cp /etc/netplan/00-installer-config.yaml /etc/netplan/00-installer-config.yaml.bak
```

El nombre puede ser diferente en cada instalación. Un ejemplo de configuración es:

```yaml
network:
  version: 2
  ethernets:
    enp0s3:
      addresses:
        - 192.168.1.50/24
      routes:
        - to: default
          via: 192.168.1.1
      nameservers:
        addresses:
          - 192.168.1.1
          - 8.8.8.8
```

Se sustituyen `enp0s3` y las direcciones por los valores reales de la red. Se prueba la configuración:

```bash
sudo netplan try
```

Si la conexión funciona, se aplica definitivamente:

```bash
sudo netplan apply
```

Se comprueba el resultado:

```bash
ip address
ip route
ping -c 4 192.168.1.1
```

**Resultado esperado:** el servidor conserva la IP configurada, tiene una ruta predeterminada y puede comunicarse con la red de prácticas.

### Instalar PostgreSQL

```bash
sudo apt update
sudo apt install postgresql postgresql-client -y
```

Se comprueba la instalación:

```bash
psql --version
sudo systemctl status postgresql
sudo -u postgres psql -c "SELECT version();"
```

**Resultado esperado:** el servicio aparece como `active (running)` y el servidor devuelve su versión.

### Evidencias

- Copia o captura del archivo de Netplan sin datos sensibles.
- Salida de `ip address` e `ip route`.
- Versión de `psql`.
- Estado del servicio PostgreSQL.
- Consulta de versión del servidor.

## Actividad 2. Instalación de pgAdmin en Ubuntu Mate

Se descarga la versión compatible desde la página oficial de [pgAdmin](https://www.pgadmin.org/download/) y se instala siguiendo las instrucciones correspondientes a Ubuntu Mate.

Después se inicia la aplicación desde el menú o desde el terminal. Si solicita una contraseña maestra, se establece una contraseña segura.

Para registrar el servidor PostgreSQL se utilizan datos como los siguientes:

| Campo | Valor de ejemplo |
|---|---|
| Nombre | `PostgreSQL Ubuntu Server` |
| Host | `192.168.1.50` |
| Puerto | `5432` |
| Base de datos de mantenimiento | `postgres` |
| Usuario | `postgres` o usuario de prácticas |
| Contraseña | Se introduce de forma segura |

En esta actividad se comprueba la instalación y el inicio de pgAdmin. La configuración detallada de conexiones remotas se realiza en la UD2.

**Evidencias:** versión o método de instalación, pgAdmin iniciado y descripción del explorador de objetos, editor SQL y herramientas de administración.

## Actividad 3. Instalación de pgAdmin web

Se instala pgAdmin web en Ubuntu Server siguiendo la documentación oficial y el método correspondiente a la versión instalada. Durante el proceso se configura la cuenta inicial de acceso.

Se comprueba el estado del servicio web y los puertos en escucha:

```bash
sudo systemctl status pgadmin4
sudo ss -ltnp
```

El nombre del servicio puede cambiar según el método de instalación. Si `pgadmin4` no existe, se consulta el servicio creado por el paquete instalado.

Desde Ubuntu Mate se abre la URL publicada por el servidor, por ejemplo:

```text
http://192.168.1.50/pgadmin4
```

Se inicia sesión y se comprueba que aparece la interfaz web. El registro del servidor PostgreSQL y las reglas de acceso remoto se trabajarán en la UD2.

**Resultado esperado:** pgAdmin web se muestra en el navegador del cliente y permite iniciar el registro de un servidor.

## Actividad 4. Instalación del cliente `psql`

En Ubuntu Mate se instala el cliente:

```bash
sudo apt update
sudo apt install postgresql-client -y
```

Se comprueba que está disponible:

```bash
psql --version
pg_config --bindir
pg_config --help
```

Si `pg_config` no existe, `psql` puede estar instalado igualmente, ya que `pg_config` suele pertenecer a los paquetes de desarrollo. Para la actividad es suficiente verificar que `psql` funciona.

La conexión al servidor se realiza sin escribir la contraseña en el comando:

```bash
psql --host=192.168.1.50 --port=5432 --username=postgres --dbname=postgres --password
```

Dentro de `psql` se comprueba la sesión:

```text
\conninfo
SELECT version();
\q
```

**Resultado esperado:** el cliente se inicia, solicita la contraseña y permite consultar el servidor cuando este está preparado para aceptar conexiones.

### Evidencias

- Salida de `psql --version`.
- Salida de `pg_config --bindir`, si está disponible.
- Comando de conexión sin incluir la contraseña.
- Salida de `\conninfo` y `SELECT version();`.
- Explicación de la diferencia entre instalar el cliente y configurar el servidor.

## Conclusión

La implantación se considera completada cuando PostgreSQL está instalado en Ubuntu Server, el servidor tiene una dirección identificable, pgAdmin y `psql` están disponibles y el procedimiento queda documentado. Las reglas de acceso, los parámetros de conexión y las comprobaciones de configuración corresponden a las actividades de la UD2.
