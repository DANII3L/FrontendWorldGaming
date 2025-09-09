import React from "react";
import { useColorPalette } from "../../shared/contexts/ColorPaletteContext";
import VideoPlayer from "./VideoPlayer";
import { ChevronDown } from "lucide-react";

interface HeroSectionProps {
  heroRef?: React.RefObject<HTMLElement>;
  videoRef?: React.RefObject<HTMLElement>;
  isVideoVisible?: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ heroRef, videoRef, isVideoVisible }) => {
  const { currentPalette } = useColorPalette();

  return (
    <>
      <section
        ref={heroRef}
        id="inicio"
        className="relative min-h-screen flex items-center justify-center"
      >
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${currentPalette.primary}80 0%, ${currentPalette.secondary}80 50%, ${currentPalette.tertiary}80 100%)`
          }}
        ></div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-8xl font-extrabold mb-8 font-friendly" style={{ letterSpacing: "0.02em" }}>
            WORLD GAMING
          </h1>
          <p className="text-2xl max-w-4xl mx-auto leading-relaxed font-friendly text-pastel-pink font-medium mb-12">
            MUNDOS DE TORNEOS GAMING
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="text-white/70 w-6 h-6" />
        </div>

        {/* Overlay de transición */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
      </section>

      {/* Video Section */}
      <section
        id="video"
        ref={videoRef}
        className={`relative py-20 overflow-hidden ${isVideoVisible ? 'video-section-enter' : ''}`}
      >
        {/* Overlay de transición superior */}
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-black/80 via-black/40 to-transparent z-10"></div>

        {/* Efectos de fondo */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${currentPalette.primary} 0%, ${currentPalette.secondary} 50%, ${currentPalette.tertiary} 100%)`
            }}
          ></div>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-6xl font-extrabold mb-8 font-friendly text-white tracking-wide">
              TRAILER OFICIAL
            </h2>
            <p className="text-2xl max-w-4xl mx-auto leading-relaxed font-friendly text-pastel-pink font-medium">
              DESCUBRE EL MUNDO DE TORNEOS GAMING MÁS COMPETITIVO DEL PLANETA
            </p>
          </div>

          {/* Video Player Gigante */}
          <div className={`w-full max-w-7xl mx-auto ${isVideoVisible ? 'video-player-enter' : ''}`}>
            <div className="relative group">
              {/* Efectos de brillo alrededor del video */}
              <div className="absolute -inset-4 bg-gradient-to-r from-white/20 via-white/10 to-white/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-700 opacity-0 group-hover:opacity-100"></div>

              <VideoPlayer
                src="/videos/trailer.mp4"
                poster="/images/poster.jpg"
                title="World Gaming - Trailer Oficial"
                className="w-full h-[600px] md:h-[800px] rounded-3xl shadow-2xl transform group-hover:scale-[1.02] transition-all duration-700"
              />
            </div>
          </div>

          {/* Información adicional */}
          <div className="mt-16 text-center">
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-white/20 via-white/10 to-white/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-700 opacity-0 group-hover:opacity-100"></div>
                <div className="text-4xl mb-4">🎮</div>
                <h3 className="text-xl font-gaming-secondary text-white mb-2">MÚLTIPLES JUEGOS</h3>
                <p className="text-white/80 font-gaming-light">Soporte para todos los juegos populares</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-white/20 via-white/10 to-white/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-700 opacity-0 group-hover:opacity-100"></div>
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="text-xl font-gaming-secondary text-white mb-2">PREMIOS ÉPICOS</h3>
                <p className="text-white/80 font-gaming-light">Competencias con premios increíbles</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-white/20 via-white/10 to-white/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-700 opacity-0 group-hover:opacity-100"></div>
                <div className="text-4xl mb-4">🌍</div>
                <h3 className="text-xl font-gaming-secondary text-white mb-2">COMUNIDAD GLOBAL</h3>
                <p className="text-white/80 font-gaming-light">Jugadores de todo el mundo</p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
      </section>
    </>
  );
};

export default HeroSection;