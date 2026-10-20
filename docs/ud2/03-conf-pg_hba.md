# 3. Archivo de configuración `pg_hba.conf`

El archivo `pg_hba.conf` (*Host-Based Authentication*) define las **reglas de acceso y autenticación** de los clientes que intentan conectarse a PostgreSQL. 

A diferencia de `postgresql.conf`, que configura el funcionamiento general del servidor, `pg_hba.conf` determina **qué conexiones se permiten y cómo deben autenticarse**.

!!! info "Importante"

    El archivo `pg_hba.conf` no hace que PostgreSQL escuche en una red. 

    Para aceptar conexiones remotas también es necesario configurar:

    - `listen_addresses` en `postgresql.conf` determina **desde dónde** se aceptan conexiones.
    - las reglas del firewall
    - la conectividad de red

    `pg_hba.conf` únicamente determina **qué clientes** podrán autenticarse una vez que la conexión llegue al servidor.

---

## Reglas de acceso y autenticación

Cada línea del archivo `pg_hba.conf` define una regla que indica quién puede conectarse a PostgreSQL y cómo debe autenticarse.

La estructura general es la siguiente:

```text
tipo_conexión   base_de_datos   usuario   dirección_cliente   método_autenticación
```
Cada campo especifica:

- el tipo de conexión que se realiza;
- la base de datos a la que se desea acceder;
- el usuario que intenta conectarse;
- la dirección desde la que se establece la conexión;
- el método de autenticación que se utilizará.

_Por ejemplo:_

```text
#TYPE   DATABASE    USER    ADDRESS             METHOD
host    all         all     192.168.1.0/24      scram-sha-256
```
_Esta regla define las condiciones bajo las que PostgreSQL aceptará y autenticará una conexión desde la red `192.168.1.0/24` a cualquier base de datos y usuario, utilizando el método de autenticación mediante `scram-sha-256`._

A continuación, analizaremos cada elemento de la regla por separado.

### 1. Tipos de conexión

El primer campo de cada regla indica el tipo de conexión. Los más habituales son:

| Tipo de conexión | Descripción | ¿Se especifica la dirección del cliente? |
|---|---|---|
| `local` | Conexión realizada desde el propio servidor mediante **socket Unix**. | ❌No; utiliza un socket Unix y no necesita dirección IP. |
| `host` | Conexión mediante **TCP/IP**, normalmente desde otro equipo o aplicación cliente. | ✅Sí. |
| `hostssl` | Conexión TCP/IP utilizando **SSL/TLS**. | ✅Sí. |
| `hostnossl` | Conexión TCP/IP **sin SSL/TLS**. | ✅Sí. |

_Por ejemplo:_

```text
#TYPE   DATABASE    USER    ADDRESS             METHOD
local   all         all                         peer
host    all         all     192.168.1.0/24      scram-sha-256
```

_La primera regla se aplica a conexiones locales mediante socket Unix. La segunda se aplica a conexiones TCP/IP procedentes de la red indicada._

---

### 2. Base de datos

El segundo campo indica a qué **bases de datos** se aplica la regla.

Se puede utilizar:

- `all`: cualquier base de datos;
- un nombre concreto, como `postgres`, `geo` o `appdb`;
- una lista de bases de datos separadas por comas;
- `sameuser`: una base de datos cuyo nombre coincide con el usuario que realiza la conexión;
- `samerole`: bases de datos cuyo nombre coincide con un rol al que pertenece el usuario.
- `replication`: para las conexiones de replicación física. No equivale a `all`.

_Por ejemplo, esta regla se aplica a **cualquier base de datos**:_

```text
#TYPE   DATABASE    USER    ADDRESS             METHOD
host    all         all     192.168.1.0/24      scram-sha-256
```
_En cambio, con esta regla solo se aplica cuando el usuario `app_user` intenta acceder a la base de datos `appdb` desde una dirección perteneciente a `10.0.0.0/8`:_

```text
#TYPE   DATABASE    USER        ADDRESS         METHOD
host    appdb       app_user    10.0.0.0/8      scram-sha-256
```

!!! tip "Buena práctica"

    En un entorno real es preferible especificar las bases de datos que realmente necesitan los clientes en lugar de utilizar `all` sin necesidad.

---

### 3. Usuario

El tercer campo especifica **a qué usuarios o roles de PostgreSQL se aplica la regla**.

En PostgreSQL, los usuarios se implementan mediante roles con permiso de inicio de sesión (`LOGIN`). Por simplicidad, en este apartado utilizaremos el término *usuario*.

Se puede utilizar:

- `all`: cualquier usuario;
- un nombre concreto, como `postgres`, `app_user` o `pepe`;
- una lista de usuarios separada por comas.

*Por ejemplo:*

```text
#TYPE   DATABASE    USER                        ADDRESS         METHOD
local   all         postgres                                    peer
host    all         app_user                    192.168.1.0/24  scram-sha-256
host    all         web_user,report_user        10.0.0.0/8      scram-sha-256
```
*En este caso:*

- **postgres** puede conectarse localmente mediante `peer`. Con este método, PostgreSQL comprueba la identidad del usuario del sistema operativo y permite la conexión si existe un rol con el mismo nombre.
- **app_user** puede conectarse desde la red 192.168.1.0/24 utilizando scram-sha-256, es decir, mediante autenticación por contraseña.
- Esta regla permite que los usuarios:**web_user, report_user** se conecten desde cualquier equipo de la red 10.0.0.0/8 utilizando autenticación mediante scram-sha-256. 

Este ejemplo permite comentar que los usuarios de aplicaciones web (web_user) y generación de informes (report_user) podrían encontrarse en una red corporativa distinta de la utilizada por la aplicación principal (app_user), algo habitual en entornos empresariales.

!!! warning "No basta con que exista el usuario"

    Que un usuario esté creado en PostgreSQL no significa que pueda conectarse desde cualquier lugar. Para poder acceder al servidor, la conexión debe coincidir con alguna de las reglas definidas en `pg_hba.conf`.

---

### 4. Dirección IP del cliente y máscaras de red

En las reglas con conexiones **host, hostssl y hostnossl**, el campo ADDRESS permite especificar desde qué direcciones IP o redes se aceptarán conexiones al servidor PostgreSQL.

PostgreSQL comparará la dirección IP del cliente con las reglas definidas en `pg_hba.conf` para determinar si se permite o se rechaza la conexión.

La dirección IP puede expresarse de dos formas en este archivo:

- Mediante una dirección IP y una máscara de red tradicional
- Mediante notación CIDR, que es la forma más habitual y recomendada

Veamos la tabla según los tipos de acceso:

| Tipo de acceso | Notación CIDR | Máscara equivalente | Descripción |
|---------------|---------------|---------------------|-------------|
| Equipo concreto | `192.168.1.50/32` | `192.168.1.50 255.255.255.255` | Permite conexiones únicamente desde la dirección IP `192.168.1.50`. |
| Red local | `192.168.1.0/24` | `192.168.1.0 255.255.255.0` | Permite conexiones desde cualquier equipo de la red `192.168.1.0/24`. |
| Red amplia | `10.0.0.0/8` | `10.0.0.0 255.0.0.0` | Permite conexiones desde cualquier equipo de la red `10.0.0.0/8`. |
| Cualquier dirección IPv4 | `0.0.0.0/0` | `0.0.0.0 0.0.0.0` | Permite conexiones desde cualquier dirección IPv4. Debe utilizarse únicamente cuando sea realmente necesario y acompañado de mecanismos adicionales de protección, como autenticación segura, cortafuegos y segmentación de red. |


!!! info "Máscaras CIDR"
   
    - `/32` → una única dirección IP. 
    - `/24` → una red local (256 direcciones). 
    - `/8` → una red muy amplia. 
    - `/0` → cualquier dirección IPv4.

    - Cuanto mayor es el número después de /, más específica es la regla y menor es el número de direcciones permitidas.
    - Cuanto menor es el número después de `/`, mayor es el rango de direcciones representado.

Por ejemplo, supongamos que queremos permitir conexiones a PostgreSQL desde cualquier equipo de la red local `192.168.1.0/24`.

Para ello, añadimos la siguiente regla al archivo `pg_hba.conf`:

```text
#TYPE   DATABASE    USER   ADDRESS           METHOD
host    all         all    192.168.1.0/24    scram-sha-256
```

Para este ejemplo:

- Permitida: 192.168.1.50 ✅
- Permitida: 192.168.1.125 ✅
- Rechazada: 192.168.2.50 ❌


Hoy PostgreSQL soporta IPv6 de forma nativa.


### 5. Métodos de autenticación

El último campo indica **cómo se autentica el usuario**.

| Método | Tipo | Seguridad de autenticación | Función |
|---------|------|---------------------------|---------|
| `scram-sha-256` | Autenticación  (contraseña) | Muy alta | Autenticación mediante contraseña utilizando el mecanismo SCRAM basado en SHA-256. Es el método recomendado actualmente. |
| `peer` | Autenticación | Alta | Comprueba la identidad del usuario del sistema operativo en conexiones locales mediante sockets Unix. |
| `md5` | Autenticación (contraseña) | Media | Autenticación mediante contraseña utilizando hash MD5. Se mantiene por compatibilidad, pero se recomienda migrar a SCRAM. |
| `ident` | Autenticación | Media-Baja | Obtiene la identidad del usuario remoto mediante el protocolo Ident. Actualmente está prácticamente en desuso. |
| `password` | Autenticación (contraseña sin cifrar) | Baja | Solicita la contraseña al cliente. Debe emplearse únicamente sobre conexiones protegidas mediante SSL/TLS. |
| `trust` | Autenticación | Nula | Permite la conexión sin verificar la identidad del usuario. Solo apto para pruebas y entornos controlados. |
| `reject` | Control de acceso | No aplica | Rechaza siempre las conexiones que coincidan con la regla. No autentica usuarios. |

---

## Orden de evaluación de las reglas

El orden de las reglas en `pg_hba.conf` es fundamental para comprender cómo PostgreSQL decide si una conexión puede autenticarse.

Cuando un cliente intenta conectarse, PostgreSQL:

- analiza las reglas de arriba hacia abajo;
- busca la primera regla que coincide con las características de la conexión;
- aplica el método de autenticación definido en esa regla;
- no continúa evaluando otras reglas aunque la autenticación falle.

Si la conexión no coincide con ninguna regla definida en pg_hba.conf, PostgreSQL la rechazará automáticamente. El mensaje de error suele ser similar al siguiente: **FATAL: no pg_hba.conf entry for host ...**

**Ejemplo 1: no existe ninguna regla que coincida**

Supongamos que el archivo pg_hba.conf contiene únicamente la siguiente regla:

```text
#TYPE   DATABASE    USER   ADDRESS          METHOD
host    all         all    192.168.1.0/24   scram-sha-256
```
Un usuario intenta conectarse desde la dirección IP 192.168.2.50
Como la dirección 192.168.2.50 no pertenece a la red 192.168.1.0/24, ninguna regla coincide con la conexión.
PostgreSQL mostrará un mensaje similar al siguiente:

```text
FATAL: no pg_hba.conf entry for host "192.168.2.50",
user "app_user",
database "appdb",
SSL encryption
```

Este error indica que PostgreSQL ha recibido la conexión, pero no ha encontrado ninguna regla válida en pg_hba.conf que permita autenticar al cliente. En este caso, el problema suele estar en la dirección IP, el usuario, la base de datos o el orden de las reglas definidas.

**Ejemplo 2: la regla coincide, pero la autenticación falla.**

Supongamos ahora la siguiente configuración:

```text
#TYPE   DATABASE    USER   ADDRESS          METHOD
host    all         all    192.168.1.0/24   scram-sha-256
```

Un usuario se conecta desde la dirección IP 192.168.1.50.
En este caso, la conexión sí coincide con la regla definida y PostgreSQL solicita autenticación mediante scram-sha-256.

Sin embargo, el usuario introduce una contraseña incorrecta.
El resultado será un error similar a:

```text
FATAL: password authentication failed for user "app_user"
```

Es importante entender que PostgreSQL no seguirá buscando otras reglas después de este error. Aunque existieran reglas posteriores en el archivo, no se evaluarían porque ya se encontró una coincidencia y el proceso de autenticación ha fallado.

**Ejemplo 3: varias reglas coinciden**

Consideremos ahora la siguiente configuración:

```text
#TYPE   DATABASE    USER   ADDRESS          METHOD
host    all         all    192.168.1.0/24   scram-sha-256
host    all         all    192.168.1.50/32  trust
```

Una conexión procedente de 192.168.1.50 coincide con ambas reglas. Sin embargo, PostgreSQL aplicará la primera coincidencia, por lo que solicitará autenticación mediante scram-sha-256.

Si queremos aplicar una regla específica para 192.168.1.50, debemos colocarla antes de la regla general:

```text
#TYPE   DATABASE    USER   ADDRESS          METHOD
host    all         all    192.168.1.50/32  trust
host    all         all    192.168.1.0/24   scram-sha-256
```
En resumen:

!!! warning "Orden de evaluación de las reglas"

    - PostgreSQL **no selecciona automáticamente la regla más específica**.
    - Utiliza la **primera regla que coincide**.
    - Si una regla coincide pero la autenticación falla, PostgreSQL **no continúa buscando otra regla**.
    - Si ninguna regla coincide, la conexión se rechaza con el error: `FATAL: no pg_hba.conf entry for host ...`.

---

## Comentarios y líneas en blanco

- Las **líneas en blanco** se ignoran.

- Los **comentarios** comienzan con `#`:

```text
# Permitir conexiones desde la red local
host    all         all    192.168.1.0/24   scram-sha-256
```

También pueden utilizarse comentarios al final de una regla:

```text
host    all         all    192.168.1.0/24   scram-sha-256    # Red local
```

- Una **regla larga** puede dividirse en varias líneas utilizando una barra invertida `\` al final de la línea:

```text
host    all    all    192.168.1.0/24 \
        scram-sha-256
```

La barra invertida `\` indica que la regla continúa en la siguiente línea. PostgreSQL interpreta ambas líneas como una única regla. **Importante:** no debe haber texto después de la barra invertida `\`.

---

## Diagnóstico rápido de problemas

| Error o síntoma | Revisar | Solución |
|-----------------|----------|----------|
| Los cambios realizados en `pg_hba.conf` no tienen efecto. | Que se está editando el archivo correcto. | Comprobar la ruta activa con `SHOW hba_file;` y editar ese archivo. |
| Las nuevas reglas no se aplican. | Que se ha recargado la configuración. | Ejecutar `sudo systemctl reload postgresql`. |
| `FATAL: no pg_hba.conf entry for host ...` | Dirección IP, máscara de red, usuario, base de datos y tipo de conexión. | Crear o corregir una regla que coincida con la conexión solicitada. |
| `FATAL: password authentication failed for user ...` | Contraseña del usuario y método de autenticación configurado. | Verificar la contraseña o asignar una nueva al usuario. |
| `FATAL: Peer authentication failed for user ...` | Uso del método `peer` y correspondencia entre usuario del sistema operativo y rol PostgreSQL. | Utilizar el mismo nombre de usuario o cambiar a un método basado en contraseña. |
| No se puede conectar desde otro equipo. | `listen_addresses`, cortafuegos, conectividad de red y reglas de `pg_hba.conf`. | Configurar `listen_addresses`, abrir el puerto necesario y comprobar la red. |
| Una regla aparentemente correcta no se aplica. | Orden de las reglas en `pg_hba.conf`. | Colocar la regla específica antes de la regla general. |
| Una conexión SSL no funciona. | Uso correcto de `host`, `hostssl` o `hostnossl`. | Utilizar el tipo de regla adecuado al tipo de conexión. |
| Un usuario existente no puede conectarse. | Que la regla permite ese usuario y la base de datos solicitada. | Modificar la regla o crear una nueva para ese usuario y base de datos. |
| Se puede acceder sin contraseña. | Uso del método `trust`. | Sustituir `trust` por `scram-sha-256` u otro método seguro. |
| Se aceptan conexiones desde demasiadas direcciones. | Uso de redes excesivamente amplias como `0.0.0.0/0`. | Restringir el acceso a las IP o redes que realmente lo necesiten. |


## Buenas prácticas

- Utiliza scram-sha-256 para la autenticación mediante contraseña.
- Evita el método trust excepto en entornos de laboratorio muy controlados.
- Limita las redes, usuarios y bases de datos a los que realmente necesiten acceso.
- Coloca las reglas más específicas antes que las más generales.
- Evita utilizar el superusuario postgres para las aplicaciones.
- No almacenes contraseñas reales en scripts, apuntes o repositorios públicos.
 - Utiliza direcciones y máscaras de red lo más restrictivas posible.
 - Recarga la configuración después de modificar pg_hba.conf.

## Ejemplo de configuración básica

Supongamos un servidor PostgreSQL utilizado en una pequeña organización con los siguientes requisitos:

- El administrador quiere acceder localmente con el usuario `postgres` utilizando contraseña.
- Los usuarios locales del sistema operativo pueden autenticarse mediante `peer`.
- Los equipos de la red local `192.168.1.0/24` pueden conectarse remotamente utilizando contraseña.
- No se permiten conexiones desde otras redes.

Una posible configuración de `pg_hba.conf` sería:

```text
#TYPE   DATABASE    USER        ADDRESS             METHOD
local   all         postgres                        scram-sha-256
local   all         all                             peer
host    all         all         192.168.1.0/24      scram-sha-256
```

**Autenticación del usuario `postgres`**

En este ejemplo, la regla:

```text
#TYPE   DATABASE    USER        ADDRESS             METHOD
local   all         postgres                        scram-sha-256
```

requiere que el usuario `postgres` tenga una contraseña definida en PostgreSQL.

Por ejemplo, desde `psql` es posible asignar o modificar la contraseña utilizando el siguiente comando:

```sql
\password postgres
```

Este comando solicita la nueva contraseña de forma interactiva sin mostrarla en pantalla.

También es posible realizar la misma operación mediante una sentencia SQL:

```sql
ALTER ROLE postgres 
WITH PASSWORD 'nueva_contraseña';
```

Tras ejecutar cualquiera de estas opciones, PostgreSQL almacenará la contraseña utilizando el método de cifrado configurado en el parámetro `password_encryption`, que en las versiones actuales suele ser `scram-sha-256`.

**La gestión de usuarios, roles y contraseñas se estudiará en una unidad posterior dedicada a la administración de usuarios y permisos en PostgreSQL.**