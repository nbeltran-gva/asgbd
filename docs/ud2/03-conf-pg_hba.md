# 3. Archivo de configuración `pg_hba.conf`

El archivo `pg_hba.conf` (*Host-Based Authentication*) define las **reglas de acceso y autenticación** de los clientes que intentan conectarse a PostgreSQL.

A diferencia de `postgresql.conf`, que configura el funcionamiento general del servidor, `pg_hba.conf` determina **qué conexiones se permiten y cómo deben autenticarse**.

!!! info "¿Qué controla `pg_hba.conf`?"

    Cada regla indica:

    - qué tipo de conexión se realiza;
    - a qué base de datos se quiere acceder;
    - qué usuario intenta conectarse;
    - desde qué dirección se realiza la conexión;
    - qué método de autenticación se utilizará.

---

## Regla de acceso y autenticación

Cada línea contiene una regla con la siguiente estructura:

```text
tipo_conexión   base_de_datos   usuario   dirección_cliente   método_autenticación
```

Por ejemplo:

```text
host    all    all    192.168.1.0/24    scram-sha-256
```

Esta regla permite conexiones **TCP/IP** desde la red `192.168.1.0/24` a cualquier base de datos y usuario, utilizando autenticación mediante `scram-sha-256`.

## 1. Tipos de conexión

El primer campo de cada regla indica el tipo de conexión. Los más habituales son:

| Tipo | Descripción |
|---|---|
| `local` | Conexión realizada desde el propio servidor mediante **socket Unix**. |
| `host` | Conexión mediante **TCP/IP**, normalmente desde otro equipo o aplicación cliente. |
| `hostssl` | Conexión TCP/IP utilizando **SSL/TLS**. |
| `hostnossl` | Conexión TCP/IP sin SSL/TLS. |

Por ejemplo:

```text
local   all   all                         peer
host    all   all   192.168.1.0/24        scram-sha-256
```

- La primera regla se aplica a conexiones locales mediante socket Unix.
- La segunda se aplica a conexiones TCP/IP procedentes de la red indicada.

!!! note "Importante"

    La **dirección del cliente** solo se especifica en las reglas de tipo `host`, `hostssl` y `hostnossl`. Las conexiones `local` utilizan sockets Unix y no necesitan una dirección IP.

---

## 2. Base de datos

El segundo campo indica a qué **bases de datos** se aplica la regla.

Se puede utilizar:

- `all`: cualquier base de datos;
- un nombre concreto, como `postgres`, `geo` o `appdb`;
- una lista de bases de datos separadas por comas;
- `sameuser`: una base de datos cuyo nombre coincide con el usuario que realiza la conexión;
- `samerole`: bases de datos cuyo nombre coincide con un rol al que pertenece el usuario.

Por ejemplo, esta regla se aplica a **cualquier base de datos**:

```text
host    all      all       192.168.1.0/24    scram-sha-256
```
En cambio, con esta regla solo se aplica cuando el usuario `app_user` intenta acceder a la base de datos `appdb` desde una dirección perteneciente a `10.0.0.0/8`:

```text
host    appdb    app_user    10.0.0.0/8      scram-sha-256
```

!!! tip "Buena práctica"

    En un entorno real es preferible especificar las bases de datos que realmente necesitan los clientes en lugar de utilizar `all` sin necesidad.

---

## 3. Usuario

El tercer campo especifica **qué usuarios o roles de PostgreSQL** quedan cubiertos por la regla.

Se puede utilizar:

- `all`: cualquier usuario;
- un nombre concreto, como `postgres`, `app_user` o `pepe`;
- una lista de usuarios separada por comas.

Por ejemplo:

```text
local   all   postgres       peer
host    all   app_user      192.168.1.0/24    scram-sha-256
```

En este caso:

- `postgres` puede conectarse localmente mediante `peer`;
- `app_user` puede conectarse desde la red `192.168.1.0/24` utilizando `scram-sha-256`.

Con el método `peer`, PostgreSQL comprueba el usuario del sistema operativo y establece la correspondencia con el rol de PostgreSQL.

!!! warning "No basta con que exista el usuario"

    Que un usuario esté creado en PostgreSQL no significa que pueda conectarse desde cualquier lugar.

    La conexión debe coincidir con alguna regla de `pg_hba.conf`.

---

## 4. Dirección del cliente y máscaras de red

En las reglas `host`, `hostssl` y `hostnossl` se puede indicar desde qué **direcciones IP o redes** se permite la conexión.

La dirección puede expresarse mediante:

- una dirección IP y una máscara tradicional;
- notación CIDR, que es la forma más habitual.

### Una única dirección IP

Para permitir el acceso únicamente desde una dirección concreta se utiliza `/32`.

Por ejemplo, para representar únicamente la dirección `192.168.1.50` se pueden utilizar estas dos direcciones.
:

```text
192.168.1.50/32
192.168.1.50 255.255.255.255
```

### Una red completa

Para permitir conexiones desde una red completa se utiliza la dirección de red junto con su máscara.

Por ejemplo, ambas son equivalentes:

```text
10.0.0.0/8
10.0.0.0 255.0.0.0
```

### Una red local `/24`

Un caso frecuente es permitir conexiones desde todos los equipos de una red local:

Por ejemplo, ambas son equivalentes:

```text
192.168.1.0/24
192.168.1.0 255.255.255.0
```

En este caso, la red abarca las direcciones `192.168.1.0` a `192.168.1.255`; las direcciones disponibles para equipos dependen de la configuración concreta de la red.

!!! info "Máscaras CIDR"

    El número situado después de `/` indica cuántos bits de la dirección IP corresponden a la parte de red.

    - `/32` → una única dirección IP.
    - `/24` → una red como `192.168.1.0/24`.
    - `/8` → una red mucho más amplia como `10.0.0.0/8`.

    Cuanto **menor** es el número después de `/`, mayor es el rango de direcciones representado.

---

## 5. Métodos de autenticación

El último campo indica **cómo se autentica el usuario**.

| Método | Función |
|---|---|
| `peer` | Comprueba la identidad del usuario del sistema operativo en conexiones locales mediante socket Unix. |
| `scram-sha-256` | Autenticación mediante contraseña utilizando el mecanismo SCRAM. Es la opción recomendada actualmente. |
| `password` | Solicita la contraseña al cliente. La contraseña se transmite sin cifrar por el protocolo de autenticación, por lo que debe utilizarse con especial precaución y preferentemente mediante una conexión protegida con SSL/TLS. |
| `reject` | Rechaza siempre las conexiones que coincidan con la regla. |
| `trust` | Permite la conexión sin solicitar autenticación. Debe utilizarse únicamente en situaciones controladas. |

!!! warning "Evita `trust` en entornos reales"

    Una regla como:

    ```text
    host    all    all    192.168.1.0/24    trust
    ```

    permite que cualquier usuario que cumpla el resto de condiciones se conecte sin proporcionar una contraseña.

---

## Orden de las reglas

**El orden de las reglas es fundamental.**

PostgreSQL analiza las reglas **de arriba hacia abajo** y utiliza **la primera regla que coincide** con la conexión.

Por ejemplo:

```text
host    all    all    192.168.1.0/24    scram-sha-256
host    all    all    192.168.1.50/32  trust
```

Una conexión procedente de `192.168.1.50` coincide con **las dos reglas**, pero PostgreSQL utilizará la primera. Por tanto, solicitará autenticación mediante `scram-sha-256`.

Si queremos aplicar una regla específica a `192.168.1.50`, debemos colocarla **antes** de la regla general y quedaría así la nueva configuración:

```text
host    all    all    192.168.1.50/32  trust
host    all    all    192.168.1.0/24   scram-sha-256
```

!!! warning "Regla fundamental"

    PostgreSQL **no selecciona automáticamente la regla más específica**.
    Utiliza la **primera regla que coincide**.
    Además, si una regla coincide pero la autenticación falla, PostgreSQL **no continúa buscando otra regla**.

---

## Comentarios y líneas en blanco

Las **líneas en blanco** se ignoran.

Los **comentarios** comienzan con `#`:

```text
# Permitir conexiones desde la red local
host    all    all    192.168.1.0/24    scram-sha-256
```

También pueden utilizarse comentarios al final de una regla:

```text
host    all    all    192.168.1.0/24    scram-sha-256    # Red local
```

Una **regla larga** puede dividirse en varias líneas utilizando una barra invertida `\` al final de la línea:

```text
host    all    all    192.168.1.0/24 \
        scram-sha-256
```

La barra invertida `\` indica que la regla continúa en la siguiente línea. PostgreSQL interpreta ambas líneas como una única regla. **Importante:** no debe haber texto después de la barra invertida `\`.

---

## Valores especiales

Algunos campos permiten utilizar valores especiales:

- `all` → coincide con cualquier base de datos o usuario, según el campo.
- `replication` → se utiliza en reglas relacionadas con conexiones de replicación.
- `sameuser` → permite hacer referencia a una base de datos cuyo nombre coincide con el usuario.
- `samerole` → permite hacer referencia a bases de datos asociadas al nombre de un rol al que pertenece el usuario.

---

## Ejemplo de configuración

Una configuración sencilla podría ser:

```text
# Conexiones locales del superusuario
local   all   postgres                         scram-sha-256

# Otros usuarios locales
local   all   all                              peer

# Conexiones desde la red local
host    all   all   192.168.1.0/24             scram-sha-256
```

En este ejemplo:

- `postgres` puede conectarse localmente utilizando contraseña.
- Los demás usuarios locales utilizan `peer`.
- Los clientes de la red `192.168.1.0/24` deben autenticarse mediante `scram-sha-256`.
- Una conexión que no coincida con ninguna regla será rechazada.

Para establecer o cambiar la contraseña del usuario `postgres` desde `psql`:

```sql
\password postgres
```

El comando solicita la nueva contraseña sin mostrarla en pantalla.

!!! tip "Buenas prácticas"

    - Utiliza `scram-sha-256` para autenticación mediante contraseña.
    - Evita `trust` salvo en situaciones muy controladas.
    - Limita las bases de datos, usuarios y redes a los que realmente sea necesario permitir el acceso.
    - Evita utilizar el superusuario `postgres` para las aplicaciones.
    - No incluyas contraseñas reales en apuntes, scripts o repositorios públicos.

---

## Aplicar los cambios

Después de modificar `pg_hba.conf`, normalmente es suficiente con **recargar la configuración**:

```bash
sudo systemctl reload postgresql
```

La recarga permite que PostgreSQL vuelva a leer el archivo sin detener el servidor.

Para comprobar el estado del servicio:

```bash
sudo systemctl status postgresql
```

## Documentación oficial

Para consultar todas las opciones disponibles:

[PostgreSQL 16 – The pg_hba.conf File](https://www.postgresql.org/docs/16/auth-pg-hba-conf.html)