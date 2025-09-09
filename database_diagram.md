# Diagrama de Base de Datos - World Gaming (CORREGIDO)

## Diagrama ER (Entity Relationship) - Flujo Lógico

```mermaid
erDiagram
    %% Entidades Principales (Orden Lógico)
    Usuarios {
        int Id PK
        int EntidadId
        nvarchar Nombre
        nvarchar Apellidos
        nvarchar Correo UK
        nvarchar Password
        nvarchar Telefono
        nvarchar Identificacion UK
        nvarchar Avatar
        nvarchar Rol
        nvarchar IpPublica
        bit IsBanned
        datetime2 FechaBan
        nvarchar MotivoBan
        bit IsActive
        datetime2 CreatedAt
        datetime2 UpdatedAt
    }

    Juegos {
        int Id PK
        nvarchar Nombre
        nvarchar Descripcion
        nvarchar Categoria
        nvarchar Dificultad
        int MaxJugadores
        int Titulares
        int Suplentes
        nvarchar Icon
        nvarchar Logo
        bit IsActive
        datetime2 CreatedAt
        datetime2 UpdatedAt
    }

    Jugadores {
        int Id PK
        int UsuarioId FK
        nvarchar Nombre
        nvarchar Role
        int Experiencia
        nvarchar Avatar
        bit IsAvailable
        datetime2 CreatedAt
    }

    Equipos {
        int Id PK
        nvarchar Nombre
        nvarchar Descripcion
        nvarchar Logo
        nvarchar Imagen
        nvarchar Tag
        int CreadorId FK
        bit IsActive
        datetime2 CreatedAt
        datetime2 UpdatedAt
    }

    %% Tabla de Relación (Muchos a Muchos)
    JugadorEquipo {
        int Id PK
        int JugadorId FK
        int EquipoId FK
        bit EsCapitan
        bit EsTitular
        datetime2 FechaUnion
        bit IsActive
    }

    %% Entidades de Torneos
    Torneos {
        int Id PK
        nvarchar Nombre
        int JuegoId FK
        nvarchar Descripcion
        datetime2 FechaInicio
        datetime2 FechaFin
        int MaxParticipantes
        nvarchar Premio
        decimal CostoEntrada
        nvarchar Imagen
        nvarchar Reglas
        nvarchar Estado
        nvarchar Categoria
        nvarchar Dificultad
        nvarchar Ubicacion
        nvarchar Formato
        bit IsActive
        datetime2 CreatedAt
        datetime2 UpdatedAt
    }

    ParticipantesTorneo {
        int Id PK
        int TorneoId FK
        int EquipoId FK
        int JugadorId FK
        int Seed
        nvarchar Logo
        nvarchar Icon
        datetime2 FechaRegistro
        nvarchar Estado
    }

    Partidas {
        int Id PK
        int TorneoId FK
        int Ronda
        int NumeroPartida
        int Participante1Id FK
        int Participante2Id FK
        int PuntuacionParticipante1
        int PuntuacionParticipante2
        int GanadorId FK
        nvarchar Estado
        datetime2 FechaProgramada
        nvarchar Duracion
        nvarchar Venue
        nvarchar Notas
        datetime2 CreatedAt
    }

    %% Entidades de Estadísticas
    EstadisticasJugador {
        int Id PK
        int JugadorId FK
        int Kills
        int Deaths
        int Assists
        decimal WinRate
        int GamesPlayed
        nvarchar BestGame
        int Streak
        nvarchar Tier
        int Points
        int Level
        int Experience
        int ExperienceToNext
        int TotalPoints
    }

    EstadisticasEquipo {
        int Id PK
        int EquipoId FK
        int TotalMatches
        int Wins
        int Losses
        nvarchar Rank
        nvarchar Tier
        int Points
    }

    %% Entidades de Gamificación
    Logros {
        int Id PK
        nvarchar Nombre
        nvarchar Descripcion
        nvarchar Icon
        nvarchar Categoria
        nvarchar Rareza
        int Puntos
        nvarchar Requisitos
        bit IsActive
        datetime2 CreatedAt
    }

    LogrosUsuario {
        int Id PK
        int UsuarioId FK
        int LogroId FK
        datetime2 FechaDesbloqueo
        int ProgresoActual
        int ProgresoRequerido
    }

    Insignias {
        int Id PK
        nvarchar Nombre
        nvarchar Descripcion
        nvarchar Icon
        nvarchar Tier
        bit IsActive
        datetime2 CreatedAt
    }

    InsigniasUsuario {
        int Id PK
        int UsuarioId FK
        int InsigniaId FK
        datetime2 FechaDesbloqueo
        int ProgresoActual
        int ProgresoRequerido
    }

    %% Entidades de Rankings
    RankingsJugadores {
        int Id PK
        int JugadorId FK
        int JuegoId FK
        int Posicion
        int Puntos
        int PartidasJugadas
        int VictoriasPerfectas
        int Victorias
        int Empates
        int Derrotas
        int DiferenciaMapas
        int DiferenciaRondas
        datetime2 FechaActualizacion
    }

    RankingsEquipos {
        int Id PK
        int EquipoId FK
        int JuegoId FK
        int Posicion
        int Puntos
        int PartidasJugadas
        int VictoriasPerfectas
        int Victorias
        int Empates
        int Derrotas
        int DiferenciaMapas
        int DiferenciaRondas
        datetime2 FechaActualizacion
    }

    %% Entidades de Configuración y Notificaciones
    ConfiguracionNotificaciones {
        int Id PK
        int UsuarioId FK
        bit NotificacionesPlataforma
        bit NotificacionesEmail
        bit NotificacionesWhatsApp
        bit NotificacionesPush
        bit NotificacionesTorneos
        bit NotificacionesLogros
        bit NotificacionesEquipos
        bit NotificacionesSistema
        datetime2 CreatedAt
        datetime2 UpdatedAt
    }

    Notificaciones {
        int Id PK
        int UsuarioId FK
        int ConfiguracionId FK
        nvarchar Titulo
        nvarchar Mensaje
        nvarchar Tipo
        nvarchar Categoria
        nvarchar CanalEnvio
        nvarchar EstadoEnvio
        bit IsRead
        datetime2 FechaCreacion
        datetime2 FechaLectura
        datetime2 FechaEnvio
    }

    ConfiguracionSistema {
        int Id PK
        nvarchar Clave UK
        nvarchar Valor
        nvarchar Descripcion
        nvarchar Tipo
        bit IsActive
        datetime2 CreatedAt
        datetime2 UpdatedAt
    }

    ConfiguracionWhatsApp {
        int Id PK
        nvarchar ApiKey
        nvarchar ApiSecret
        nvarchar PhoneNumberId
        nvarchar BusinessAccountId
        nvarchar WebhookUrl
        bit IsActive
        datetime2 CreatedAt
        datetime2 UpdatedAt
    }

    PlantillasWhatsApp {
        int Id PK
        nvarchar Nombre
        nvarchar Codigo
        nvarchar Categoria
        nvarchar Contenido
        nvarchar Variables
        bit IsActive
        datetime2 CreatedAt
        datetime2 UpdatedAt
    }

    %% RELACIONES PRINCIPALES (Flujo Lógico)
    Usuarios ||--o{ Jugadores : "crea"
    Juegos ||--o{ PaletasJuego : "tiene"
    Jugadores ||--o{ Equipos : "crea"
    Jugadores }o--o{ Equipos : "pertenece" via JugadorEquipo
    Juegos ||--o{ Torneos : "incluye"
    Equipos ||--o{ ParticipantesTorneo : "participa"
    Jugadores ||--o{ ParticipantesTorneo : "participa"
    Torneos ||--o{ ParticipantesTorneo : "tiene"
    ParticipantesTorneo ||--o{ Partidas : "juega"
    Torneos ||--o{ Partidas : "genera"
    Jugadores ||--o{ EstadisticasJugador : "tiene"
    Equipos ||--o{ EstadisticasEquipo : "tiene"
    Usuarios ||--o{ LogrosUsuario : "desbloquea"
    Logros ||--o{ LogrosUsuario : "otorgado"
    Usuarios ||--o{ InsigniasUsuario : "desbloquea"
    Insignias ||--o{ InsigniasUsuario : "otorgada"
    Jugadores ||--o{ RankingsJugadores : "tiene"
    Juegos ||--o{ RankingsJugadores : "incluye"
    Equipos ||--o{ RankingsEquipos : "tiene"
    Juegos ||--o{ RankingsEquipos : "incluye"
    Usuarios ||--o{ ConfiguracionNotificaciones : "configura"
    Usuarios ||--o{ Notificaciones : "recibe"
    ConfiguracionNotificaciones ||--o{ Notificaciones : "define"
```

## Diagrama de Flujo del Sistema

```mermaid
flowchart TD
    A[Usuario se Registra] --> B[Crea Perfil de Jugador]
    B --> C[Jugador puede crear Equipo]
    B --> D[Jugador puede unirse a Equipo existente]
    C --> E[Equipo creado]
    D --> F[Jugador se une a Equipo]
    E --> G[Equipo participa en Torneo]
    F --> G
    B --> H[Jugador participa individualmente en Torneo]
    G --> I[Torneo genera Partidas]
    H --> I
    I --> J[Se registran Resultados]
    J --> K[Se actualizan Estadísticas]
    K --> L[Se actualizan Rankings]
    K --> M[Se desbloquean Logros/Insignias]
    L --> N[Sistema de Gamificación]
    M --> N
    N --> O[Notificaciones al Usuario]
```

## Diagrama de Módulos del Sistema

```mermaid
graph TB
    subgraph "MÓDULO USUARIOS"
        U[Usuarios]
        J[Jugadores]
        N[Notificaciones]
    end

    subgraph "MÓDULO JUEGOS"
        JG[Juegos]
        PJ[PaletasJuego]
    end

    subgraph "MÓDULO EQUIPOS"
        E[Equipos]
        JE[JugadorEquipo]
        EE[EstadisticasEquipo]
    end

    subgraph "MÓDULO TORNEOS"
        T[Torneos]
        PT[ParticipantesTorneo]
        P[Partidas]
        RP[ResultadosPartida]
        EJP[EstadisticasJugadorPartida]
    end

    subgraph "MÓDULO GAMIFICACIÓN"
        L[Logros]
        LU[LogrosUsuario]
        I[Insignias]
        IU[InsigniasUsuario]
        EJ[EstadisticasJugador]
    end

    subgraph "MÓDULO RANKINGS"
        RJ[RankingsJugadores]
        RE[RankingsEquipos]
    end

    subgraph "MÓDULO CONFIGURACIÓN"
        CS[ConfiguracionSistema]
        CE[ConfiguracionEmail]
        PE[PlantillasEmail]
    end

    U --> J
    J --> E
    E --> JE
    JG --> T
    E --> PT
    J --> PT
    T --> PT
    PT --> P
    P --> RP
    P --> EJP
    J --> EJ
    E --> EE
    J --> RJ
    E --> RE
    JG --> RJ
    JG --> RE
    U --> LU
    U --> IU
    L --> LU
    I --> IU
    U --> N
```

## Resumen de la Estructura Corregida

### ✅ **Problemas Solucionados:**

1. **Dependencia Circular Eliminada**: Ya no hay dependencia circular entre `Equipos` y `Jugadores`
2. **Relación Muchos a Muchos Correcta**: Se usa `JugadorEquipo` para manejar la relación
3. **Flujo Lógico Implementado**: El orden de creación es coherente
4. **Integridad Referencial**: Todas las foreign keys están correctamente definidas

### 📊 **Estadísticas de la Base de Datos:**

- **Total de Tablas**: 27 tablas
- **Tablas Principales**: 9 tablas
- **Tablas de Torneos**: 5 tablas
- **Tablas de Gamificación**: 4 tablas
- **Tablas de Rankings**: 2 tablas
- **Tablas de Configuración y Notificaciones**: 7 tablas
- **Total de Índices**: 28 índices
- **Total de Vistas**: 6 vistas
- **Total de Procedimientos**: 7 procedimientos
- **Total de Triggers**: 4 triggers

### 🔄 **Flujo de Datos Principal:**

1. **Usuario** → **Jugador** (1:1)
2. **Jugador** → **Equipo** (Muchos:Muchos via JugadorEquipo)
3. **Equipo/Jugador** → **Torneo** (via ParticipantesTorneo)
4. **Torneo** → **Partidas** (1:Muchos)
5. **Partidas** → **Estadísticas** (1:Muchos)
6. **Estadísticas** → **Rankings** (1:1)
7. **Actividades** → **Logros/Insignias** (Muchos:Muchos)

### 🎯 **Características Clave:**

- ✅ **Sin dependencias circulares**
- ✅ **Relaciones lógicas correctas**
- ✅ **Integridad referencial mantenida**
- ✅ **Flujo de datos coherente**
- ✅ **Optimización con índices**
- ✅ **Procedimientos almacenados útiles**
- ✅ **Vistas para consultas complejas**
- ✅ **Triggers para integridad**
- ✅ **Control de estado activo en relaciones**
- ✅ **Soporte para equipos y jugadores individuales**
- ✅ **Sistema de notificaciones multicanal**
- ✅ **Configuración de WhatsApp integrada**
- ✅ **Plantillas de mensajes dinámicas**
- ✅ **Sistema de baneo por IP**
- ✅ **Campos adicionales en torneos**

### 🔧 **Nuevas Funcionalidades Agregadas:**

#### **Sistema de Notificaciones Multicanal:**
- **ConfiguracionNotificaciones**: Permite a los usuarios configurar dónde recibir notificaciones (plataforma, email, WhatsApp, push)
- **Notificaciones mejoradas**: Incluye canal de envío, estado de envío y fecha de envío
- **Integración con configuración**: Las notificaciones se vinculan con las preferencias del usuario

#### **Configuración de WhatsApp:**
- **ConfiguracionWhatsApp**: Almacena credenciales de la API de WhatsApp Business
- **PlantillasWhatsApp**: Permite crear y gestionar plantillas de mensajes con variables dinámicas
- **Sistema de plantillas**: Soporte para categorías y variables personalizables

#### **Sistema de Seguridad:**
- **Campos de baneo en Usuarios**: IP pública, estado de baneo, fecha y motivo
- **Índices de seguridad**: Optimización para consultas de baneo por IP
- **Procedimientos de gestión**: Funciones para banear/desbanear usuarios

#### **Mejoras en Torneos:**
- **CostoEntrada**: Campo para definir costos de participación
- **Imagen**: Campo para imágenes de torneos
- **Reglas**: Campo para reglas específicas del torneo
- **IsActive**: Control de estado activo del torneo
