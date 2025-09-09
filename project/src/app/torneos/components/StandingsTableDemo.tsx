import React, { useState } from 'react';
import StandingsTable from './StandingsTable';

// Datos de ejemplo con equipos de Rainbow Six Siege LATAM
const mockParticipants = [
  {
    id: '1',
    name: 'Estral Esports',
    team: 'Estral',
    seed: 1,
    icon: '🦅', // Águila/Fénix
    logo: undefined
  },
  {
    id: '2',
    name: 'Timbers Esports',
    team: 'Timbers',
    seed: 2,
    icon: '🪓', // Hacha/Bate
    logo: undefined
  },
  {
    id: '3',
    name: 'Atheris Esports',
    team: 'Atheris',
    seed: 3,
    icon: '🐍', // Serpiente/Dragón
    logo: undefined
  },
  {
    id: '4',
    name: 'Pixel Esports',
    team: 'Pixel',
    seed: 4,
    icon: '🎮', // Control de juego
    logo: undefined
  },
  {
    id: '5',
    name: 'Chivas Esports',
    team: 'Chivas',
    seed: 5,
    icon: '🐐', // Cabra/Carneiro
    logo: undefined
  },
  {
    id: '6',
    name: 'Infinity Esports',
    team: 'Infinity',
    seed: 6,
    icon: '♾️', // Símbolo de infinito
    logo: undefined
  },
  {
    id: '7',
    name: 'Mexico Esports Team',
    team: 'MET',
    seed: 7,
    icon: '🦅', // Águila mexicana
    logo: undefined
  }
];

// Generar datos de clasificación basados en la imagen de referencia
const generateStandingsData = () => {
  const standingsData = [
    {
      participant: mockParticipants[0], // Estral Esports
      position: 1,
      points: 14,
      matchesPlayed: 6,
      perfectWins: 3,
      wins: 2,
      draws: 1,
      losses: 0,
      mapDifference: 8,
      roundDifference: 35
    },
    {
      participant: mockParticipants[1], // Timbers Esports
      position: 2,
      points: 10,
      matchesPlayed: 6,
      perfectWins: 2,
      wins: 1,
      draws: 2,
      losses: 1,
      mapDifference: 4,
      roundDifference: 15
    },
    {
      participant: mockParticipants[2], // Atheris Esports
      position: 3,
      points: 7,
      matchesPlayed: 6,
      perfectWins: 0,
      wins: 3,
      draws: 1,
      losses: 2,
      mapDifference: 0,
      roundDifference: 0
    },
    {
      participant: mockParticipants[3], // Pixel Esports
      position: 4,
      points: 6,
      matchesPlayed: 6,
      perfectWins: 1,
      wins: 0,
      draws: 3,
      losses: 2,
      mapDifference: 0,
      roundDifference: 1
    },
    {
      participant: mockParticipants[4], // Chivas Esports
      position: 5,
      points: 6,
      matchesPlayed: 6,
      perfectWins: 0,
      wins: 1,
      draws: 4,
      losses: 1,
      mapDifference: 0,
      roundDifference: -1
    },
    {
      participant: mockParticipants[5], // Infinity Esports
      position: 6,
      points: 4,
      matchesPlayed: 6,
      perfectWins: 1,
      wins: 0,
      draws: 1,
      losses: 4,
      mapDifference: -5,
      roundDifference: -17
    },
    {
      participant: mockParticipants[6], // Mexico Esports Team
      position: 7,
      points: 2,
      matchesPlayed: 6,
      perfectWins: 0,
      wins: 0,
      draws: 2,
      losses: 4,
      mapDifference: -7,
      roundDifference: -33
    }
  ];
  return standingsData;
};

const StandingsTableDemo: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const standingsData = generateStandingsData();

  return (
    <div className="p-6">
      {/* Botón para abrir la tabla */}
      <div className="flex justify-center mb-8">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          🏆 Ver Tabla de Clasificación Rainbow Six Siege LATAM
        </button>
      </div>

      {/* Información sobre la tabla */}
      <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">
          Tabla de Clasificación - Rainbow Six Siege LATAM
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white/80">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Características:</h3>
            <ul className="space-y-2">
              <li>• Diseño inspirado en Rainbow Six Siege LATAM</li>
              <li>• Equipos reales de la liga mexicana</li>
              <li>• Estadísticas específicas de R6S (VP, VC, EM, PE, DM, DR)</li>
              <li>• Header con branding "#MXR6"</li>
              <li>• Leyenda completa de abreviaciones</li>
              <li>• Footer con CORSAIR y redes sociales</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Equipos incluidos:</h3>
            <ul className="space-y-1 text-sm">
              <li>🦅 Estral Esports (1º - 14 pts)</li>
              <li>🪓 Timbers Esports (2º - 10 pts)</li>
              <li>🐍 Atheris Esports (3º - 7 pts)</li>
              <li>🎮 Pixel Esports (4º - 6 pts)</li>
              <li>🐐 Chivas Esports (5º - 6 pts)</li>
              <li>♾️ Infinity Esports (6º - 4 pts)</li>
              <li>🦅 Mexico Esports Team (7º - 2 pts)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modal de la tabla */}
      {isOpen && (
        <StandingsTable
          participants={mockParticipants}
          standings={standingsData}
          tournamentName="Rainbow Six Siege LATAM - Jornada 5"
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default StandingsTableDemo;
