# Actividad práctica: conexiones desde clientes a PostgreSQL

Configura y comprueba el acceso desde un equipo cliente Ubuntu MATE a dos servidores PostgreSQL: uno local, en una máquina virtual, y otro en AWS EC2.

![Esquema de la práctica: clientes Ubuntu MATE, servidor local y servidor PostgreSQL en AWS](img/ud2practica.png)

## Objetivos

- Comprobar el estado, la versión y los datos de conexión de ambos servidores.
- Configurar el acceso remoto en `postgresql.conf` y `pg_hba.conf`.
- Permitir el tráfico de red únicamente desde el cliente autorizado.
- Conectar con `psql`, pgAdmin 4 y DBeaver.
- Ejecutar consultas y diagnosticar errores de conexión.

## Entorno y datos necesarios

La práctica utiliza:

| Equipo | Sistema y servidor |
|---|---|
| Cliente | Ubuntu MATE, con `psql`, pgAdmin 4 y DBeaver |
| Servidor local | Máquina virtual Ubuntu Server 22.04 con PostgreSQL 14 |
| Servidor cloud | Instancia AWS EC2 Ubuntu Server 24.04 con PostgreSQL 16 |


## Preparar el entorno de pruebas: base de datos y rol `geo`

Antes de configurar las conexiones desde los clientes, prepara en el servidor PostgreSQL una base de datos de prácticas llamada `geo` y un rol de acceso llamado `geo`.

1. Descarga el fichero SQL proporcionado para la práctica:

   ```bash
   wget https://pastebin.com/raw/UexT4J4w -O dades_geo.sql
   ```

2. Abre una sesión local de `psql` como administrador del servidor:

   ```bash
   sudo -u postgres psql
   ```

3. Desde `psql`, ejecuta el fichero indicando la ruta en la que lo descargaste. Por ejemplo:

   ```text
   \i /home/admin01/dades_geo.sql
   ```

   El script prepara los datos de ejemplo y crea el rol `geo`. Si lo descargaste en otra ubicación, sustituye la ruta del ejemplo por la ruta correcta.

4. Comprueba que existen la base de datos y el rol:

   ```text
   \l
   \du
   ```

5. Asigna una contraseña propia al rol `geo`, sin escribirla en el historial del terminal ni incluirla en el informe:

   ```text
   \password geo
   ```

6. Consulta la ruta del archivo de autenticación activo:

   ```sql
   SHOW hba_file;
   ```

   Anota la ruta que devuelve la consulta y sal de `psql`:

   ```text
   \q
   ```

7. Edita el archivo indicado por `SHOW hba_file;` (no una ruta supuesta). Conserva la regla local del administrador `postgres` y añade una regla específica para el rol y la base de datos de prácticas, antes de cualquier regla local más general:

   ```text
   local    geo    geo    scram-sha-256
   ```

   Recarga la configuración para aplicar el cambio:

   ```bash
   sudo systemctl reload postgresql
   ```

8. Verifica el acceso local con el rol de prácticas:

   ```bash
   psql -U geo -d geo -W
   ```

   Introduce la contraseña cuando `psql` la solicite. No cambies el método de autenticación del rol `postgres`: no es necesario para esta práctica. Más adelante añadirás una regla `host` específica para permitir el acceso remoto desde el cliente.

## 1. Comprobar los servidores

En cada servidor:

1. Comprueba que PostgreSQL está iniciado:

   ```bash
   sudo systemctl status postgresql
   ```

2. Anota la versión instalada:

   ```bash
   psql --version
   ```

3. Desde una sesión local de `psql`, consulta las rutas de los archivos activos:

   ```sql
   SHOW config_file;
   SHOW hba_file;
   ```

4. Anota la dirección IP del servidor, el puerto y los datos de conexión asignados para la práctica.
5. Comprueba que puedes conectarte localmente con el rol y la base de datos de prácticas antes de configurar el acceso remoto.

Guarda las salidas relevantes para documentar el estado inicial.

## 2. Configurar el servidor local

1. Comprueba cómo está conectada la máquina virtual a la red: NAT, puente u otra configuración indicada por el profesor. El cliente Ubuntu MATE debe poder alcanzar la dirección del servidor.
2. Haz una copia de seguridad de los archivos de configuración antes de editarlos.
3. En `postgresql.conf`, configura `listen_addresses` para que PostgreSQL escuche en localhost y en la interfaz de red del servidor. Si se cambia este parámetro, reinicia PostgreSQL:

   ```text
   listen_addresses = 'localhost,<IP_DEL_SERVIDOR_LOCAL>'
   ```

4. En `pg_hba.conf`, añade una regla para la base de datos, el rol y la dirección real del cliente. Usa una máscara `/32` si solo se autoriza un equipo:

   ```text
   host    <BASE_DE_DATOS>    <ROL>    <IP_DEL_CLIENTE>/32    scram-sha-256
   ```

5. Recarga las reglas de acceso:

   ```bash
   sudo systemctl reload postgresql
   ```

6. Si el cambio de `listen_addresses` todavía no se ha aplicado, reinicia el servicio y comprueba su estado:

   ```bash
   sudo systemctl restart postgresql
   sudo systemctl status postgresql
   ```

7. Si el sistema operativo o la red de la máquina virtual filtran conexiones, permite TCP en el puerto `5432` únicamente desde la IP del cliente. No abras el puerto a toda la red si no es necesario.

## 3. Configurar el servidor AWS EC2

1. Confirma que la instancia está iniciada y que PostgreSQL acepta conexiones locales.
2. Haz una copia de seguridad de los archivos de configuración antes de editarlos.
3. En `postgresql.conf`, configura `listen_addresses` para escuchar en localhost y en la dirección de red privada de la instancia:

   ```text
   listen_addresses = 'localhost,<IP_PRIVADA_EC2>'
   ```

4. En `pg_hba.conf`, autoriza solo la base de datos, el rol y la IP pública de salida del cliente:

   ```text
   host    <BASE_DE_DATOS>    <ROL>    <IP_PUBLICA_DEL_CLIENTE>/32    scram-sha-256
   ```

5. En el grupo de seguridad asociado a EC2, añade una regla de entrada con:

   - **Tipo/protocolo:** TCP.
   - **Puerto:** `5432`.
   - **Origen:** IP pública del cliente con máscara `/32`.

   No configures el origen como `0.0.0.0/0`. Utiliza la dirección pública o el DNS público de la instancia como destino solo si la conexión se realiza a través de Internet; en una red privada, usa la dirección privada correspondiente.

6. Recarga PostgreSQL para aplicar `pg_hba.conf`. Si has cambiado `listen_addresses`, reinicia el servicio. Comprueba después el estado:

   ```bash
   sudo systemctl reload postgresql
   sudo systemctl restart postgresql
   sudo systemctl status postgresql
   ```

## 4. Conectar desde las aplicaciones cliente

Desde Ubuntu MATE, intenta conectarte primero al servidor local y después al servidor EC2. En cada cliente utiliza la dirección y el puerto correctos, la base de datos de prácticas y el rol asignado. Introduce la contraseña de forma interactiva o en el campo protegido de la aplicación; no la añadas a la línea de comandos ni la guardes en este documento.

### `psql`

Conecta con una cadena como esta, sustituyendo los valores entre `< >`:

```bash
psql "host=<HOST> port=5432 dbname=<BASE_DE_DATOS> user=<ROL>"
```

Al conectarte, comprueba la sesión con:

```text
\conninfo
```

### pgAdmin 4 y DBeaver

En cada aplicación, crea una conexión al servidor con estos datos:

- **Host:** IP o nombre DNS del servidor.
- **Puerto:** `5432`, salvo que se haya configurado otro.
- **Base de datos:** base de datos asignada para la práctica.
- **Usuario:** rol PostgreSQL de prácticas.
- **Contraseña:** la proporcionada, introducida en el campo protegido de la aplicación.

Conecta desde ambas aplicaciones a los dos servidores. Si una herramienta no está instalada o configurada, indícalo en la entrega en lugar de afirmar que se ha comprobado.

## 5. Verificar las conexiones y diagnosticar

En cada conexión, ejecuta esta consulta:

```sql
SELECT version(),
       inet_server_addr(),
       inet_server_port(),
       current_database(),
       current_user;
```

Comprueba que la versión, la dirección, el puerto, la base de datos y el usuario corresponden al servidor al que te conectaste.

Si hay un error, registra el mensaje y revisa estos puntos:

| Síntoma | Qué comprobar |
|---|---|
| No se establece la conexión o expira el tiempo de espera. | Dirección de destino, puerto, ruta de red, reglas de la máquina virtual y grupo de seguridad de AWS. |
| `no pg_hba.conf entry for host` | Dirección que ve el servidor, base de datos, rol, tipo de conexión y regla en `pg_hba.conf`. |
| `password authentication failed` | Rol, contraseña y método configurado. No cambies la regla a `trust` para resolverlo. |
| El servicio no inicia tras editar la configuración. | Sintaxis y dirección configurada en `listen_addresses`; revisa el estado y los registros antes de seguir. |
| Se editó un archivo pero el cambio no tiene efecto. | Ruta activa consultada con `SHOW config_file;` o `SHOW hba_file;`, y si el parámetro requiere recarga o reinicio. |

## Entrega

Presenta un informe con:

- Un esquema o tabla con los clientes y los dos servidores.
- Versión, dirección, puerto, base de datos y rol utilizados, sin incluir contraseñas.
- Archivos modificados, parámetros y reglas de acceso aplicados.
- Configuración de red de la máquina virtual y regla del grupo de seguridad de AWS, con el origen autorizado expresado como `/32`.
- Resultado de la conexión desde `psql`, pgAdmin 4 y DBeaver a cada servidor.
- Salida de la consulta de comprobación y capturas que no expongan contraseñas ni datos sensibles.
- Incidencias encontradas y cómo las resolviste.

Al terminar, elimina las reglas temporales de red que ya no sean necesarias y restaura cualquier configuración que no deba permanecer activa.
