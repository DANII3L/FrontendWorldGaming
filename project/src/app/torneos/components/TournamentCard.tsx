import React from 'react';
import { GitBranch, TrendingUp, Users, Calendar, Play, Edit, Trash2, Info } from 'lucide-react';
import { Torneo } from '../hooks/useTorneos';
import TournamentToggle from './TournamentToggle';
import { getDifficultyColor } from '../../shared/utils';

// Funciones de utilidad para colores y textos
const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'activo':
      return 'bg-green-500/20 text-green-400 border-green-500/30'
    case 'upcoming':
    case 'próximo':
    case 'proximo':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'completado':
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};

const getStatusText = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'activo':
      return 'ACTIVO';
    case 'próximo':
      return 'PRÓXIMO';
    case 'completado':
      return 'COMPLETADO';
    default:
      return 'DESCONOCIDO';
  }
};

// Función de dificultad movida a difficultyUtils.ts

interface TournamentCardProps {
  tournament: Torneo;
  onEdit: (tournamentId: number) => void;
  onDelete: (tournamentId: number) => void;
  onRefresh: () => void;
  onBracketClick: (tournament: Torneo) => void;
  onChartClick: (tournament: Torneo) => void;
  onInfoClick: (tournament: Torneo) => void;
}

const TournamentCard: React.FC<TournamentCardProps> = ({
  tournament,
  onEdit,
  onDelete,
  onRefresh,
  onBracketClick,
  onChartClick,
  onInfoClick
}) => {
  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 shadow-lg overflow-hidden hover:scale-105 transition-all duration-300 group cursor-pointer hover:border-white/20 relative">
      {/* Imagen del torneo */}
      <div className="relative h-48 overflow-hidden group">
        <img
          src={tournament.imagen || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=200&fit=crop&crop=center'}
          alt={tournament.nombre}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <div className="flex gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(tournament.estado || 'próximo')}`}>
              {getStatusText(tournament.estado || 'próximo')}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(tournament.dificultad || 'intermedio')}`}>
              {(tournament.dificultad || 'intermedio').toUpperCase()}
            </span>
          </div>
        </div>

        {/* Premio */}
        <div className="absolute top-4 right-4 bg-gradient-to-r from-slate-600 to-slate-700 text-white px-3 py-1 rounded-lg font-bold text-sm border border-slate-500/30">
          ${tournament.premio || 2000}
        </div>

        {/* Botones flotantes para Ver Bracket, Gráfico e Info - Solo en la imagen */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/50 backdrop-blur-sm">
          <div className="flex gap-3">
            <button
              onClick={() => onBracketClick(tournament)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-3 rounded-full font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-2xl hover:scale-110 transform"
            >
              <GitBranch className="w-5 h-5" />
              <span className="text-xs font-bold">Bracket</span>
            </button>
            <button
              onClick={() => onChartClick(tournament)}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-full font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center justify-center gap-2 shadow-2xl hover:scale-110 transform"
            >
              <TrendingUp className="w-5 h-5" />
              <span className="text-xs font-bold">Gráfico</span>
            </button>
            <button
              onClick={() => onInfoClick(tournament)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-2xl hover:scale-110 transform"
            >
              <Info className="w-5 h-5" />
              <span className="text-xs font-bold">Info</span>
            </button>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6">
        {/* Título y Toggle de Activar/Desactivar */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-white group-hover:text-slate-300 transition-colors">
            {tournament.nombre}
          </h3>
          <TournamentToggle
            tournamentId={tournament.id}
            tournamentName={tournament.nombre}
            isActive={tournament.isActive}
            onToggle={onRefresh}
          />
        </div>
        
        <p className="text-white/60 text-sm mb-4">{tournament.juegoNombre || 'Counter-Strike 2'}</p>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-slate-300" />
            <span className="text-white/80 text-sm">
              {tournament.participantes || 0}/{tournament.maxParticipantes || 120}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-slate-300" />
            <span className="text-white/80 text-sm">
              {tournament.fechaInicio ? new Date(tournament.fechaInicio).toLocaleDateString() : 'Fecha por definir'}
            </span>
          </div>
        </div>

        {/* Progreso de participantes */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-white/60 mb-1">
            <span>Participantes</span>
            <span>{Math.round(((tournament.participantes || 0) / (tournament.maxParticipantes || 120)) * 100)}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-slate-400 via-slate-500 to-slate-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((tournament.participantes || 0) / (tournament.maxParticipantes || 120)) * 100}%` }}
            />
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-white/10 my-4"></div>

        {/* Botones de acción */}
        <div className="flex flex-col space-y-2">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button className="flex-1 bg-gradient-to-r from-slate-600 to-slate-700 text-white py-2 px-4 rounded-lg font-semibold hover:from-slate-700 hover:to-slate-800 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg">
              <Play className="w-4 h-4" />
              <span>Unirse</span>
            </button>
            <button
              onClick={() => onEdit(tournament.id)}
              className="bg-blue-500/20 text-blue-400 py-2 px-4 rounded-lg hover:bg-blue-500/30 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Editar</span>
            </button>
            <button
              onClick={() => onDelete(tournament.id)}
              className="bg-red-500/20 text-red-400 py-2 px-4 rounded-lg hover:bg-red-500/30 transition-all duration-200 flex items-center justify-center"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex justify-between items-center text-sm">
            <span className="text-white/60">Entrada:</span>
            <span className="text-white font-semibold">${tournament.costoEntrada || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentCard;
