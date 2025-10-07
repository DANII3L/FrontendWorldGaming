import React from 'react';
import { RefreshCw } from 'lucide-react';
import CustomSelect from './CustomSelect';

interface FilterConfig {
  type: 'search' | 'select' | 'category-picker';
  key: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  categories?: Array<{ id: number; nombre: string; descripcion: string; color: string }>;
  loading?: boolean;
  onChange?: (value: any) => void;
}

interface TournamentFiltersProps {
  filters: FilterConfig[];
  filterValues: Record<string, any>;
  onFilterChange: (key: string, value: any) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

const TournamentFilters: React.FC<TournamentFiltersProps> = ({
  filters,
  filterValues,
  onFilterChange,
  onRefresh,
  isLoading
}) => {
  const searchFilter = filters.find(f => f.type === 'search');
  const selectFilters = filters.filter(f => f.type === 'select');

  return (
    <div className="bg-white/5 backdrop-blur-lg p-4 sm:p-6 rounded-2xl border border-white/10 shadow-lg relative z-50">
      <div className="flex flex-col sm:flex-row gap-2 items-center">
        {/* Campo de búsqueda y dropdowns juntos */}
        <div className="flex gap-2 flex-1 w-full">
          {searchFilter && (
            <div className="w-2/3 relative z-50">
              <input
                type="text"
                placeholder={searchFilter.placeholder || 'Buscar torneos...'}
                value={filterValues[searchFilter.key] || ''}
                onChange={(e) => onFilterChange(searchFilter.key, e.target.value)}
                className="w-full pl-4 pr-4 py-2 bg-slate-700/80 border border-orange-500/30 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500 transition-colors text-sm"
              />
            </div>
          )}
          
          {/* Dropdowns de filtros */}
          {selectFilters.map((selectFilter) => (
            <div key={selectFilter.key} className="w-1/3 relative z-50">
              <CustomSelect
                options={selectFilter.options || []}
                value={filterValues[selectFilter.key] || ''}
                onChange={(value) => onFilterChange(selectFilter.key, value)}
                placeholder={selectFilter.placeholder || 'Todos'}
                className="w-full"
              />
            </div>
          ))}
        </div>
        
        {/* Botón de recarga */}
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white p-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center flex-shrink-0"
          title="Recargar datos"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  );
};

export default TournamentFilters;
