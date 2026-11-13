---
title: Configuración de red de la máquina virtual
---

## Modos de red

El adaptador se configura en **Configuración de la VM → Red**. El modo adecuado depende de desde dónde se conectará el cliente.

| Modo | Uso habitual | Consideraciones |
|---|---|---|
| NAT | La VM inicia conexiones hacia otras redes usando la conexión del anfitrión. | Las conexiones entrantes desde el anfitrión requieren reglas de reenvío de puertos. |
| Adaptador puente | La VM aparece en la misma red que el anfitrión. | Puede estar prohibido en redes del centro y expone la VM a esa red. Úsalo solo con autorización. |
| Solo-anfitrión | Comunicación privada entre el anfitrión y la VM. | No proporciona por sí sola acceso a Internet. |
| Red interna | Comunicación entre VMs de esa red. | No conecta directamente con el anfitrión ni con Internet. |

Para una práctica aislada, utiliza el modo indicado por el profesorado. No habilites puentes ni publiques puertos en redes compartidas sin autorización.

## Consultar la configuración desde Ubuntu

En la VM, abre una terminal y ejecuta:

```console
ip -br address
ip route
```

`ip -br address` muestra las interfaces y sus direcciones; `ip route` muestra la ruta predeterminada. Para probar conectividad, usa la puerta de enlace que corresponda a tu red:

```console
ping -c 4 DIRECCION_DE_LA_PUERTA_DE_ENLACE
```

Sustituye el texto de ejemplo por la dirección indicada para la práctica. Si no conoces la subred o la puerta de enlace, no inventes valores: solicítalos al profesorado.

## Dirección estática con Netplan

La actividad de la UD1 solicita configurar una dirección estática para el servidor local. Antes de editar Netplan, confirma con el profesorado:

- el nombre de la interfaz (`ip -br address`);
- la dirección y prefijo de red;
- la puerta de enlace;
- los servidores DNS;
- que la dirección elegida no esté asignada a otro equipo.

Edita únicamente el archivo de Netplan indicado por la práctica y conserva una copia antes del cambio. Una configuración incorrecta puede dejar la VM sin conectividad. Para aplicar cambios de forma temporalmente reversible, utiliza `sudo netplan try` cuando esté disponible; confirma solo si la conexión sigue funcionando.

Tras aplicar la configuración, vuelve a comprobar `ip -br address`, `ip route` y la conectividad. No configures la misma dirección estática en dos VMs.

Una vez que la red funcione, sigue la guía de [Conexión por SSH](05-conexion-ssh.md).
