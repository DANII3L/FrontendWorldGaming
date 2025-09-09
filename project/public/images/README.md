# Directorio de Imágenes

Este directorio contiene las imágenes utilizadas en la aplicación World Gaming.

## Estructura

```
images/
├── logo.png                  # Logo principal de World Gaming
├── world-gaming-hero.png     # Imagen promocional principal
├── poster.jpg                # Poster para videos
└── README.md                # Esta documentación
```

## Logo Principal

### logo.png
- **Tamaño recomendado**: 64x64px o 128x128px
- **Formato**: PNG con transparencia
- **Uso**: Logo principal en el header
- **Características**: 
  - Diseño limpio y reconocible
  - Fondo transparente
  - Colores que contrasten bien con fondos oscuros
  - Fallback automático a texto "WG" si no carga

## Imagen Principal

### world-gaming-hero.png
- **Tamaño recomendado**: 1920x1080px o 2560x1440px
- **Formato**: PNG con transparencia
- **Uso**: Imagen promocional principal en la landing page
- **Características**: 
  - Alta resolución
  - Diseño moderno y atractivo
  - Compatible con el tema de gaming
  - Colores que se adapten a las paletas dinámicas

## Cómo agregar imágenes

1. Coloca tu imagen PNG en este directorio
2. Actualiza la ruta en `LandingPage.tsx` si es necesario
3. Asegúrate de que la imagen tenga un tamaño apropiado
4. Optimiza la imagen para web (compresión PNG)

## Formatos soportados

- **PNG**: Para imágenes con transparencia
- **JPG**: Para imágenes sin transparencia
- **WebP**: Para mejor compresión (soporte moderno) 