---
title: "IP elástica para un servidor"
---

# IP elástica para un servidor en AWS

Cuando montamos un servidor en EC2, a veces necesitamos que su dirección pública sea estable aunque la instancia se reinicie o se vuelva a arrancar. Para eso utilizamos una **Elastic IP**.

En un entorno de prácticas, esta solución es muy útil cuando queremos:

* acceder siempre al mismo servidor con la misma IP pública;
* configurar conexiones remotas de forma más sencilla;
* evitar que un cambio de dirección interrumpa la conexión a PostgreSQL, SSH o puertos de servicio;
* documentar mejor la infraestructura sin depender de una IP que pueda cambiar.

## ¿Qué es una Elastic IP?

Una **Elastic IP** es una dirección IPv4 pública fija que se puede asociar a una instancia EC2. A diferencia de la IP pública normal, esta no cambia mientras siga asociada a la instancia.

Esto resulta especialmente útil cuando:

* el servidor va a estar disponible durante varias sesiones;
* necesitamos apuntar clientes o herramientas a una dirección estable;
* la práctica exige identificar el nodo servidor con la misma IP durante varios días.

!!! warning "Importante"
    La Elastic IP no es gratuita si se deja sin asociar a una instancia. Si no la necesitas, elimínala para evitar consumo innecesario de recursos del laboratorio.

## Cómo crear una Elastic IP

1. En la consola de AWS, abre el servicio **EC2**.
2. En el menú lateral, selecciona **Direcciones IP elásticas**.
3. Haz clic en **Asignar dirección IPv4 elástica**.
4. Confirma la creación.
5. Una vez creada, la dirección aparece en la lista con un estado disponible.

![Elastic IP](img_01/1.jpg)

## Cómo asociarla a la instancia

1. Selecciona la dirección elástica creada.
2. Pulsa **Acciones** y elige **Asociar dirección IPv4 elástica**.
3. En la ventana, selecciona la instancia EC2 que quieres utilizar como servidor.
4. Si la operación lo requiere, también puedes indicar la interfaz de red.
5. Guarda la asociación.

A partir de ese momento, la instancia tendrá la IP elástica asignada como dirección pública principal para ese servidor.

## ¿Qué ventajas tiene?

* La dirección pública permanece estable.
* La conexión SSH es más fácil de recordar y reutilizar.
* Los clientes remotos pueden conectarse siempre a la misma dirección.
* Facilita la documentación y los apuntes de la práctica.

## Ejemplo con PostgreSQL

Si tu servidor de PostgreSQL está en EC2 y se está usando desde otro equipo, una Elastic IP ayuda a mantener la conexión estable.

### 1. Asociar la IP elástica

Asocia la Elastic IP a la instancia que ejecuta PostgreSQL.

### 2. Abrir el puerto adecuado

En el **grupo de seguridad** de la instancia, permite el acceso al puerto **5432** de PostgreSQL. Lo recomendable es limitar el origen a la IP del cliente o a la red que lo necesita.

Ejemplo de regla:

| Tipo | Protocolo | Puerto | Origen |
| --- | --- | --- | --- |
| Personalizado | TCP | 5432 | IP del cliente o rango seguro |

No es necesario abrir PostgreSQL a todo Internet si solo lo usa un cliente concreto.

### 3. Comprobar la dirección

Desde la consola de AWS puedes comprobar que la instancia tiene la Elastic IP asociada. Por ejemplo, si la IP elástica es:

```text
18.234.56.78
```

Puedes conectarte desde otra máquina con SSH:

```console
ssh -i "ruta/a/tu-clave.pem" usuario@18.234.56.78
```

Y desde el propio servidor, o desde otra máquina, puedes probar la conexión a PostgreSQL si el servicio está habilitado:

```console
psql -h 18.234.56.78 -U postgres -d postgres
```

## Configuración del servidor

En PostgreSQL, si quieres aceptar conexiones remotas, revisa la configuración del servicio:

```conf
# /etc/postgresql/16/main/postgresql.conf
listen_addresses = '*'
port = 5432
```

Y en el archivo de autenticación:

```conf
# /etc/postgresql/16/main/pg_hba.conf
host    all             all             0.0.0.0/0               md5
```

En una práctica real, es mejor restringir el acceso a una IP concreta o a una subred segura en lugar de abrirlo a cualquier dirección.

## Buenas prácticas

* usa una Elastic IP solo cuando realmente la necesites;
* borra la dirección cuando ya no la uses;
* limita los puertos al origen necesario;
* documenta la IP asociada para no perderla en los apuntes;
* evita dejar servicios de base de datos abiertos a Internet sin control.

## Recomendación para este curso

Para una práctica de servidor PostgreSQL, usa una Elastic IP si necesitas que la máquina tenga una dirección pública fija durante varias sesiones. Esto facilita la administración y la conexión desde clientes externos sin depender de una IP que pudiera cambiar al reiniciar la instancia.

!!! tip "Resumen"
    La Elastic IP permite mantener una dirección pública fija para una instancia EC2. Es especialmente útil para servidores de bases de datos y para simplificar la gestión de accesos remotos.
