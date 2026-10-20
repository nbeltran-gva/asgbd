# 4. Archivo de configuración `pg_ident.conf`

El archivo `pg_ident.conf` define **mapas de nombres de usuario**, es decir, relaciona una cuenta del sistema operativo (identidad externa) con un rol de PostgreSQL. 

Su función principal es traducir un nombre de usuario obtenido mediante determinados métodos de autenticación, como `peer` e `ident`, a un rol de PostgreSQL autorizado para iniciar sesión.

!!! info "Importante"

    `pg_ident.conf` no concede permisos sobre las bases de datos ni controla qué conexiones están permitidas. Su única función es establecer correspondencias entre identidades externas y roles PostgreSQL.

Para que un mapa pueda utilizarse, primero debe existir una regla en `pg_hba.conf` que permita la conexión y haga referencia explícita al mapa.

| Archivo | Función |
|---|---|
| `pg_hba.conf` | Determina qué conexiones están permitidas y qué método de autenticación se utilizará. |
| `pg_ident.conf` | Traduce nombres de usuario del sistema operativo a roles de PostgreSQL. |


## Formato del archivo

Cada entrada de `pg_ident.conf` tiene tres campos separados por espacios o tabuladores:

```text
nombre_mapa    usuario_sistema    usuario_postgresql
```
Donde:

- `nombre_mapa`: nombre elegido para identificar el conjunto de correspondencias.
- `usuario_sistema`: cuenta del sistema operativo o nombre externo recibido por el método de autenticación.
- `usuario_postgresql`: rol al que se permite conectarse con esa identidad.

Por ejemplo:

```text
# MAPNAME             SYSTEM-USERNAME    DATABASE-USERNAME
usuarios_locales     ignac              app_user
```

Esta entrada indica que el usuario del sistema `ignac` puede autenticarse como el rol PostgreSQL `app_user` cuando se utilice el mapa `usuarios_locales`.

Se pueden incluir varias correspondencias bajo el mismo nombre de mapa:

```text
# MAPNAME            SYSTEM-USERNAME    DATABASE-USERNAME
usuarios_locales     ignac              app_user
usuarios_locales     marta              informes
```

Las líneas en blanco se ignoran y los comentarios comienzan con `#`.

## ¿Cuándo es necesario utilizar pg_ident.conf?

En muchas instalaciones de PostgreSQL no es necesario utilizar este archivo.

Por ejemplo, cuando se emplea autenticación peer, PostgreSQL espera que el nombre del usuario del sistema operativo coincida con el nombre del rol 
PostgreSQL:

```text
Usuario Linux: ignac
Rol PostgreSQL: ignac
```

Configuración:

```text
local all all peer
```

En este caso no se necesita ningún mapa.

**Los mapas se utilizan cuando la identidad externa y el rol PostgreSQL tienen nombres diferentes.**

Por ejemplo:

```text
Usuario Linux: ignac
Rol PostgreSQL: app_user
```

En esta situación es necesario crear una correspondencia en `pg_ident.conf`.

### Relación entre archivos

El siguiente esquema resume el proceso de autenticación:

```text
Usuario del sistema
       ignac
          │
          ▼
pg_hba.conf
peer map=usuarios_locales
          │
          ▼
pg_ident.conf
ignac → app_user
          │
          ▼
Rol PostgreSQL
app_user
```

!!! important "Éxito de la autenticación"
   
    Para que un mapeo se aplique, deben cumplirse estas condiciones:

    1. La conexión debe coincidir con una regla de `pg_hba.conf`.
    2. La regla debe utilizar un método compatible con una identidad externa, como `peer` o `ident`.
    3. La regla debe indicar el nombre del mapa mediante `map=nombre_mapa`.
    4. `pg_ident.conf` debe contener una entrada que relacione el nombre externo con el rol solicitado.

Por ejemplo, estas dos líneas deben utilizar el mismo nombre de mapa:

```text
# pg_hba.conf
local    appdb    app_user             peer map=usuarios_locales
```

```text
# pg_ident.conf
usuarios_locales    ignac    app_user
```

Si el nombre del mapa no coincide, falta la entrada o la identidad externa no corresponde con el rol solicitado, PostgreSQL rechazará la autenticación. El mapa solo establece esa correspondencia: no crea el rol ni le concede permisos. Para conectarse, el rol debe existir y tener el atributo `LOGIN`; para trabajar con la base de datos y sus objetos, además necesita los privilegios correspondientes.

## Uso con `peer` en conexiones locales

El método `peer` se aplica a conexiones locales mediante socket Unix. PostgreSQL obtiene del sistema operativo la identidad del usuario que ejecuta el cliente y la compara con el rol solicitado.

#### Utilizando un mapa de usuarios

Si los nombres son distintos, se puede especificar un mapa con la opción `map` de la regla en `pg_hba.conf`:

```text
# TYPE    DATABASE    USER       ADDRESS    METHOD
local    appdb       app_user              peer map=usuarios_locales
```

Y en `pg_ident.conf`:

```text
# MAPNAME             SYSTEM-USERNAME    DATABASE-USERNAME
usuarios_locales     ignac              app_user
```

Con ambos archivos configurados, el proceso que se ejecuta como usuario del sistema `ignac` puede conectarse a la base de datos `appdb` solicitando el rol `app_user`. La conexión solo se aceptará si la regla de `pg_hba.conf` coincide y el mapeo autoriza esa combinación.

Por ejemplo, la conexión desde la cuenta `ignac`:

```bash
psql -U app_user -d appdb
```

#### Sin mapa de usuarios

Sin un mapa, la regla equivalente podría ser:

```text
local    all    all              peer
```
En ese caso, el nombre del usuario del sistema debe coincidir con el del rol de PostgreSQL.

Por ejemplo, la conexión desde la cuenta `ignac` con rol de PostgreSQL `ignac`:

```bash
psql 
```

Al coincidir ambos nombres, PostgreSQL permite la conexión sin solicitar contraseña.

## Uso con `ident` en conexiones TCP/IP

El método `ident` se utiliza en conexiones TCP/IP. 

PostgreSQL solicita la identidad de la conexión al *servicio Ident* del equipo cliente y puede compararla con el rol solicitado mediante un mapa.

Ejemplo de regla en `pg_hba.conf`:

```text
# TYPE    DATABASE    USER       ADDRESS          METHOD
host     appdb       app_user   192.168.1.0/24   ident map=usuarios_remotos
```

Correspondencia en `pg_ident.conf`:

```text
# MAPNAME              SYSTEM-USERNAME    DATABASE-USERNAME
usuarios_remotos      cliente_app        app_user
```

En este caso, si el *servicio Ident* devuelve el nombre `cliente_app`, PostgreSQL permitirá la autenticación como `app_user`.


!!! warning "Precaución con `ident`"

    La respuesta de Ident procede del equipo cliente y no constituye una prueba criptográfica de la identidad. 
    
    No debe tratarse como un método seguro frente a clientes no confiables. 
    
    Para conexiones remotas se recomienda utilizar `scram-sha-256`, combinado con reglas adecuadas en `pg_hba.conf` y mecanismos de filtrado de red.

## Diagnóstico rápido de problemas

| Error o síntoma | Qué comprobar | Solución |
|---|---|---|
| La autenticación `peer` falla aunque la cuenta del sistema exista. | Que la regla de `pg_hba.conf` contiene `map=...` cuando los nombres son distintos, y que el mapa contiene la pareja exacta. | Añadir o corregir en `pg_ident.conf` la correspondencia entre el usuario del sistema y el rol solicitado. Si ambos nombres deben coincidir, quitar `map=...` de la regla. |
| El mapa parece no aplicarse. | Que el nombre indicado en `map=` coincide exactamente con el primer campo de la entrada en `pg_ident.conf`. | Usar el mismo nombre de mapa en ambos archivos y comprobar que la entrada relaciona correctamente la identidad externa con el rol PostgreSQL. |
| Los cambios no tienen efecto. | Que se ha editado la ruta mostrada por `SHOW ident_file;` y que se ha recargado la configuración. | Editar el archivo indicado por `SHOW ident_file;` y ejecutar `SELECT pg_reload_conf();` o `sudo systemctl reload postgresql`. |
| La conexión falla antes de comprobar el mapeo. | Que existe una regla coincidente en `pg_hba.conf` y que se está utilizando el método adecuado al tipo de conexión. | Crear o corregir una regla coincidente: `peer` para conexiones locales por socket Unix o `ident` para conexiones TCP/IP; especificar `map=...` si se necesita el mapeo. |
| El usuario puede conectarse, pero no acceder a determinados objetos. | Los permisos del rol en la base de datos; `pg_ident.conf` solo participa en la autenticación. | Conceder al rol los privilegios necesarios sobre la base de datos y los objetos correspondientes. |

## Buenas prácticas

- Define mapas concretos y limita cada correspondencia a los roles necesarios.
- No utilices `all` como usuario PostgreSQL del mapa salvo que sea imprescindible: permitiría que la identidad externa iniciara sesión como cualquier rol existente.
- Mantén coordinadas las reglas de `pg_hba.conf` y las entradas de `pg_ident.conf`.
- Para clientes remotos no confiables, utiliza un método de autenticación más robusto, como `scram-sha-256`.
