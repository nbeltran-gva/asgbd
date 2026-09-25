---
title:  "P0.1. Linux Server en AWSAcademy"
---
# Linux Server en AWS Academy

En esta nota veremos cómo crear un servidor Linux en AWS. El servidor Linux no tendrá entorno gráfico, sólo de comandos, por lo que nos bastará acceder a él por SSH.

Primero, debemos acceder al [portal de AWS Academy](https://www.awsacademy.com/vforcesite/LMS_Login){:target="_blank"} utilizando nuestra cuenta de AWS Academy.

![LinuxServerInstallationAWS](P1_1/01_1.png)

![LinuxServerInstallationAWS](P1_1/01_2.png)

En las siguientes imágenes, mostraremos con un cuadro rojo las opciones a selecciona o en aquellas que deben cambiarse o revisarse. Puedes olvidarte del resto de las opciones disponibles por ahora.

Accede al LMS, donde encontrarás los cursos disponibles.

![LinuxServerInstallationAWS](P1_1/01_3.png)

Busca el **Learner Lab** que tu profesor ha preparado para este curso. Previamente te habrá invitado y habrás tenido que aceptar la invitación para tener acceso al mismo.

![LinuxServerInstallationAWS](P1_1/01_4.png)

Selecciona "Módulos" o "Contenidos" para acceder al laboratorio.

![LinuxServerInstallationAWS](P1_1/02.png)

Abre el "Laboratorio de Aprendizaje".

![LinuxServerInstallationAWS](P1_1/03.png)

Inicia el laboratorio:

![LinuxServerInstallationAWS](P1_1/04.png)

Una vez iniciado, verás un punto verde junto a **AWS**. Haz clic allí para abrir la consola de AWS y comenzar a trabajar.

![LinuxServerInstallationAWS](P1_1/05.png)

Ahora tienes acceso a la consola de AWS. Dependiendo de tu uso previo de esta consola, es posible que veas diferentes elementos en la pantalla.

![LinuxServerInstallationAWS](P1_1/06.png)

En AWS, los servidores virtuales se llaman EC2, así que comencemos por crear un EC2. Puedes hacerlo de diferentes maneras. Veamos una de ellas. Haz clic sobre "EC2" y se te abrirá una nueva pantalla. En esta selecciona "Lanzar instancia"


![LinuxServerInstallationAWS](P1_1/07.png)

Ahora debemos proporcionar los parámetros necesarios para crear la máquina. Sigue las pantallas con los datos proporcionados.

Vamos a crear un servidor linux Debian. En primer lugar seleccionamos un nombre y tipo de servidor:

![LinuxServerInstallationAWS](P1_1/08.png)

A continuación, en "Tipo de instancia" seleccionaremos el procesador y la memoria. Ten en cuenta que a mayor potencia, mayor costo. Para esta práctica nos bastará el más sencillo.

![LinuxServerInstallationAWS](P1_1/09.png)

La sección de "Par de claves" (inicio de sesión) es muy importante, ya que aquí crearemos el par de claves que nos permitirá acceder al servidor de forma remota. Creemos un nuevo par de claves que nos pueden servir para el resto del curso. Te recomiendo que nombres el par de claves como "daw".

![LinuxServerInstallationAWS](P1_1/10.png)

Tras crear el par de claves se te abrirá un cuadro de diálogo para guardar la clave privada en tu ordenador. Asegúrate de guardarla en lugar seguro o no podrás acceder al servidor después. Te recomiendo crearte una carpeta donde guardes todo lo de este módulo y guárdala ahí. Aunque no es imprescindible te recomiendo cambiar el nombre al archivo por "daw.pem" para que sea igual al que usaremos en el resto de prácticas.

![LinuxServerInstallationAWS](P1_1/11.png)

Ahora, tras volver a la pantalla anterior, selecciona el par de claves generadas.

![LinuxServerInstallationAWS](P1_1/12.png)

Debemos definir la configuración de red de nuestra VM. En AWS al Firewall se le denomina "Grupo de seguridad", y en él definiremos todas las reglas necesarias para permitir y denegar accesos a nuestra VM. En este caso sólo habilitaremos el acceso por SSHpara gestionar la máquina, así que bastará con aceptar la configuración por defecto ofrecida.

Un aspecto importante a la hora de mantener los recursos organizados en AWS es nombrarlos adecuadamente. El grupo de seguridad recibirá un nombre aleatorio que no podremos identificar después fácilmente. Así que antes de nada le cambiaremos el nombre y le pondremos el mismo que a nuestra máquina. Para ello haz clic en "Editar".

![LinuxServerInstallationAWS](P1_1/13.png)

Ahora cambia el nombre y la descripción del grupo de seguridad como en la imagen.

![LinuxServerInstallationAWS](P1_1/13_2.png)

Finalmente, debemos configurar el almacenamiento. Proporcionemos un volumen de 20 GiB.

![LinuxServerInstallationAWS](P1_1/14.png)

Verifica todas las opciones seleccionadas y lanza la instancia.

![LinuxServerInstallationAWS](P1_1/15.png)

Si todo va bien, la instancia se creará y obtendremos un mensaje que lo indica.

![LinuxServerInstallationAWS](P1_1/16.png)

Si hacemos click sobre el código de la instancia pasaremos a la consola de EC2 y veremos que la VM está en ejecución y todos sus datos relacionados, entre ellos la dirección IP pública que necesitaremos más tarde para acceder a la misma. Ojo, no confundamos la *Dirección IPv4 pública*, que es la accesible desde el exterior, de las *Direcciones IPv4 pivadas* que permitirán a las EC2 verse entre ellas desde una red interna, pero que no es accesible desde el exterior.

![LinuxServerInstallationAWS](P1_1/17.png)

Ahora podemos acceder al servidor utilizando SSH. Primero haz clic en "Conectar" para permitir la conexión. Selecciona el cliente SSH. Ahí tienes toda la información necesaria para realizar la conexión.

![LinuxServerInstallationAWS](P1_1/18.png)

!!! warning
    Si eres usuario de Windows te podrás conectar a la EC2 por SSH usando PowerShell. Aquí tienes una pequeña guía sobre cómo cambiar los permisos de un archivo en PowerShell para hacer el equivalente al chmod 400 
    [Chmod en Windows con PowerShell](https://gist.github.com/fff963bf763d0d39176ec786489c4519.git)

¿Recuerdas la clave privada que te dije que almacenaras en tu computadora previamente? Ese es el que debes usar ahora. AWS asume que se guardó con extensión `.pem` pero si se ha guardado con otra extensión, cámbialo previamente. Aquí te muestro una secuencia de conexión, asumiendo que el certificado se guardó con extensión `.cer`.

![LinuxServerInstallationAWS](P1_1/19.png)

Como verás, ya estás dentro del servidor debian que hemos instalado.

Podemos comprobar cómo la capacidad del disco y la memoria coinciden con la que configuramos en la consola AWS.

![LinuxServerInstallationAWS](P1_1/20.png)

Para cerrar la conexión escribe "exit"

> RECUERDA
>
> La IP pública de la VM podría cambiar. Comprueba antes de cada conexión la IP de la máquina.

## Detener la instancia

En AWS Academy, cada vez que iniciamos el laboratorio, se pondrán en marcha todas las máquinas y servicios creados. Esto puede suponer un consumo de recursos innecesario si no vamos a utilizar algunas de ellas. Por eso es importante parar aquellas máquinas (instancias) que no vayamos a utilizar en un momento dado. 

Para detener una máquina hemos de ir a "Instancias", seleccionarla y a continuación ir al botón "Estado de la instancia".

![LinuxServerInstallationAWS](P1_1/23.png)

Seguidamente seleccionaremos "Detener instancia"

![LinuxServerInstallationAWS](P1_1/24.png)

Y comprobaremos cómo la instancia queda detenida.

![LinuxServerInstallationAWS](P1_1/25.png)

## Eliminar una instancia

Aunque tengamos un EC2 detenido, puede estar consumiendo recursos solo por el hecho de estar creada. Es el caso de los recursos de almacenamiento.

Por tanto, una vez una máquina ya no nos és útil, lo mejor es eliminarla de forma definitiva. Para ello seguiremos el procedimiento visto para pararla, pero seleccionaremos la opción "Terminar instancia"

![LinuxServerInstallationAWS](P1_1/26.png)

Veremos que la instancia estará terminada y dejará de aparecer en el listado de instancias en futuras conexiones.

![LinuxServerInstallationAWS](P1_1/27.png)

Al terminar la instancia se liberarán algunos de los recursos asociados si así lo configuramos al crearla. En nuestro caso seleccionamos que el volúmen se eliminara al eliminar la EC2. 

Pero puede que otros no se liberen automáticamente, como los grupos de seguridad.

Puedes consultar los distintos recursos existentes y eliminar los que no sean necesarios desde el panel de EC2.

![LinuxServerInstallationAWS](P1_1/28.png)

Ve a grupos de seguridad y elimina el que creamos para esta máquina. Observa cómo te ayudará haber cambiado el nombre cuando lo creaste.

## Finaliza el laboratorio

Al finalizar cada sesion de trabajo recuerda que debes finalizar el laboratorio. Ve a la consola de AWS Academy y presiona "Finalizar laboratorio". Si no lo haces, el laboratorio se cerrará automáticamente después de 4 horas pero habrás gastado más saldo del necesario.

![LinuxServerInstallationAWS](P1_1/21.png)

Comprueba que el laboratorio esta parado. El punto junto a AWS deberá estar de color rojo.

![LinuxServerInstallationAWS](P1_1/22.png)


!!! warning
    Recuerda siempre finalizar el laboratorio tras cada sesión de trabajo
