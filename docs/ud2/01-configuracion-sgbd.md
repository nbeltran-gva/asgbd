# 1. Configuración inicial de un SGBD

Tras instalar PostgreSQL y sus clientes, es necesario configurar el servidor para adaptarlo a las necesidades del entorno.

La configuración permite controlar principalmente:

- 🔌 Conexiones locales y remotas.
- 🔐 Autenticación y seguridad.
- ⚙️ Recursos y funcionamiento del servidor.
- 🖥️ Acceso de los clientes al SGBD.

Los cambios se realizan principalmente mediante archivos de configuración. Por ello, antes de modificar cualquier parámetro es recomendable:

1. Localizar los archivos de configuración de PostgreSQL.
2. Realizar una copia de seguridad.
3. Modificar los parámetros necesarios.
4. Comprobar que el servicio continúa funcionando correctamente.
5. Verificar que los clientes pueden conectarse al servidor.

## Principales archivos de configuración

PostgreSQL utiliza varios archivos para configurar el funcionamiento del servidor. Los principales son:

| Archivo | Función |
|---|---|
| `postgresql.conf` | Configuración general del servidor: conexiones, memoria, registros, etc. |
| `pg_hba.conf` | Define cómo se autentican y qué clientes pueden conectarse al servidor. |
| `pg_ident.conf` | Define mapeos entre usuarios del sistema operativo y roles de PostgreSQL, cuando se utilizan determinados métodos de autenticación (ident/peer). |

En esta unidad nos centraremos principalmente en `postgresql.conf` y `pg_hba.conf`, ya que son los archivos más utilizados en la administración del servidor.

#### Localización

La ubicación de los archivos de configuración de PostgreSQL depende de la distribución, la versión y el método de instalación. En Ubuntu, una instalación estándar con paquetes del sistema suele utilizar una ruta como:

```text
/etc/postgresql/16/main/
```
Sin embargo, **no conviene asumir una ruta concreta sin comprobarla**. PostgreSQL permite consultar directamente la ubicación real de sus archivos mediante SQL:

```sql
SHOW config_file;
SHOW hba_file;
SHOW ident_file;
SHOW data_directory;
```
También pueden consultarse a través del Shell con `psql`:

```bash
sudo -u postgres psql -c "SHOW config_file;"
sudo -u postgres psql -c "SHOW hba_file;"
sudo -u postgres psql -c "SHOW ident_file;"
sudo -u postgres psql -c "SHOW data_directory;"
```
Estas consultas permiten conocer la configuración real del servidor, especialmente cuando existen varias versiones o varios clústeres de PostgreSQL.

Los parámetros de configuración más relevantes son:

- `config_file`: indica el archivo principal de configuración (`postgresql.conf`);
- `hba_file`: indica el archivo de control de autenticación y acceso (`pg_hba.conf`);
- `ident_file`: indica el archivo de mapeo de usuarios (`pg_ident.conf`);
- `data_directory`: indica el directorio donde se almacenan las bases de datos del clúster (no un archivo de configuración). 

Es importante tener en cuenta que algunos de estos datos solo pueden configurarse al iniciar el servidor, por lo que es recomendable comprobar su valor antes de modificar cualquier parámetro.

---

## Copias de seguridad

Antes de modificar los archivos de configuración de PostgreSQL, es recomendable realizar una **copia de seguridad**.

Por ejemplo:

```bash
sudo cp /ruta/postgresql.conf /ruta/postgresql.conf.bak
```
---

## Aplicación de cambios

Después de realizar los cambios, hay que **recargar o reiniciar el servicio**, según el parámetro modificado:

```bash
sudo systemctl reload postgresql
```
La recarga es suficiente para los parámetros que PostgreSQL permite aplicar sin reiniciar. Si el cambio requiere un reinicio:

```bash
sudo systemctl restart postgresql
```
Finalmente, se debe comprobar que el servicio funciona correctamente:

```bash
sudo systemctl status postgresql
```
---

## Buenas prácticas

Al configurar PostgreSQL, es recomendable seguir estas buenas prácticas:

- Modificar pocos parámetros cada vez.
- Comprobar el funcionamiento después de cada cambio.
- Mantener un registro de las modificaciones realizadas.
- Utilizar comentarios para documentar configuraciones especiales.
- Consultar previamente la ubicación real de los archivos

---
