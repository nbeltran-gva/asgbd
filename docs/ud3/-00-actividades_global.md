# Resumen global de las actividades

Las actividades se hacen una tras otra sobre los **mismos objetos**: los roles se crean al principio y se reutilizan en bases de datos, privilegios y copias. Esta página reúne, objeto por objeto y siguiendo la organización lógica, qué se hace en cada actividad.

```text
Clúster
├── Roles: usu1, usu2, usu3 y grupo1                  (actividades 1-3)
├── Tablespace: prueba                                (actividad 7)
├── Base de datos: la de usu3                         (actividad 4)
│   └── Esquema → Tabla
├── Base de datos: geo
│   └── Esquema: public
│       ├── Tablas: comarques, instituts, poblacions
│       └── Vistas creadas                            (actividades 5-6)
├── Base de datos: geo2 (tablespace prueba)           (actividades 8-9)
└── Copias de geo: geo_nueva y geo_nueva2             (actividades 15-17)
```

## 1. Roles

| Orden | Actividad | Acción | Resultado |
|---|---|---|---|
| 1 | [1](00-actividades.md#actividad-1-creacion-de-usuarios) | Crear `usu1`, `usu2` y `usu3` con `LOGIN`, contraseña, caducidad, límite de 2 conexiones, `CREATEDB` y `CREATEROLE`. | Tres usuarios. |
| 2 | [2](00-actividades.md#actividad-2-creacion-de-un-grupo-y-membresias) | Crear `grupo1` (`NOLOGIN`) y añadir a `usu1` y `usu2`. | `usu3` queda fuera del grupo. |
| 3 | [3](00-actividades.md#actividad-3-consulta-de-usuarios-y-grupos-del-sistema) | Consultar `pg_user` y `pg_group`. | Se comprueba la membresía. |

## 2. Bases de datos, esquemas y tablas

| Orden | Actividad | Objeto | Acción | Propietario |
|---|---|---|---|---|
| 4 | [4](00-actividades.md#actividad-4-creacion-de-una-base-de-datos-un-esquema-y-una-tabla) | Base de datos, esquema y tabla | Crear la base de datos, un esquema y una tabla; añadir una columna y cambiar el nombre. | `usu3` |
| 8 | [8](00-actividades.md#actividad-8-creacion-de-una-base-de-datos-en-un-tablespace) | `geo2` | Crear la base de datos en el tablespace `prueba` con la estructura de `geo`. | `usu2` |
| 9 | [9](00-actividades.md#actividad-9-cambio-del-propietario-de-una-base-de-datos) | `geo2` | Cambiar el propietario. | `usu1` |

## 3. Vistas

| Orden | Actividad | Acción |
|---|---|---|
| 5 | [5](00-actividades.md#actividad-5-creacion-de-vistas) | Crear en `geo` dos vistas: una sobre una tabla y otra que combina dos tablas. |
| 6 | [6](00-actividades.md#actividad-6-consulta-de-las-vistas-del-esquema) | Listar las vistas del esquema `public` con `pg_views`. |
| 14 | [14](00-actividades.md#actividad-14-privilegios-sobre-vistas) | Dar `SELECT` sobre ambas vistas a `usu1`. |

## 4. Organización física: tablespaces

| Orden | Actividad | Acción |
|---|---|---|
| 7 | [7](00-actividades.md#actividad-7-creacion-de-un-tablespace) | Crear el directorio `/var/lib/postgresql/ts_prueba`, asignarlo a `postgres` y crear el tablespace `prueba`. Probar `ALTER` y `DROP` con uno temporal. |
| 8 | [8](00-actividades.md#actividad-8-creacion-de-una-base-de-datos-en-un-tablespace) | Usar `prueba` como tablespace de `geo2`. |

## 5. Privilegios

Todos los privilegios se conceden sobre `geo`, con la misma secuencia de tres niveles: base de datos (`CONNECT`), esquema (`USAGE`) y tabla (`SELECT` u otros).

| Orden | Actividad | Receptor | Objeto y privilegio | Efecto |
|---|---|---|---|---|
| 10 | [10](00-actividades.md#actividad-10-concesion-de-privilegios-a-un-usuario) | `usu1` | `CONNECT`, `USAGE` y `SELECT` en `instituts`. | `usu1` consulta `instituts`. |
| 11 | [11](00-actividades.md#actividad-11-concesion-de-privilegios-a-un-grupo) | `grupo1` | `CONNECT`, `USAGE`, `SELECT` en `instituts` y `poblacions`, `SELECT` e `INSERT` en `comarques` `WITH GRANT OPTION`. | `usu2` los usa como miembro; `usu3`, no. |
| 12 | [12](00-actividades.md#actividad-12-consulta-de-privilegios-efectivos) | `usu1`, `usu2`, `usu3` | Consulta con `has_*_privilege`. | Tabla resumen de privilegios efectivos. |
| 13 | [13](00-actividades.md#actividad-13-retirada-de-privilegios) | `grupo1` y `usu1` | `REVOKE INSERT` en `comarques` a `grupo1`; `REVOKE SELECT` en `instituts` a `usu1`. | `usu1` sigue consultando `instituts` por su membresía en `grupo1`. |
| 14 | [14](00-actividades.md#actividad-14-privilegios-sobre-vistas) | `usu1` | `SELECT` en las vistas de la actividad 5. | `usu1` las consulta; `usu3`, no. |

### Estado final de los privilegios de `geo`

| Rol | `instituts` | `poblacions` | `comarques` | Vistas |
|---|---|---|---|---|
| `usu1` | `SELECT` (por `grupo1`) | `SELECT` (por `grupo1`) | `SELECT` (por `grupo1`) | `SELECT` |
| `usu2` | `SELECT` (por `grupo1`) | `SELECT` (por `grupo1`) | `SELECT` (por `grupo1`) | Ninguno |
| `usu3` | Ninguno | Ninguno | Ninguno | Ninguno |
| `grupo1` | `SELECT` | `SELECT` | `SELECT` (con `GRANT OPTION`) | Ninguno |

## 6. Copias de seguridad y restauración

| Orden | Actividad | Herramienta | Origen | Destino |
|---|---|---|---|---|
| 15 | [15](00-actividades.md#actividad-15-copia-de-seguridad-y-restauracion-de-la-estructura) | pgAdmin (Backup y Restore) | Estructura de `geo` | `geo_nueva` |
| 16 | [16](00-actividades.md#actividad-16-transferencia-de-datos-entre-bases-de-datos) | pgAdmin | Datos de `comarques` | `geo_nueva` |
| 17 | [17](00-actividades.md#actividad-17-copia-de-una-base-de-datos-desde-la-linea-de-comandos) | Línea de comandos (`pg_dump` y `psql`) | `geo` completa | `geo_nueva2` |

## Secuencia completa

1. **Roles:** crear `usu1`, `usu2`, `usu3` y `grupo1`, y asignar las membresías (1-3).
2. **Objetos de `usu3`:** base de datos, esquema y tabla (4).
3. **Vistas de `geo`:** crearlas y listarlas (5-6).
4. **Tablespace:** crear `prueba` (7).
5. **`geo2`:** crearla en `prueba` y cambiar su propietario (8-9).
6. **Privilegios:** conceder a `usu1` y a `grupo1`, comprobarlos y retirarlos (10-13), y dar acceso a las vistas (14).
7. **Copias:** restaurar la estructura, traspasar datos y copiar por línea de comandos (15-17).

## Esquema de roles, privilegios y objetos

```text
Roles                          Privilegios                    Objetos de geo

usu1 ─┐
      ├── miembro de ──> grupo1 ── CONNECT ────────────────> Base de datos geo
usu2 ─┘                         └── USAGE ──────────────────> Esquema public
                                  ├── SELECT ───────────────> instituts
                                  ├── SELECT ───────────────> poblacions
                                  └── SELECT + GRANT OPTION > comarques

usu1 ─────────────────────────── SELECT ────────────────────> Vistas

usu3 ─────────────────────────── sin privilegios sobre geo
```
