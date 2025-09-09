# Landing Page - World Gaming

## Descripción

Esta landing page está inspirada en el diseño de GTA VI y presenta una experiencia moderna y atractiva para la plataforma World Gaming.

## Características

### 🎨 Diseño
- **Header fijo** con logo y menú hamburguesa
- **Gradientes vibrantes** inspirados en GTA VI
- **Efectos de glassmorphism** con backdrop-blur
- **Animaciones suaves** y transiciones

### 📱 Navegación
- **Menú hamburguesa** en la esquina superior derecha
- **Navegación suave** entre secciones
- **Enlaces directos** a Login y Register
- **Responsive design** para todos los dispositivos

### 🎥 Video Player
- **Reproductor personalizado** con controles completos
- **Barra de progreso** interactiva
- **Controles de volumen** y pantalla completa
- **Overlay de controles** que aparece al hacer hover

### 📊 Secciones
1. **Hero Section** - Video principal y título
2. **Estadísticas** - Números de la plataforma
3. **Torneos** - Información sobre competencias
4. **Comunidad** - Características sociales
5. **Contacto** - Formulario de contacto

## Uso

### Configuración del Video
Para usar tu propio video, reemplaza la ruta en `LandingPage.tsx`:

```tsx
<VideoPlayer
  src="/tu-video.mp4"           // Ruta a tu video
  poster="/tu-poster.jpg"        // Imagen de poster
  title="Tu Título"              // Título del video
  className="w-full h-96"        // Clases CSS
/>
```

### Personalización de Colores
Los colores principales están definidos en las clases de Tailwind:
- Gradientes: `from-blue-900 via-purple-900 to-pink-900`
- Acentos: `from-orange-500 to-red-500`

### Agregar Nuevas Secciones
1. Crea el componente en `components/`
2. Importa en `LandingPage.tsx`
3. Agrega la sección con su ID correspondiente
4. Actualiza el menú de navegación

## Estructura de Archivos

```
landing/
├── LandingPage.tsx          # Componente principal
├── components/
│   ├── VideoPlayer.tsx      # Reproductor de video
│   └── StatsSection.tsx     # Sección de estadísticas
└── README.md               # Esta documentación
```

## Rutas

- `/` - Landing page principal
- `/login` - Página de login
- `/register` - Página de registro
- `/dashboard` - Panel principal (requiere autenticación)

## Tecnologías Utilizadas

- **React 18** con TypeScript
- **Tailwind CSS** para estilos
- **Lucide React** para iconos
- **React Router** para navegación 