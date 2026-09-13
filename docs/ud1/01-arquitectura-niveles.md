# 1. Arquitectura en niveles de las bases de datos

El comité **ANSI/SPARC** definió en **1975** una arquitectura de tres niveles para los sistemas gestores de bases de datos.

## Nivelación de la Arquitectura

```mermaid
graph TD
    subgraph Usuarios
        U1[Usuario 1]
        U2[Usuario 2]
        U3[Usuario 3]
        U4[Usuario 4]
    end

    subgraph Nivel Externo o de Visión
        V1[Vista 1]
        V2[Vista 2]
        Vn[Vista n]
    end

    subgraph Nivel Conceptual / Lógico
        T1[Tabla 1]
        T2[Tabla 2]
        T3[Tabla 3]
        Tn[Tabla n]
    end

    subgraph Nivel Interno o Físico
        D1[(Disco 1)]
        D2[(Disco 2)]
        D3[(Disco 3)]
    end

    U1 --> V1
    U2 --> V2
    U3 --> V2
    U4 --> Vn

    V1 --> T1
    V1 --> T2
    V2 --> T2
    V2 --> T3
    Vn --> T3
    Vn --> Tn

    T1 --> D1
    T1 --> D2
    T2 --> D2
    T3 --> D3
    Tn --> D3
```

### Definición de los Niveles

* **Nivel externo o de visión:** Se compone de las distintas aplicaciones basadas en vistas de la base de datos. Es lo que ven los usuarios finales.
* **Nivel conceptual:** Se compone de las distintas tablas con sus atributos. Es el nivel que conocen los programadores.
* **Nivel interno o físico:** Define qué discos y archivos componen la base de datos y qué hay en cada uno de ellos. Sólo acceden a este nivel los administradores.

---

## Ventajas de la Arquitectura en Niveles

La principal ventaja de esta arquitectura en niveles es que proporciona **independencia lógica y física** de los datos respecto a las aplicaciones:

* **Independencia lógica:** Se pueden realizar cambios en el nivel conceptual (como añadir tablas o atributos) sin que sea necesario reescribir todas las aplicaciones.
* **Independencia física:** Es posible modificar la ubicación de los ficheros que contienen los datos sin que se vean afectadas las aplicaciones.
