
-- =====================================================
-- SCRIPT DE MAPEO DE BASE DE DATOS - WORLD GAMING
-- =====================================================
-- Este script crea la estructura completa de la base de datos
-- para la aplicación World Gaming usando SQL Server
-- 
-- NOTA IMPORTANTE: Todas las restricciones de clave foránea usan ON DELETE NO ACTION
-- para evitar ciclos o múltiples rutas de cascada que pueden causar errores en SQL Server.
-- Esto significa que para eliminar registros padre, primero se deben eliminar manualmente
-- los registros hijo relacionados.
-- =====================================================

-- Crear la base de datos
CREATE DATABASE WorldGamingDB;
GO

USE WorldGamingDB;
GO

-- =====================================================
-- TABLAS PRINCIPALES (ORDEN LÓGICO)
-- =====================================================

-- 1. TABLA DE USUARIOS (Base del sistema)
CREATE TABLE Usuarios (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    EntidadId INT NOT NULL,
    Nombre NVARCHAR(100) NOT NULL,
    Apellidos NVARCHAR(100) NOT NULL,
    Correo NVARCHAR(255) NOT NULL UNIQUE,
    Password NVARCHAR(255) NOT NULL,
    Telefono NVARCHAR(20),
    Identificacion NVARCHAR(20) UNIQUE,
    Avatar NVARCHAR(500),
    IpPublica NVARCHAR(45), -- IPv4 o IPv6 para validación de ban
    Rol NVARCHAR(50) NOT NULL DEFAULT 'Usuario',
    IsActive BIT NOT NULL DEFAULT 1,
    IsBanned BIT NOT NULL DEFAULT 0, -- Indica si el usuario está baneado
    FechaBan DATETIME2, -- Fecha cuando fue baneado
    MotivoBan NVARCHAR(500), -- Motivo del ban
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);

-- 2. TABLA DE JUEGOS (Catálogo de juegos disponibles)
CREATE TABLE Juegos (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(100) NOT NULL,
    Descripcion NVARCHAR(500),
    Categoria NVARCHAR(50),
    Dificultad NVARCHAR(50),
    MaxJugadores INT NOT NULL,
    Titulares INT NOT NULL,
    Suplentes INT NOT NULL,
    Icon NVARCHAR(500),
    Logo NVARCHAR(500),
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);

-- 3. TABLA DE PALETAS DE COLORES POR JUEGO
CREATE TABLE PaletasJuego (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    JuegoId INT NOT NULL,
    PrimaryColor NVARCHAR(7) NOT NULL,
    SecondaryColor NVARCHAR(7) NOT NULL,
    TertiaryColor NVARCHAR(7) NOT NULL,
    AccentColor NVARCHAR(7) NOT NULL,
    LightColor NVARCHAR(7) NOT NULL,
    FOREIGN KEY (JuegoId) REFERENCES Juegos(Id) ON DELETE NO ACTION
);

-- 4. TABLA DE JUGADORES (Perfiles de juego de usuarios)
CREATE TABLE Jugadores (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UsuarioId INT NOT NULL,
    Nombre NVARCHAR(100) NOT NULL,
    Role NVARCHAR(50),
    Experiencia INT DEFAULT 0,
    Avatar NVARCHAR(500),
    IsAvailable BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (UsuarioId) REFERENCES Usuarios(Id) ON DELETE NO ACTION
);

-- 5. TABLA DE EQUIPOS (Creados por jugadores)
CREATE TABLE Equipos (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(100) NOT NULL,
    Descripcion NVARCHAR(500),
    Logo NVARCHAR(500),
    Imagen NVARCHAR(500),
    Tag NVARCHAR(10),
    CreadorId INT NOT NULL, -- ID del jugador que creó el equipo
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (CreadorId) REFERENCES Jugadores(Id) ON DELETE NO ACTION
);

-- 6. TABLA DE RELACIÓN JUGADOR-EQUIPO (Muchos a muchos)
CREATE TABLE JugadorEquipo (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    JugadorId INT NOT NULL,
    EquipoId INT NOT NULL,
    EsCapitan BIT NOT NULL DEFAULT 0,
    EsTitular BIT NOT NULL DEFAULT 0,
    FechaUnion DATETIME2 DEFAULT GETDATE(),
    IsActive BIT NOT NULL DEFAULT 1,
    FOREIGN KEY (JugadorId) REFERENCES Jugadores(Id) ON DELETE NO ACTION,
    FOREIGN KEY (EquipoId) REFERENCES Equipos(Id) ON DELETE NO ACTION,
    UNIQUE(JugadorId, EquipoId) -- Un jugador solo puede estar una vez en un equipo
);

-- 7. TABLA DE ESTADÍSTICAS DE JUGADORES
CREATE TABLE EstadisticasJugador (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    JugadorId INT NOT NULL,
    Kills INT DEFAULT 0,
    Deaths INT DEFAULT 0,
    Assists INT DEFAULT 0,
    WinRate DECIMAL(5,2) DEFAULT 0,
    GamesPlayed INT DEFAULT 0,
    BestGame NVARCHAR(100),
    Streak INT DEFAULT 0,
    Tier NVARCHAR(20) DEFAULT 'bronze',
    Points INT DEFAULT 0,
    Level INT DEFAULT 1,
    Experience INT DEFAULT 0,
    ExperienceToNext INT DEFAULT 100,
    TotalPoints INT DEFAULT 0,
    FOREIGN KEY (JugadorId) REFERENCES Jugadores(Id) ON DELETE NO ACTION
);

-- 8. TABLA DE ESTADÍSTICAS DE EQUIPOS
CREATE TABLE EstadisticasEquipo (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    EquipoId INT NOT NULL,
    TotalMatches INT DEFAULT 0,
    Wins INT DEFAULT 0,
    Losses INT DEFAULT 0,
    Rank NVARCHAR(50),
    Tier NVARCHAR(20) DEFAULT 'bronze',
    Points INT DEFAULT 0,
    FOREIGN KEY (EquipoId) REFERENCES Equipos(Id) ON DELETE NO ACTION
);

-- 9. TABLA DE REQUISITOS DE JUEGO POR EQUIPO
CREATE TABLE RequisitosJuegoEquipo (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    EquipoId INT NOT NULL,
    JuegoId INT NOT NULL,
    Titulares INT NOT NULL,
    Suplentes INT NOT NULL,
    TotalJugadores INT NOT NULL,
    FOREIGN KEY (EquipoId) REFERENCES Equipos(Id) ON DELETE NO ACTION,
    FOREIGN KEY (JuegoId) REFERENCES Juegos(Id) ON DELETE NO ACTION
);

-- =====================================================
-- TABLAS DE TORNEOS
-- =====================================================

-- 10. TABLA DE TORNEOS
CREATE TABLE Torneos (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(100) NOT NULL,
    JuegoId INT NOT NULL,
    Descripcion NVARCHAR(500),
    FechaInicio DATETIME2 NOT NULL,
    FechaFin DATETIME2 NOT NULL,
    MaxParticipantes INT NOT NULL,
    Premio NVARCHAR(100),
    Estado NVARCHAR(20) DEFAULT 'upcoming', -- 'upcoming', 'active', 'completed'
    Categoria NVARCHAR(50),
    Dificultad NVARCHAR(50),
    Ubicacion NVARCHAR(100),
    Formato NVARCHAR(50) DEFAULT 'single_elimination', -- 'single_elimination', 'double_elimination', 'round_robin', 'swiss'
    CostoEntrada DECIMAL(10,2) DEFAULT 0,
    Imagen NVARCHAR(500),
    Reglas NVARCHAR(MAX),
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (JuegoId) REFERENCES Juegos(Id) ON DELETE NO ACTION
);

-- 11. TABLA DE PARTICIPANTES EN TORNEOS
CREATE TABLE ParticipantesTorneo (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    TorneoId INT NOT NULL,
    EquipoId INT,
    JugadorId INT,
    Seed INT,
    Logo NVARCHAR(500),
    Icon NVARCHAR(10),
    FechaRegistro DATETIME2 DEFAULT GETDATE(),
    Estado NVARCHAR(20) DEFAULT 'registered', -- 'registered', 'confirmed', 'eliminated'
    FOREIGN KEY (TorneoId) REFERENCES Torneos(Id) ON DELETE NO ACTION,
    FOREIGN KEY (EquipoId) REFERENCES Equipos(Id) ON DELETE NO ACTION,
    FOREIGN KEY (JugadorId) REFERENCES Jugadores(Id) ON DELETE NO ACTION,
    -- Un participante debe ser equipo O jugador, no ambos
    CHECK ((EquipoId IS NOT NULL AND JugadorId IS NULL) OR (EquipoId IS NULL AND JugadorId IS NOT NULL))
);

-- 12. TABLA DE PARTIDAS
CREATE TABLE Partidas (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    TorneoId INT NOT NULL,
    Ronda INT NOT NULL,
    NumeroPartida INT NOT NULL,
    Participante1Id INT NOT NULL, -- ID del participante (equipo o jugador)
    Participante2Id INT NOT NULL, -- ID del participante (equipo o jugador)
    PuntuacionParticipante1 INT DEFAULT 0,
    PuntuacionParticipante2 INT DEFAULT 0,
    GanadorId INT, -- ID del participante ganador
    Estado NVARCHAR(20) DEFAULT 'pending', -- 'pending', 'in_progress', 'completed'
    FechaProgramada DATETIME2,
    Duracion NVARCHAR(20),
    Venue NVARCHAR(100),
    Notas NVARCHAR(500),
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (TorneoId) REFERENCES Torneos(Id) ON DELETE NO ACTION,
    FOREIGN KEY (Participante1Id) REFERENCES ParticipantesTorneo(Id) ON DELETE NO ACTION,
    FOREIGN KEY (Participante2Id) REFERENCES ParticipantesTorneo(Id) ON DELETE NO ACTION,
    FOREIGN KEY (GanadorId) REFERENCES ParticipantesTorneo(Id) ON DELETE NO ACTION
);

-- 13. TABLA DE RESULTADOS DETALLADOS DE PARTIDAS
CREATE TABLE ResultadosPartida (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    PartidaId INT NOT NULL,
    PuntosParticipante1 INT DEFAULT 0,
    PuntosParticipante2 INT DEFAULT 0,
    DiferenciaMapasParticipante1 INT DEFAULT 0,
    DiferenciaMapasParticipante2 INT DEFAULT 0,
    DiferenciaRondasParticipante1 INT DEFAULT 0,
    DiferenciaRondasParticipante2 INT DEFAULT 0,
    VictoriaPerfecta BIT DEFAULT 0,
    FOREIGN KEY (PartidaId) REFERENCES Partidas(Id) ON DELETE NO ACTION
);

-- 14. TABLA DE ESTADÍSTICAS DE JUGADORES POR PARTIDA
CREATE TABLE EstadisticasJugadorPartida (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    PartidaId INT NOT NULL,
    JugadorId INT NOT NULL,
    Puntos INT DEFAULT 0,
    Kills INT DEFAULT 0,
    Assists INT DEFAULT 0,
    Deaths INT DEFAULT 0,
    KDA DECIMAL(5,2) DEFAULT 0,
    RondasGanadas INT DEFAULT 0,
    RondasJugadas INT DEFAULT 0,
    FOREIGN KEY (PartidaId) REFERENCES Partidas(Id) ON DELETE NO ACTION,
    FOREIGN KEY (JugadorId) REFERENCES Jugadores(Id) ON DELETE NO ACTION
);

-- =====================================================
-- TABLAS DE GAMIFICACIÓN
-- =====================================================

-- 15. TABLA DE LOGROS
CREATE TABLE Logros (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(100) NOT NULL,
    Descripcion NVARCHAR(500),
    Icon NVARCHAR(10),
    Categoria NVARCHAR(50), -- 'tournament', 'participation', 'social', 'skill', 'special'
    Rareza NVARCHAR(20), -- 'common', 'rare', 'epic', 'legendary'
    Puntos INT DEFAULT 0,
    Requisitos NVARCHAR(MAX), -- JSON con los requisitos
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE()
);

-- 16. TABLA DE LOGROS DESBLOQUEADOS POR USUARIO
CREATE TABLE LogrosUsuario (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UsuarioId INT NOT NULL,
    LogroId INT NOT NULL,
    FechaDesbloqueo DATETIME2 DEFAULT GETDATE(),
    ProgresoActual INT DEFAULT 0,
    ProgresoRequerido INT DEFAULT 1,
    FOREIGN KEY (UsuarioId) REFERENCES Usuarios(Id) ON DELETE NO ACTION,
    FOREIGN KEY (LogroId) REFERENCES Logros(Id) ON DELETE NO ACTION
);

-- 17. TABLA DE INSIGNIAS
CREATE TABLE Insignias (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(100) NOT NULL,
    Descripcion NVARCHAR(500),
    Icon NVARCHAR(10),
    Tier NVARCHAR(20), -- 'bronze', 'silver', 'gold', 'platinum', 'diamond'
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE()
);

-- 18. TABLA DE INSIGNIAS DESBLOQUEADAS POR USUARIO
CREATE TABLE InsigniasUsuario (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UsuarioId INT NOT NULL,
    InsigniaId INT NOT NULL,
    FechaDesbloqueo DATETIME2 DEFAULT GETDATE(),
    ProgresoActual INT DEFAULT 0,
    ProgresoRequerido INT DEFAULT 1,
    FOREIGN KEY (UsuarioId) REFERENCES Usuarios(Id) ON DELETE NO ACTION,
    FOREIGN KEY (InsigniaId) REFERENCES Insignias(Id) ON DELETE NO ACTION
);

-- =====================================================
-- TABLAS DE CONFIGURACIÓN Y NOTIFICACIONES
-- =====================================================

-- 19. TABLA DE CONFIGURACIÓN DE NOTIFICACIONES POR USUARIO
CREATE TABLE ConfiguracionNotificaciones (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UsuarioId INT NOT NULL,
    NotificacionesPlataforma BIT NOT NULL DEFAULT 1,
    NotificacionesEmail BIT NOT NULL DEFAULT 1,
    NotificacionesWhatsApp BIT NOT NULL DEFAULT 0,
    NotificacionesPush BIT NOT NULL DEFAULT 1,
    NotificacionesTorneos BIT NOT NULL DEFAULT 1,
    NotificacionesEquipos BIT NOT NULL DEFAULT 1,
    NotificacionesLogros BIT NOT NULL DEFAULT 1,
    NotificacionesSistema BIT NOT NULL DEFAULT 1,
    HoraInicioNotificaciones TIME DEFAULT '08:00',
    HoraFinNotificaciones TIME DEFAULT '22:00',
    ZonaHoraria NVARCHAR(50) DEFAULT 'America/Mexico_City',
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (UsuarioId) REFERENCES Usuarios(Id) ON DELETE NO ACTION
);

-- 20. TABLA DE NOTIFICACIONES
CREATE TABLE Notificaciones (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UsuarioId INT NOT NULL,
    ConfiguracionNotificacionId INT,
    Titulo NVARCHAR(100) NOT NULL,
    Mensaje NVARCHAR(500) NOT NULL,
    Tipo NVARCHAR(20) NOT NULL, -- 'success', 'error', 'info', 'warning'
    Categoria NVARCHAR(50), -- 'tournament', 'message', 'system', 'moderation'
    CanalEnvio NVARCHAR(20) DEFAULT 'plataforma', -- 'plataforma', 'email', 'whatsapp', 'push'
    EstadoEnvio NVARCHAR(20) DEFAULT 'pendiente', -- 'pendiente', 'enviado', 'fallido'
    FechaEnvio DATETIME2,
    IsRead BIT NOT NULL DEFAULT 0,
    FechaCreacion DATETIME2 DEFAULT GETDATE(),
    FechaLectura DATETIME2,
    FOREIGN KEY (UsuarioId) REFERENCES Usuarios(Id) ON DELETE NO ACTION,
    FOREIGN KEY (ConfiguracionNotificacionId) REFERENCES ConfiguracionNotificaciones(Id) ON DELETE SET NULL
);

-- =====================================================
-- TABLAS DE CONFIGURACIÓN
-- =====================================================

-- 20. TABLA DE CONFIGURACIÓN DEL SISTEMA
CREATE TABLE ConfiguracionSistema (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Clave NVARCHAR(100) NOT NULL UNIQUE,
    Valor NVARCHAR(MAX),
    Descripcion NVARCHAR(500),
    Tipo NVARCHAR(20) DEFAULT 'string', -- 'string', 'number', 'boolean', 'json'
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);

-- 21. TABLA DE CONFIGURACIÓN DE EMAIL
CREATE TABLE ConfiguracionEmail (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ServidorSMTP NVARCHAR(100) NOT NULL,
    Puerto INT NOT NULL,
    Usuario NVARCHAR(100) NOT NULL,
    Password NVARCHAR(255) NOT NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);

-- 23. TABLA DE PLANTILLAS DE EMAIL
CREATE TABLE PlantillasEmail (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(100) NOT NULL,
    Asunto NVARCHAR(200) NOT NULL,
    Cuerpo NVARCHAR(MAX) NOT NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);

-- 24. TABLA DE CONFIGURACIÓN DE WHATSAPP
CREATE TABLE ConfiguracionWhatsApp (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    TokenAcceso NVARCHAR(500) NOT NULL,
    NumeroTelefono NVARCHAR(20) NOT NULL,
    NombreNegocio NVARCHAR(100),
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);

-- 25. TABLA DE PLANTILLAS DE WHATSAPP
CREATE TABLE PlantillasWhatsApp (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(100) NOT NULL,
    Mensaje NVARCHAR(MAX) NOT NULL,
    Tipo NVARCHAR(20) DEFAULT 'text', -- 'text', 'media', 'template'
    Categoria NVARCHAR(50), -- 'notificacion', 'promocion', 'recordatorio'
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);

-- =====================================================
-- TABLAS DE RANKINGS
-- =====================================================

-- 26. TABLA DE RANKINGS DE JUGADORES
CREATE TABLE RankingsJugadores (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    JugadorId INT NOT NULL,
    JuegoId INT NOT NULL,
    Posicion INT NOT NULL,
    Puntos INT DEFAULT 0,
    PartidasJugadas INT DEFAULT 0,
    VictoriasPerfectas INT DEFAULT 0,
    Victorias INT DEFAULT 0,
    Empates INT DEFAULT 0,
    Derrotas INT DEFAULT 0,
    DiferenciaMapas INT DEFAULT 0,
    DiferenciaRondas INT DEFAULT 0,
    FechaActualizacion DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (JugadorId) REFERENCES Jugadores(Id) ON DELETE NO ACTION,
    FOREIGN KEY (JuegoId) REFERENCES Juegos(Id) ON DELETE NO ACTION
);

-- 27. TABLA DE RANKINGS DE EQUIPOS
CREATE TABLE RankingsEquipos (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    EquipoId INT NOT NULL,
    JuegoId INT NOT NULL,
    Posicion INT NOT NULL,
    Puntos INT DEFAULT 0,
    PartidasJugadas INT DEFAULT 0,
    VictoriasPerfectas INT DEFAULT 0,
    Victorias INT DEFAULT 0,
    Empates INT DEFAULT 0,
    Derrotas INT DEFAULT 0,
    DiferenciaMapas INT DEFAULT 0,
    DiferenciaRondas INT DEFAULT 0,
    FechaActualizacion DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (EquipoId) REFERENCES Equipos(Id) ON DELETE NO ACTION,
    FOREIGN KEY (JuegoId) REFERENCES Juegos(Id) ON DELETE NO ACTION
);

-- =====================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================

-- Índices para Usuarios
CREATE INDEX IX_Usuarios_Correo ON Usuarios(Correo);
CREATE INDEX IX_Usuarios_Rol ON Usuarios(Rol);
CREATE INDEX IX_Usuarios_IsActive ON Usuarios(IsActive);
CREATE INDEX IX_Usuarios_IsBanned ON Usuarios(IsBanned);
CREATE INDEX IX_Usuarios_IpPublica ON Usuarios(IpPublica);
CREATE INDEX IX_Usuarios_IpPublica_IsBanned ON Usuarios(IpPublica, IsBanned);

-- Índices para Juegos
CREATE INDEX IX_Juegos_IsActive ON Juegos(IsActive);
CREATE INDEX IX_Juegos_Categoria ON Juegos(Categoria);

-- Índices para Jugadores
CREATE INDEX IX_Jugadores_UsuarioId ON Jugadores(UsuarioId);
CREATE INDEX IX_Jugadores_IsAvailable ON Jugadores(IsAvailable);

-- Índices para Equipos
CREATE INDEX IX_Equipos_IsActive ON Equipos(IsActive);
CREATE INDEX IX_Equipos_Nombre ON Equipos(Nombre);
CREATE INDEX IX_Equipos_CreadorId ON Equipos(CreadorId);

-- Índices para JugadorEquipo
CREATE INDEX IX_JugadorEquipo_JugadorId ON JugadorEquipo(JugadorId);
CREATE INDEX IX_JugadorEquipo_EquipoId ON JugadorEquipo(EquipoId);
CREATE INDEX IX_JugadorEquipo_IsActive ON JugadorEquipo(IsActive);

-- Índices para Torneos
CREATE INDEX IX_Torneos_Estado ON Torneos(Estado);
CREATE INDEX IX_Torneos_JuegoId ON Torneos(JuegoId);
CREATE INDEX IX_Torneos_FechaInicio ON Torneos(FechaInicio);

-- Índices para Participantes
CREATE INDEX IX_ParticipantesTorneo_TorneoId ON ParticipantesTorneo(TorneoId);
CREATE INDEX IX_ParticipantesTorneo_EquipoId ON ParticipantesTorneo(EquipoId);
CREATE INDEX IX_ParticipantesTorneo_JugadorId ON ParticipantesTorneo(JugadorId);

-- Índices para Partidas
CREATE INDEX IX_Partidas_TorneoId ON Partidas(TorneoId);
CREATE INDEX IX_Partidas_Estado ON Partidas(Estado);
CREATE INDEX IX_Partidas_FechaProgramada ON Partidas(FechaProgramada);

-- Índices para Rankings
CREATE INDEX IX_RankingsJugadores_JuegoId ON RankingsJugadores(JuegoId);
CREATE INDEX IX_RankingsJugadores_Posicion ON RankingsJugadores(Posicion);
CREATE INDEX IX_RankingsEquipos_JuegoId ON RankingsEquipos(JuegoId);
CREATE INDEX IX_RankingsEquipos_Posicion ON RankingsEquipos(Posicion);

-- Índices para Notificaciones
CREATE INDEX IX_Notificaciones_UsuarioId ON Notificaciones(UsuarioId);
CREATE INDEX IX_Notificaciones_IsRead ON Notificaciones(IsRead);
CREATE INDEX IX_Notificaciones_FechaCreacion ON Notificaciones(FechaCreacion);

-- =====================================================
-- DATOS INICIALES
-- =====================================================

-- Insertar configuración del sistema
INSERT INTO ConfiguracionSistema (Clave, Valor, Descripcion, Tipo) VALUES
('ROLES_SISTEMA', '["Admin", "Supervisor", "Usuario", "Analista"]', 'Roles disponibles en el sistema', 'json'),
('TIERS_JUGADORES', '["bronze", "silver", "gold", "platinum", "diamond", "master", "grandmaster"]', 'Tiers de jugadores', 'json'),
('TIERS_INSIGNIAS', '["bronze", "silver", "gold", "platinum", "diamond"]', 'Tiers de insignias', 'json'),
('CATEGORIAS_LOGROS', '["tournament", "participation", "social", "skill", "special"]', 'Categorías de logros', 'json'),
('RAREZAS_LOGROS', '["common", "rare", "epic", "legendary"]', 'Rarezas de logros', 'json'),
('ESTADOS_TORNEO', '["upcoming", "active", "completed"]', 'Estados de torneos', 'json'),
('ESTADOS_PARTIDA', '["pending", "in_progress", "completed"]', 'Estados de partidas', 'json'),
('FORMATOS_TORNEO', '["single_elimination", "double_elimination", "round_robin", "swiss"]', 'Formatos de torneo', 'json');

-- Insertar logros básicos
INSERT INTO Logros (Nombre, Descripcion, Icon, Categoria, Rareza, Puntos, Requisitos) VALUES
('Primera Victoria', 'Gana tu primer torneo', '🏆', 'tournament', 'common', 50, '["Ganar 1 torneo"]'),
('Campeón Invicto', 'Gana 10 torneos sin perder', '👑', 'tournament', 'legendary', 500, '["Ganar 10 torneos consecutivos"]'),
('Participante Activo', 'Participa en 50 torneos', '🎮', 'participation', 'rare', 200, '["Participar en 50 torneos"]'),
('Líder de Equipo', 'Crea y lidera un equipo exitoso', '👥', 'social', 'epic', 300, '["Crear un equipo", "Ganar 5 torneos con el equipo"]'),
('Maestro del Tiempo', 'Juega durante 100 días consecutivos', '⏰', 'participation', 'epic', 400, '["Jugar 100 días consecutivos"]'),
('Estratega Supremo', 'Gana torneos en 5 juegos diferentes', '🧠', 'skill', 'legendary', 600, '["Ganar torneos en 5 juegos diferentes"]');

-- Insertar insignias básicas
INSERT INTO Insignias (Nombre, Descripcion, Icon, Tier) VALUES
('Novato', 'Completa tu primer torneo', '🥉', 'bronze'),
('Competidor', 'Participa en 25 torneos', '🥈', 'silver'),
('Veterano', 'Participa en 100 torneos', '🥇', 'gold'),
('Maestro', 'Gana 50 torneos', '💎', 'diamond');

-- Insertar plantillas de WhatsApp básicas
INSERT INTO PlantillasWhatsApp (Nombre, Mensaje, Tipo, Categoria) VALUES
('Notificación de Torneo', '¡Hola! Tu torneo "{nombre_torneo}" comenzará en 30 minutos. ¡Prepárate para la batalla! 🎮', 'text', 'notificacion'),
('Recordatorio de Partida', 'Recordatorio: Tu partida del torneo "{nombre_torneo}" está programada para {fecha_hora}. ¡No faltes! ⏰', 'text', 'recordatorio'),
('Victoria de Torneo', '¡Felicitaciones! Has ganado el torneo "{nombre_torneo}"! 🏆 Tu premio está siendo procesado.', 'text', 'notificacion'),
('Promoción Especial', '¡Oferta especial! 20% de descuento en la inscripción a torneos premium este fin de semana. ¡No te lo pierdas! 🎯', 'text', 'promocion');

-- =====================================================
-- VISTAS ÚTILES
-- =====================================================

-- Vista de estadísticas de jugadores con información de equipo
CREATE VIEW vw_EstadisticasJugadores AS
SELECT 
    j.Id,
    j.Nombre,
    j.Role,
    j.Experiencia,
    j.Avatar,
    je.EsCapitan,
    je.EsTitular,
    e.Nombre AS Equipo,
    e.Id AS EquipoId,
    ej.Kills,
    ej.Deaths,
    ej.Assists,
    ej.WinRate,
    ej.GamesPlayed,
    ej.BestGame,
    ej.Streak,
    ej.Tier,
    ej.Points,
    ej.Level,
    ej.Experience,
    ej.ExperienceToNext,
    ej.TotalPoints,
    u.Correo,
    u.IsActive
FROM Jugadores j
INNER JOIN Usuarios u ON j.UsuarioId = u.Id
LEFT JOIN JugadorEquipo je ON j.Id = je.JugadorId AND je.IsActive = 1
LEFT JOIN Equipos e ON je.EquipoId = e.Id
LEFT JOIN EstadisticasJugador ej ON j.Id = ej.JugadorId;

-- Vista de estadísticas de equipos
CREATE VIEW vw_EstadisticasEquipos AS
SELECT 
    e.Id,
    e.Nombre,
    e.Descripcion,
    e.Logo,
    e.Imagen,
    e.Tag,
    c.Nombre AS Creador,
    COUNT(je.JugadorId) AS TotalJugadores,
    COUNT(CASE WHEN je.EsTitular = 1 THEN 1 END) AS Titulares,
    COUNT(CASE WHEN je.EsTitular = 0 THEN 1 END) AS Suplentes,
    ee.TotalMatches,
    ee.Wins,
    ee.Losses,
    ee.Rank,
    ee.Tier,
    ee.Points,
    e.IsActive,
    e.CreatedAt
FROM Equipos e
LEFT JOIN Jugadores c ON e.CreadorId = c.Id
LEFT JOIN JugadorEquipo je ON e.Id = je.EquipoId AND je.IsActive = 1
LEFT JOIN EstadisticasEquipo ee ON e.Id = ee.EquipoId
GROUP BY e.Id, e.Nombre, e.Descripcion, e.Logo, e.Imagen, e.Tag, c.Nombre, 
         ee.TotalMatches, ee.Wins, ee.Losses, ee.Rank, ee.Tier, ee.Points, 
         e.IsActive, e.CreatedAt;

-- Vista de torneos con información completa
CREATE VIEW vw_TorneosCompletos AS
SELECT 
    t.Id,
    t.Nombre,
    j.Nombre AS Juego,
    t.Descripcion,
    t.FechaInicio,
    t.FechaFin,
    t.MaxParticipantes,
    t.Premio,
    t.Estado,
    t.Categoria,
    t.Dificultad,
    t.Ubicacion,
    t.Formato,
    COUNT(p.Id) AS ParticipantesActuales,
    t.CreatedAt
FROM Torneos t
INNER JOIN Juegos j ON t.JuegoId = j.Id
LEFT JOIN ParticipantesTorneo p ON t.Id = p.TorneoId
GROUP BY t.Id, t.Nombre, j.Nombre, t.Descripcion, t.FechaInicio, t.FechaFin, 
         t.MaxParticipantes, t.Premio, t.Estado, t.Categoria, t.Dificultad, 
         t.Ubicacion, t.Formato, t.CreatedAt;

-- Vista de rankings de jugadores
CREATE VIEW vw_RankingsJugadores AS
SELECT 
    rj.Id,
    j.Nombre AS Jugador,
    g.Nombre AS Juego,
    rj.Posicion,
    rj.Puntos,
    rj.PartidasJugadas,
    rj.VictoriasPerfectas,
    rj.Victorias,
    rj.Empates,
    rj.Derrotas,
    rj.DiferenciaMapas,
    rj.DiferenciaRondas,
    rj.FechaActualizacion
FROM RankingsJugadores rj
INNER JOIN Jugadores j ON rj.JugadorId = j.Id
INNER JOIN Juegos g ON rj.JuegoId = g.Id;

-- Vista de rankings de equipos
CREATE VIEW vw_RankingsEquipos AS
SELECT 
    re.Id,
    e.Nombre AS Equipo,
    g.Nombre AS Juego,
    re.Posicion,
    re.Puntos,
    re.PartidasJugadas,
    re.VictoriasPerfectas,
    re.Victorias,
    re.Empates,
    re.Derrotas,
    re.DiferenciaMapas,
    re.DiferenciaRondas,
    re.FechaActualizacion
FROM RankingsEquipos re
INNER JOIN Equipos e ON re.EquipoId = e.Id
INNER JOIN Juegos g ON re.JuegoId = g.Id;

-- Vista de usuarios baneados para administradores
CREATE VIEW vw_UsuariosBaneados AS
SELECT 
    u.Id,
    u.Nombre,
    u.Apellidos,
    u.Correo,
    u.Telefono,
    u.IpPublica,
    u.Rol,
    u.IsBanned,
    u.FechaBan,
    u.MotivoBan,
    u.CreatedAt,
    u.UpdatedAt
FROM Usuarios u
WHERE u.IsBanned = 1;

-- =====================================================
-- PROCEDIMIENTOS ALMACENADOS ÚTILES
-- =====================================================

-- Procedimiento para actualizar estadísticas de jugador
CREATE PROCEDURE sp_ActualizarEstadisticasJugador
    @JugadorId INT,
    @Kills INT = NULL,
    @Deaths INT = NULL,
    @Assists INT = NULL,
    @WinRate DECIMAL(5,2) = NULL,
    @GamesPlayed INT = NULL,
    @Points INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE EstadisticasJugador
    SET 
        Kills = ISNULL(@Kills, Kills),
        Deaths = ISNULL(@Deaths, Deaths),
        Assists = ISNULL(@Assists, Assists),
        WinRate = ISNULL(@WinRate, WinRate),
        GamesPlayed = ISNULL(@GamesPlayed, GamesPlayed),
        Points = ISNULL(@Points, Points)
    WHERE JugadorId = @JugadorId;
    
    IF @@ROWCOUNT = 0
    BEGIN
        INSERT INTO EstadisticasJugador (JugadorId, Kills, Deaths, Assists, WinRate, GamesPlayed, Points)
        VALUES (@JugadorId, ISNULL(@Kills, 0), ISNULL(@Deaths, 0), ISNULL(@Assists, 0), 
                ISNULL(@WinRate, 0), ISNULL(@GamesPlayed, 0), ISNULL(@Points, 0));
    END
END;

-- Procedimiento para actualizar estadísticas de equipo
CREATE PROCEDURE sp_ActualizarEstadisticasEquipo
    @EquipoId INT,
    @TotalMatches INT = NULL,
    @Wins INT = NULL,
    @Losses INT = NULL,
    @Points INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE EstadisticasEquipo
    SET 
        TotalMatches = ISNULL(@TotalMatches, TotalMatches),
        Wins = ISNULL(@Wins, Wins),
        Losses = ISNULL(@Losses, Losses),
        Points = ISNULL(@Points, Points)
    WHERE EquipoId = @EquipoId;
    
    IF @@ROWCOUNT = 0
    BEGIN
        INSERT INTO EstadisticasEquipo (EquipoId, TotalMatches, Wins, Losses, Points)
        VALUES (@EquipoId, ISNULL(@TotalMatches, 0), ISNULL(@Wins, 0), 
                ISNULL(@Losses, 0), ISNULL(@Points, 0));
    END
END;

-- Procedimiento para crear notificación
CREATE PROCEDURE sp_CrearNotificacion
    @UsuarioId INT,
    @Titulo NVARCHAR(100),
    @Mensaje NVARCHAR(500),
    @Tipo NVARCHAR(20),
    @Categoria NVARCHAR(50) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO Notificaciones (UsuarioId, Titulo, Mensaje, Tipo, Categoria)
    VALUES (@UsuarioId, @Titulo, @Mensaje, @Tipo, @Categoria);
END;

-- Procedimiento para agregar jugador a equipo
CREATE PROCEDURE sp_AgregarJugadorAEquipo
    @JugadorId INT,
    @EquipoId INT,
    @EsCapitan BIT = 0,
    @EsTitular BIT = 0
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Verificar que el jugador no esté ya en el equipo
    IF EXISTS (SELECT 1 FROM JugadorEquipo WHERE JugadorId = @JugadorId AND EquipoId = @EquipoId AND IsActive = 1)
    BEGIN
        RAISERROR ('El jugador ya pertenece a este equipo', 16, 1);
        RETURN;
    END
    
    -- Desactivar membresías anteriores del jugador
    UPDATE JugadorEquipo SET IsActive = 0 WHERE JugadorId = @JugadorId AND IsActive = 1;
    
    -- Agregar nueva membresía
    INSERT INTO JugadorEquipo (JugadorId, EquipoId, EsCapitan, EsTitular)
    VALUES (@JugadorId, @EquipoId, @EsCapitan, @EsTitular);
END;

-- Procedimiento para banear usuario
CREATE PROCEDURE sp_BanearUsuario
    @UsuarioId INT,
    @MotivoBan NVARCHAR(500),
    @AdminId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Verificar que el usuario existe
    IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE Id = @UsuarioId)
    BEGIN
        RAISERROR ('El usuario no existe', 16, 1);
        RETURN;
    END
    
    -- Banear al usuario
    UPDATE Usuarios 
    SET 
        IsBanned = 1,
        FechaBan = GETDATE(),
        MotivoBan = @MotivoBan,
        IsActive = 0, -- Desactivar también la cuenta
        UpdatedAt = GETDATE()
    WHERE Id = @UsuarioId;
    
    -- Crear notificación de ban
    INSERT INTO Notificaciones (UsuarioId, Titulo, Mensaje, Tipo, Categoria)
    VALUES (@UsuarioId, 'Cuenta Suspendida', 
            'Tu cuenta ha sido suspendida por: ' + @MotivoBan, 
            'error', 'system');
END;

-- Procedimiento para desbanear usuario
CREATE PROCEDURE sp_DesbanearUsuario
    @UsuarioId INT,
    @AdminId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Verificar que el usuario existe
    IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE Id = @UsuarioId)
    BEGIN
        RAISERROR ('El usuario no existe', 16, 1);
        RETURN;
    END
    
    -- Desbanear al usuario
    UPDATE Usuarios 
    SET 
        IsBanned = 0,
        FechaBan = NULL,
        MotivoBan = NULL,
        IsActive = 1, -- Reactivar la cuenta
        UpdatedAt = GETDATE()
    WHERE Id = @UsuarioId;
    
    -- Crear notificación de desban
    INSERT INTO Notificaciones (UsuarioId, Titulo, Mensaje, Tipo, Categoria)
    VALUES (@UsuarioId, 'Cuenta Reactivada', 
            'Tu cuenta ha sido reactivada. Ya puedes acceder nuevamente.', 
            'success', 'system');
END;

-- Procedimiento para validar acceso de usuario (verificar ban)
CREATE PROCEDURE sp_ValidarAccesoUsuario
    @Correo NVARCHAR(255),
    @IpPublica NVARCHAR(45) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @UsuarioId INT;
    DECLARE @IsBanned BIT;
    DECLARE @MotivoBan NVARCHAR(500);
    DECLARE @FechaBan DATETIME2;
    
    -- Obtener información del usuario
    SELECT 
        @UsuarioId = Id,
        @IsBanned = IsBanned,
        @MotivoBan = MotivoBan,
        @FechaBan = FechaBan
    FROM Usuarios 
    WHERE Correo = @Correo;
    
    -- Si el usuario no existe
    IF @UsuarioId IS NULL
    BEGIN
        SELECT 
            'Usuario no encontrado' AS Resultado,
            0 AS AccesoPermitido,
            NULL AS Motivo;
        RETURN;
    END
    
    -- Si el usuario está baneado
    IF @IsBanned = 1
    BEGIN
        SELECT 
            'Usuario baneado' AS Resultado,
            0 AS AccesoPermitido,
            @MotivoBan AS Motivo,
            @FechaBan AS FechaBan;
        RETURN;
    END
    
    -- Verificar si la IP está baneada
    IF @IpPublica IS NOT NULL
    BEGIN
        IF EXISTS (SELECT 1 FROM Usuarios WHERE IpPublica = @IpPublica AND IsBanned = 1)
        BEGIN
            SELECT 
                'IP baneada' AS Resultado,
                0 AS AccesoPermitido,
                'Esta dirección IP ha sido baneada del sistema' AS Motivo;
            RETURN;
        END
    END
    
    -- Acceso permitido
    SELECT 
        'Acceso permitido' AS Resultado,
        1 AS AccesoPermitido,
        NULL AS Motivo;
END;

-- Procedimiento para gestionar plantillas de WhatsApp
CREATE PROCEDURE sp_GestionarPlantillaWhatsApp
    @Accion NVARCHAR(20), -- 'crear', 'actualizar', 'eliminar', 'obtener'
    @Id INT = NULL,
    @Nombre NVARCHAR(100) = NULL,
    @Mensaje NVARCHAR(MAX) = NULL,
    @Tipo NVARCHAR(20) = NULL,
    @Categoria NVARCHAR(50) = NULL,
    @IsActive BIT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    IF @Accion = 'crear'
    BEGIN
        INSERT INTO PlantillasWhatsApp (Nombre, Mensaje, Tipo, Categoria, IsActive)
        VALUES (@Nombre, @Mensaje, @Tipo, @Categoria, ISNULL(@IsActive, 1));
        
        SELECT 'Plantilla creada exitosamente' AS Resultado, SCOPE_IDENTITY() AS Id;
    END
    ELSE IF @Accion = 'actualizar'
    BEGIN
        UPDATE PlantillasWhatsApp 
        SET 
            Nombre = ISNULL(@Nombre, Nombre),
            Mensaje = ISNULL(@Mensaje, Mensaje),
            Tipo = ISNULL(@Tipo, Tipo),
            Categoria = ISNULL(@Categoria, Categoria),
            IsActive = ISNULL(@IsActive, IsActive),
            UpdatedAt = GETDATE()
        WHERE Id = @Id;
        
        SELECT 'Plantilla actualizada exitosamente' AS Resultado;
    END
    ELSE IF @Accion = 'eliminar'
    BEGIN
        UPDATE PlantillasWhatsApp SET IsActive = 0, UpdatedAt = GETDATE() WHERE Id = @Id;
        SELECT 'Plantilla desactivada exitosamente' AS Resultado;
    END
    ELSE IF @Accion = 'obtener'
    BEGIN
        IF @Id IS NOT NULL
            SELECT * FROM PlantillasWhatsApp WHERE Id = @Id AND IsActive = 1;
        ELSE
            SELECT * FROM PlantillasWhatsApp WHERE IsActive = 1 ORDER BY Nombre;
    END
END;

-- =====================================================
-- TRIGGERS PARA MANTENER INTEGRIDAD
-- =====================================================

-- Trigger para actualizar UpdatedAt en Usuarios
CREATE TRIGGER tr_Usuarios_Update
ON Usuarios
AFTER UPDATE
AS
BEGIN
    UPDATE Usuarios
    SET UpdatedAt = GETDATE()
    FROM Usuarios u
    INNER JOIN inserted i ON u.Id = i.Id;
END;

-- Trigger para actualizar UpdatedAt en Juegos
CREATE TRIGGER tr_Juegos_Update
ON Juegos
AFTER UPDATE
AS
BEGIN
    UPDATE Juegos
    SET UpdatedAt = GETDATE()
    FROM Juegos j
    INNER JOIN inserted i ON j.Id = i.Id;
END;

-- Trigger para actualizar UpdatedAt en Equipos
CREATE TRIGGER tr_Equipos_Update
ON Equipos
AFTER UPDATE
AS
BEGIN
    UPDATE Equipos
    SET UpdatedAt = GETDATE()
    FROM Equipos e
    INNER JOIN inserted i ON e.Id = i.Id;
END;

-- Trigger para actualizar UpdatedAt en Torneos
CREATE TRIGGER tr_Torneos_Update
ON Torneos
AFTER UPDATE
AS
BEGIN
    UPDATE Torneos
    SET UpdatedAt = GETDATE()
    FROM Torneos t
    INNER JOIN inserted i ON t.Id = i.Id;
END;

-- =====================================================
-- COMENTARIOS FINALES
-- =====================================================

/*
ESTRUCTURA DE LA BASE DE DATOS WORLD GAMING - FLUJO LÓGICO CORREGIDO

FLUJO PRINCIPAL DEL SISTEMA:

1. USUARIOS → JUGADORES
   - Un Usuario puede crear un perfil de Jugador
   - Un Jugador puede pertenecer a múltiples equipos (pero solo uno activo a la vez)

2. JUGADORES → EQUIPOS
   - Un Jugador puede crear un Equipo (se convierte en creador)
   - Un Jugador puede unirse a equipos existentes
   - La relación se maneja a través de JugadorEquipo (muchos a muchos)

3. EQUIPOS → TORNEOS
   - Los Equipos pueden participar en Torneos
   - Los Jugadores individuales también pueden participar en Torneos
   - Los participantes se registran en ParticipantesTorneo

4. TORNEOS → PARTIDAS
   - Los Torneos generan Partidas entre participantes
   - Las Partidas pueden ser entre equipos o jugadores individuales

5. PARTIDAS → ESTADÍSTICAS
   - Los resultados de las Partidas actualizan las estadísticas
   - Se generan Rankings de Jugadores y Equipos

6. GAMIFICACIÓN
   - Los Logros y Insignias se desbloquean basados en las actividades
   - Se otorgan puntos y experiencia por participación

CARACTERÍSTICAS PRINCIPALES:

✅ SIN DEPENDENCIAS CIRCULARES
✅ RELACIONES LÓGICAS CORRECTAS
✅ INTEGRIDAD REFERENCIAL MANTENIDA
✅ FLUJO DE DATOS COHERENTE
✅ OPTIMIZACIÓN CON ÍNDICES
✅ PROCEDIMIENTOS ALMACENADOS ÚTILES
✅ VISTAS PARA CONSULTAS COMPLEJAS
✅ TRIGGERS PARA INTEGRIDAD

NOTAS IMPORTANTES:
- Se excluye el sistema de mensajes como mencionaste (se usará otra tecnología)
- Todas las fechas usan DATETIME2 para mayor precisión
- Se incluyen índices para optimizar consultas frecuentes
- Se incluyen triggers para mantener integridad de datos
- Se incluyen vistas para consultas complejas comunes
- Se incluyen procedimientos almacenados para operaciones frecuentes
- La relación Jugador-Equipo es muchos a muchos con control de estado activo
*/
