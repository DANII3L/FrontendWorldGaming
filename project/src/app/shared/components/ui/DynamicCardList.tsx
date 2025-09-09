import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/apiService';
import { Card } from './Card';
import Pagination from '../Pagination';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useNotification } from '../../contexts/NotificationContext';
import { Link } from 'react-router-dom';
import { RefreshCw, LucideIcon } from 'lucide-react';

interface CardField {
  label: string;
  key: string;
  render?: (value: any, item: any) => React.ReactNode;
}

interface FilterConfig {
  type: 'search' | 'select';
  key: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

interface DynamicCardListProps {
  // Modo API (comportamiento original)
  apiEndpoint?: string;
  cardFields?: CardField[];
  filters?: FilterConfig[];
  pagination?: boolean;
  cardActions?: (item: any) => React.ReactNode;
  itemsPerPageOptions?: number[];
  className?: string;
  mockData?: any[];
  getCardClassName?: (item: any) => string;
  renderCard?: (item: any) => React.ReactNode;
  title?: string;
  subtitle?: string;
  newButtonText?: string;
  newButtonLink?: string;
  newButtonState?: any;
  onNew?: () => void;
  additionalParams?: { [key: string]: any };
  isLoading?: boolean;
  
  // Modo datos estáticos (nuevo comportamiento)
  data?: any[];
  emptyMessage?: string;
  emptyIcon?: LucideIcon;
}

const DynamicCardList: React.FC<DynamicCardListProps> = ({
  apiEndpoint,
  cardFields = [],
  filters = [],
  pagination = true,
  cardActions,
  itemsPerPageOptions = [6, 12, 24],
  className = '',
  mockData,
  getCardClassName,
  renderCard,
  title,
  subtitle,
  newButtonText,
  newButtonLink,
  newButtonState,
  onNew,
  additionalParams = {},
  isLoading = false,
  data: staticData,
  emptyMessage = "No se encontraron registros",
  emptyIcon: EmptyIcon,
}) => {
  // Determinar si estamos en modo datos estáticos
  const isStaticMode = staticData !== undefined;
  
  const [data, setData] = useState<any[]>(isStaticMode ? staticData : (mockData || []));
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState<{ [key: string]: string }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[0]);
  const [totalRecords, setTotalRecords] = useState(0);
  const { addNotification } = useNotification();

  useEffect(() => {
    if (isStaticMode) {
      setData(staticData);
      return;
    }
    
    if (mockData) {
      setData(mockData);
      return;
    }
    
    if (apiEndpoint) {
      fetchData();
    }
    // eslint-disable-next-line
  }, [apiEndpoint, mockData, staticData, search, filterValues, currentPage, itemsPerPage, additionalParams, isStaticMode]);

  const fetchData = async () => {
    if (!apiEndpoint) return;
    
    setLoading(true);
    try {
      const params: any = {};
      params.pageNumber = currentPage;
      params.pageSize = itemsPerPage;

      // Agregar parámetros adicionales
      Object.assign(params, additionalParams);

      // Construir el parámetro Filter
      const filterStrings: string[] = [];
      Object.entries(filterValues).forEach(([key, value]) => {
        if (value) filterStrings.push(`${key} = '${value}'`);
      });
      const filterParam = filterStrings.join(', ');
      if (filterParam) {
        params.Filter = 'AND ' + filterParam;
      }

      const res = await apiService.post(apiEndpoint, params);
      const list = res?.data?.listFind;
      const total =
        res && 'totalRecords' in res && typeof res.totalRecords === 'number'
          ? res.totalRecords
          : Array.isArray(list)
            ? list.length
            : 0;

      if (Array.isArray(list)) {
        setData(list);
        setTotalRecords(res && res.data && typeof res.data.totalRecords === 'number' ? res.data.totalRecords : 0);
        if (total === 0) {
          addNotification('No se encontraron registros', 'info');
        }
      } else if (res && res.message) {
        const isSuccess = res.status >= 200 && res.status < 300;
        addNotification(res.message, isSuccess ? 'success' : 'error');
        setData([]);
        setTotalRecords(0);
      } else {
        setData([]);
        setTotalRecords(0);
        addNotification('Respuesta vacía del servidor', 'error');
      }
    } catch (e: any) {
      setData([]);
      setTotalRecords(0);
      const errorMessage = e?.response?.data?.message || e?.message || 'Error al cargar los datos';
      addNotification(errorMessage, 'error');
    }
    setLoading(false);
  };

  // Filtros locales (search y select)
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };
  const handleSelect = (key: string, value: string) => {
    setFilterValues(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    if (isStaticMode || mockData) {
      // Para datos estáticos o mockData, solo resetear filtros y paginación
      setSearch('');
      setFilterValues({});
      setCurrentPage(1);
    } else if (apiEndpoint) {
      // Para API calls, recargar datos
      fetchData();
    }
  };

  // Filtrado local para datos estáticos y mockData
  let filteredData = data;
  if (isStaticMode || mockData) {
    filteredData = data.filter(item => {
      let matches = true;
      filters.forEach(f => {
        if (f.type === 'search' && search) {
          const val = (item[f.key] || '').toString().toLowerCase();
          if (!val.includes(search.toLowerCase())) matches = false;
        }
        if (f.type === 'select' && filterValues[f.key]) {
          if ((item[f.key] || '') !== filterValues[f.key]) matches = false;
        }
      });
      return matches;
    });
  }

  let currentItems = data;
  if (isStaticMode || mockData) {
    // paginación local solo para datos estáticos y mockData
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  }

  // Paginación local
  const totalRecordsLocal = (isStaticMode || mockData) ? filteredData.length : totalRecords;
  const totalPages = Math.max(1, Math.ceil(totalRecordsLocal / itemsPerPage));

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header reutilizable */}
      {title && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">{title}</h1>
            {subtitle && <p className="text-white/80 mt-1 text-sm sm:text-base">{subtitle}</p>}
          </div>
          {newButtonText && (newButtonLink ? (
            <Link
              to={newButtonLink}
              state={newButtonState}
              className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:border-white/30 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>{newButtonText}</span>
            </Link>
          ) : (
            <button
              onClick={onNew}
              className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:border-white/30 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>{newButtonText}</span>
            </button>
          ))}
        </div>
      )}

      {/* Filtros - solo mostrar si no estamos en modo datos estáticos o si hay filtros definidos */}
      {filters.length > 0 && (
        <div className="bg-white/5 backdrop-blur-lg p-4 sm:p-6 rounded-2xl border border-white/10 shadow-lg">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-1">
              {filters.map((filter) => {
                if (filter.type === 'search') {
                  return (
                    <div key={filter.key} className="flex-1 relative">
                      <input
                        type="text"
                        placeholder={filter.placeholder || 'Buscar...'}
                        value={search}
                        onChange={handleSearch}
                        className="w-full pl-4 pr-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200"
                      />
                    </div>
                  );
                }
                if (filter.type === 'select') {
                  return (
                    <div key={filter.key} className="flex items-center space-x-2">
                      <select
                        value={filterValues[filter.key] || ''}
                        onChange={e => handleSelect(filter.key, e.target.value)}
                        className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200"
                      >
                        <option value="">{filter.placeholder || 'Todos'}</option>
                        {filter.options?.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  );
                }
                return null;
              })}
            </div>
            
            {/* Botón de recarga */}
            <button
              onClick={handleRefresh}
              disabled={loading || isLoading}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
              title="Recargar datos"
            >
              <RefreshCw className={`h-4 w-4 ${loading || isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      )}

      {/* Cards */}
      <div className={`grid gap-4 sm:gap-6 ${isStaticMode ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
        {loading || isLoading ? (
          <div className="col-span-full text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-2 text-white/60">Cargando...</p>
          </div>
        ) : currentItems.length === 0 ? (
          <div className="col-span-full text-center py-12">
            {EmptyIcon ? (
              <EmptyIcon className="text-white/60 text-6xl mb-4 mx-auto" />
            ) : (
              <div className="text-white/60 text-6xl mb-4">📋</div>
            )}
            <h3 className="text-lg font-medium text-white">{emptyMessage}</h3>
            <p className="text-white/60 mt-1">
              {search || Object.values(filterValues).some(v => v) ? 'Intenta con otros filtros' : 'Comienza agregando un nuevo registro'}
            </p>
          </div>
        ) : (
          currentItems.map((item, idx) => (
            renderCard ? (
              <React.Fragment key={item.id || idx}>{renderCard(item)}</React.Fragment>
            ) : (
              <Card key={item.id || idx} className={`p-6 ${getCardClassName ? getCardClassName(item) : ''}`}>
                {cardFields.map(field => (
                  <div key={field.key} className="mb-2">
                    <span className="font-semibold">{field.label}: </span>
                    {field.render ? field.render(item[field.key], item) : item[field.key]}
                  </div>
                ))}
                {cardActions && (
                  <div className="pt-4 border-t mt-2">{cardActions(item)}</div>
                )}
              </Card>
            )
          ))
        )}
      </div>

      {/* Paginación */}
      {pagination && currentItems.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}

      {/* Info de paginación */}
      {pagination && totalRecordsLocal > 0 && (
        <div className="flex justify-center sm:justify-end text-xs sm:text-sm text-white/60 text-center sm:text-left">
          <span className="hidden sm:inline">Mostrando página {currentPage} de {totalPages} | Total de registros: {totalRecordsLocal}</span>
          <span className="sm:hidden">Página {currentPage} de {totalPages} | {totalRecordsLocal} registros</span>
        </div>
      )}
    </div>
  );
};

export default DynamicCardList; 