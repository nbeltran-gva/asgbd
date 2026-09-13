# 3. Modelos de explotación de las bases de datos

Hay multitud de tipos de Sistemas Gestores de Bases de Datos. Cada empresa, universidad o corporación necesita almacenar sus datos y acceder a ellos de una forma diferente. Es por eso que existen diferentes Sistemas Gestores de Bases de Datos que se pueden utilizar o implantar de diferentes formas:

| Modelo | Descripción | Ejemplos / Notas |
| :--- | :--- | :--- |
| **Monopuesto** | La base de datos se encuentra en una máquina y es explotada desde la misma máquina. | Típico en SGBD de escritorio: *Access*. |
| **Cliente/Servidor** | El SGBD está en una máquina pero se accede a él desde muchas usando, por lo general, distintas aplicaciones. | Modelo principal utilizado en este módulo. |
| **BD Distribuida** | La base de datos está en distintas máquinas que trabajan colaborativamente para dar servicio a los clientes. | Se verán características en el último tema. |
| **Tres Capas** | Esquema de trabajo: `Cliente` $\rightarrow$ `Servidor Web` $\rightarrow$ `Servidor de BD`. | Arquitectura web multinivel. |

!!! note "Uso en el Módulo"
    En este módulo vamos a utilizar mayoritariamente el **modelo cliente/servidor** y veremos en el último tema del módulo algunas características y aspectos de los **Sistemas gestores de bases de datos distribuidos**.
