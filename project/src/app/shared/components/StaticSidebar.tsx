import React from 'react';

interface StaticSidebarProps {
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  scrollToSection: (sectionId: string) => void;
  onOpenLoginModal: () => void;
  onOpenRegisterModal: () => void;
}

const StaticSidebar: React.FC<StaticSidebarProps> = ({
  isMenuOpen,
  setIsMenuOpen,
  scrollToSection,
  onOpenLoginModal,
  onOpenRegisterModal,
}) => {
  return (
    <>
      {/* Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-all duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-96 bg-gradient-to-b from-gray-900/98 to-black/98 backdrop-blur-2xl border-l border-white/10 shadow-2xl transform transition-transform duration-500 ease-out z-50 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header del Sidebar */}
          <div className="flex items-center justify-between p-8 border-b border-white/10">
            <h2 className="text-3xl font-bold text-white tracking-wider">NAVEGACIÓN</h2>
          </div>

          {/* Navegación Principal */}
          <div className="flex-1 p-8">
            <div className="space-y-1">
              <button
                onClick={() => { scrollToSection('inicio'); setIsMenuOpen(false); }}
                className="w-full text-left text-white hover:bg-white/10 p-6 rounded-2xl transition-all duration-300 text-xl font-bold tracking-wide hover:scale-[1.02]"
              >
                INICIO
              </button>
              <button
                onClick={() => { scrollToSection('video'); setIsMenuOpen(false); }}
                className="w-full text-left text-white hover:bg-white/10 p-6 rounded-2xl transition-all duration-300 text-xl font-bold tracking-wide hover:scale-[1.02]"
              >
                VIDEO TORNEOS
              </button>
              <button
                onClick={() => { scrollToSection('stats'); setIsMenuOpen(false); }}
                className="w-full text-left text-white hover:bg-white/10 p-6 rounded-2xl transition-all duration-300 text-xl font-bold tracking-wide hover:scale-[1.02]"
              >
                ESTADISTICAS
              </button>
              <button
                onClick={() => { scrollToSection('torneoDestacado'); setIsMenuOpen(false); }}
                className="w-full text-left text-white hover:bg-white/10 p-6 rounded-2xl transition-all duration-300 text-xl font-bold tracking-wide hover:scale-[1.02]"
              >
                TORNEOS DESTACADO
              </button>
              <button
                onClick={() => { scrollToSection('torneos'); setIsMenuOpen(false); }}
                className="w-full text-left text-white hover:bg-white/10 p-6 rounded-2xl transition-all duration-300 text-xl font-bold tracking-wide hover:scale-[1.02]"
              >
                TORNEOS
              </button>
              <button
                onClick={() => { scrollToSection('comunidad'); setIsMenuOpen(false); }}
                className="w-full text-left text-white hover:bg-white/10 p-6 rounded-2xl transition-all duration-300 text-xl font-bold tracking-wide hover:scale-[1.02]"
              >
                COMUNIDAD
              </button>
              <button
                onClick={() => { scrollToSection('contacto'); setIsMenuOpen(false); }}
                className="w-full text-left text-white hover:bg-white/10 p-6 rounded-2xl transition-all duration-300 text-xl font-bold tracking-wide hover:scale-[1.02]"
              >
                CONTACTO
              </button>
            </div>

            {/* Separador */}
            <div className="my-12 border-t border-white/20"></div>

            {/* Autenticación */}
            <div className="space-y-1">
              <h3 className="text-white/40 text-sm font-bold uppercase tracking-widest mb-6 px-6">CUENTA</h3>
              <button
                onClick={() => { onOpenLoginModal(); setIsMenuOpen(false); }}
                className="w-full text-left text-white hover:bg-white/10 p-6 rounded-2xl transition-all duration-300 text-xl font-bold tracking-wide hover:scale-[1.02]"
              >
                INICIAR SESIÓN
              </button>
              <button
                onClick={() => { onOpenRegisterModal(); setIsMenuOpen(false); }}
                className="w-full text-left text-white hover:bg-white/10 p-6 rounded-2xl transition-all duration-300 text-xl font-bold tracking-wide hover:scale-[1.02]"
              >
                REGISTRARSE
              </button>
            </div>
          </div>

          {/* Footer del Sidebar */}
          <div className="p-8 border-t border-white/10">
            <div className="flex items-center justify-between text-white/40 text-sm font-medium">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-white/20 rounded-full"></div>
                <span className="tracking-wide">ESPAÑOL</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="tracking-wide">CONFIGURACIÓN</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StaticSidebar;
