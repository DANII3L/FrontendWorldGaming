import React, { memo, useCallback } from 'react';
import { Users, Trophy, ArrowRight, GitBranch, TrendingUp, Edit, Calendar } from 'lucide-react';
import { Torneo } from '../hooks/useTorneos';
import TournamentToggle from './TournamentToggle';
import { getDifficultyColor } from '../../shared/utils';

interface TournamentCardMinimalProps {
  tournament: Torneo;
  onTournamentClick: (tournament: Torneo) => void;
  onBracketClick?: (tournament: Torneo) => void;
  onChartClick?: (tournament: Torneo) => void;
  onEdit?: (tournament: Torneo) => void;
  onToggle?: (tournament: Torneo, newStatus: boolean) => void;
  showStatusChip?: boolean; // Nueva prop para controlar si se muestra el chip de estado
}

const TournamentCardMinimal: React.FC<TournamentCardMinimalProps> = memo(({
  tournament,
  onTournamentClick,
  onBracketClick,
  onChartClick,
  onEdit,
  onToggle,
  showStatusChip = true // Por defecto mostrar el chip de estado
}) => {
  const availableSpots = (tournament.maxParticipantes || 120) - (tournament.participantes || 0);
  
  const handleClick = useCallback(() => {
    onTournamentClick(tournament);
  }, [tournament, onTournamentClick]);
  
  return (
    <div 
      className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 shadow-lg overflow-hidden hover:scale-[1.02] transition-all duration-300 group cursor-pointer hover:border-white/20 relative w-full"
      onClick={handleClick}
    >
      {/* Contenido de la card */}
      <div className="flex items-center p-6 space-x-6">
        {/* Logo/Imagen del torneo */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center">
            {tournament.imagen ? (
              <img
                src={tournament.imagen}
                alt={tournament.nombre}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-white/60 text-xs font-bold text-center px-1">
                <div className="text-[8px] leading-tight">TORNEO</div>
                <div className="text-[10px] leading-tight font-bold">FITCHIN</div>
              </div>
            )}
          </div>
        </div>

        {/* Información del torneo */}
        <div className="flex-1 min-w-0">
          {/* Chips de dificultad y estado */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {/* Chip de dificultad - siempre visible */}
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(tournament.dificultad)}`}>
              {tournament.dificultad?.toUpperCase() || 'N/A'}
            </span>
            
            {/* Chip de estado del torneo (Próximo, En juego, Terminado) */}
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
              tournament.estado?.toLowerCase() === 'próximo' || tournament.estado?.toLowerCase() === 'upcoming'
                ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                : tournament.estado?.toLowerCase() === 'activo' || tournament.estado?.toLowerCase() === 'active' || tournament.estado?.toLowerCase() === 'en curso'
                ? 'bg-green-500/20 text-green-400 border-green-500/30'
                : tournament.estado?.toLowerCase() === 'completado' || tournament.estado?.toLowerCase() === 'completed'
                ? 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                : 'bg-orange-500/20 text-orange-400 border-orange-500/30'
            }`}>
              {tournament.estado?.toLowerCase() === 'próximo' || tournament.estado?.toLowerCase() === 'upcoming'
                ? 'PRÓXIMO'
                : tournament.estado?.toLowerCase() === 'activo' || tournament.estado?.toLowerCase() === 'active' || tournament.estado?.toLowerCase() === 'en curso'
                ? 'EN JUEGO'
                : tournament.estado?.toLowerCase() === 'completado' || tournament.estado?.toLowerCase() === 'completed'
                ? 'TERMINADO'
                : tournament.estado || 'SIN ESTADO'}
            </span>
            
            {/* Chip de estado activo/inactivo - solo visible cuando showStatusChip es true */}
            {showStatusChip && (
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                tournament.isActive 
                  ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                  : 'bg-red-500/20 text-red-400 border-red-500/30'
              }`}>
                {tournament.isActive ? 'ACTIVO' : 'INACTIVO'}
              </span>
            )}
          </div>
          
          <h3 className="text-white font-semibold text-xl mb-3 truncate group-hover:text-purple-300 transition-colors">
            {tournament.nombre}
          </h3>
          
          {/* Detalles del torneo */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div className="flex items-center space-x-2 text-white/70 text-sm">
              <Users className="w-4 h-4" />
              <span>{tournament.juegoNombre || 'Juego'}</span>
            </div>
            <div className="flex items-center space-x-2 text-white/70 text-sm">
              <Trophy className="w-4 h-4" />
              <span>${tournament.premio || 0} USD</span>
            </div>
            <div className="flex items-center space-x-2 text-white/70 text-sm col-span-2">
              <Calendar className="w-4 h-4" />
              <span>
                {tournament.fechaInicio ? new Date(tournament.fechaInicio).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                }) : 'Fecha por definir'} - {tournament.fechaFin ? new Date(tournament.fechaFin).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                }) : 'Sin fecha fin'}
              </span>
            </div>
          </div>
        </div>

             {/* Información de cupos y botones */}
             <div className="flex-shrink-0 text-right">
               <div className="mb-4">
                 <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg px-4 py-2 border border-white/10">
                   <span className="text-white font-bold text-sm">
                     ¡Quedan {availableSpots} cupos!
                   </span>
                 </div>
               </div>
               
               {/* Botones de funcionalidad */}
               <div className="flex gap-2 justify-end">
                 <button 
                   onClick={(e) => {
                     e.stopPropagation();
                     onTournamentClick(tournament);
                   }}
                   className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 flex items-center justify-center group-hover:bg-purple-500/20"
                   title="Ver Información"
                 >
                   <ArrowRight className="w-4 h-4 text-white" />
                 </button>
                 {onToggle && (
                   <div onClick={(e) => e.stopPropagation()}>
                     <TournamentToggle
                       tournamentId={tournament.id}
                       tournamentName={tournament.nombre}
                       isActive={tournament.isActive || false}
                       onToggle={(newStatus) => onToggle(tournament, newStatus)}
                       className=""
                     />
                   </div>
                 )}
                 {onEdit && (
                   <button 
                     onClick={(e) => {
                       e.stopPropagation();
                       onEdit(tournament);
                     }}
                     className="w-8 h-8 rounded-full bg-blue-500/20 hover:bg-blue-500/30 transition-colors duration-200 flex items-center justify-center group-hover:bg-blue-500/30"
                     title="Editar Torneo"
                   >
                     <Edit className="w-4 h-4 text-blue-400" />
                   </button>
                 )}
                 {onChartClick && (
                   <button 
                     onClick={(e) => {
                       e.stopPropagation();
                       onChartClick(tournament);
                     }}
                     className="w-8 h-8 rounded-full bg-orange-500/20 hover:bg-orange-500/30 transition-colors duration-200 flex items-center justify-center group-hover:bg-orange-500/30"
                     title="Ver Gráfico"
                   >
                     <TrendingUp className="w-4 h-4 text-orange-400" />
                   </button>
                 )}
                 {onBracketClick && (
                   <button 
                     onClick={(e) => {
                       e.stopPropagation();
                       onBracketClick(tournament);
                     }}
                     className="w-8 h-8 rounded-full bg-green-500/20 hover:bg-green-500/30 transition-colors duration-200 flex items-center justify-center group-hover:bg-green-500/30"
                     title="Ver Bracket"
                   >
                     <GitBranch className="w-4 h-4 text-green-400" />
                   </button>
                 )}
               </div>
             </div>
      </div>
    </div>
  );
}); 

TournamentCardMinimal.displayName = 'TournamentCardMinimal';

export default TournamentCardMinimal;
