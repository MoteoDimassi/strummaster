import React, { useState, useEffect } from 'react';
import { Search, Music, Clock, Star, Filter, ChevronDown, Loader2 } from 'lucide-react';

// Типы данных для табулатур из API Strapi
interface TabData {
  id: number;
  documentId: string;
  Name: string;
  Description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  // Поддерживаем разные форматы изображений из Strapi (когда будут добавлены)
  Image?: {
    url: string;
    alternativeText?: string;
    data?: {
      attributes?: {
        url: string;
        alternativeText?: string;
      };
    };
  };
  image?: {
    url: string;
    alternativeText?: string;
    data?: {
      attributes?: {
        url: string;
        alternativeText?: string;
      };
    };
  };
  // Другие поля, которые могут быть добавлены в будущем
  Genre?: string;
  Tuning?: string;
  Duration?: string;
  Views?: number;
  Difficulty?: string;
  Rating?: number;
  [key: string]: any; // Для дополнительных полей
}

export const TabsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Все жанры');
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
  const [tabs, setTabs] = useState<TabData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка данных из API Strapi
  useEffect(() => {
    const fetchTabs = async () => {
      try {
        setIsLoading(true);
        // Запрос с параметрами для получения всех полей
        const response = await fetch('http://localhost:1337/api/tabs?populate=*');
        
        if (!response.ok) {
          throw new Error(`Ошибка загрузки: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Загруженные данные из Strapi:', result);
        // Если есть хотя бы один элемент, выводим его структуру для отладки
        if (result.data && result.data.length > 0) {
          console.log('Структура первого элемента:', result.data[0]);
        }
        setTabs(result.data || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Произошла ошибка при загрузке данных');
        console.error('Ошибка при загрузке табулатур:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTabs();
  }, []);

  // Получаем уникальные жанры из данных (предполагаем, что есть поле Genre)
  const genres = ['Все жанры', ...new Set(tabs.map(tab => tab.Genre).filter(Boolean))];

  const filteredTabs = tabs.filter(tab => {
    const matchesSearch = tab.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tab.Description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'Все жанры' || tab.Genre === selectedGenre;
    
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-orange-600 bg-clip-text text-transparent">
            Табулатуры
          </h1>
          <p className="text-slate-400 text-lg">
            Большая коллекция табулатур для гитары всех уровней сложности
          </p>
        </div>

        {/* Поиск и фильтры */}
        <div className="mb-8 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-800 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={20} />
              <input
                type="text"
                placeholder="Поиск по названию или исполнителю..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            
            <div className="flex gap-3">
              <div className="relative">
                <button
                  onClick={() => setIsGenreDropdownOpen(!isGenreDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white hover:bg-slate-700 transition-colors"
                >
                  <Filter size={16} />
                  {selectedGenre}
                  <ChevronDown size={16} className={`transition-transform ${isGenreDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isGenreDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl min-w-40 z-10">
                    {genres.map((genre) => (
                      <button
                        key={genre}
                        onClick={() => {
                          setSelectedGenre(genre);
                          setIsGenreDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
            </div>
          </div>
        </div>

        {/* Состояние загрузки */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="animate-spin text-amber-500 mr-3" size={24} />
            <span className="text-slate-400">Загрузка табулатур...</span>
          </div>
        )}

        {/* Состояние ошибки */}
        {error && (
          <div className="text-center py-12">
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-red-400 mb-2">Ошибка загрузки</h3>
              <p className="text-slate-400 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Попробовать снова
              </button>
            </div>
          </div>
        )}

        {/* Список табулатур */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTabs.map((tab) => (
              <div
                key={tab.documentId}
                className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-800 p-6 hover:border-amber-600/30 transition-all duration-300 hover:shadow-lg hover:shadow-amber-600/10"
              >
                {/* Изображение - заглушка на будущее, когда будут добавлены изображения в Strapi */}
                {(tab.Image?.url || tab.image?.url || tab.Image?.data?.attributes?.url || tab.image?.data?.attributes?.url) ? (
                  <div className="mb-4 rounded-lg overflow-hidden">
                    <img
                      src={
                        // Обрабатываем различные форматы данных изображений из Strapi
                        (tab.Image?.url || tab.image?.url || tab.Image?.data?.attributes?.url || tab.image?.data?.attributes?.url)?.startsWith('http')
                          ? (tab.Image?.url || tab.image?.url || tab.Image?.data?.attributes?.url || tab.image?.data?.attributes?.url)
                          : `http://localhost:1337${tab.Image?.url || tab.image?.url || tab.Image?.data?.attributes?.url || tab.image?.data?.attributes?.url}`
                      }
                      alt={
                        tab.Image?.alternativeText ||
                        tab.image?.alternativeText ||
                        tab.Image?.data?.attributes?.alternativeText ||
                        tab.image?.data?.attributes?.alternativeText ||
                        tab.Name ||
                        'Изображение табулатуры'
                      }
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        console.error('Ошибка загрузки изображения:', {
                          Image: tab.Image,
                          image: tab.image,
                          url: tab.Image?.url || tab.image?.url || tab.Image?.data?.attributes?.url || tab.image?.data?.attributes?.url
                        });
                      }}
                    />
                  </div>
                ) : (
                  <div className="mb-4 rounded-lg overflow-hidden bg-slate-800 h-48 flex items-center justify-center">
                    <Music size={48} className="text-slate-600" />
                  </div>
                )}
                
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-white mb-3">{tab.Name || 'Без названия'}</h3>
                  <div
                    className="text-slate-400 prose prose-invert prose-sm max-w-none mb-3"
                    dangerouslySetInnerHTML={{ __html: tab.Description || 'Нет описания' }}
                  />
                  <div className="text-xs text-slate-500">
                    Добавлено: {new Date(tab.createdAt).toLocaleDateString('ru-RU')}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {tab.Genre && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                      {tab.Genre}
                    </span>
                  )}
                  {tab.Tuning && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                      {tab.Tuning}
                    </span>
                  )}
                  {tab.Duration && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                      {tab.Duration}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                  <div className="flex items-center gap-4">
                    {tab.Duration && (
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{tab.Duration}</span>
                      </div>
                    )}
                    {tab.Views && (
                      <div className="flex items-center gap-1">
                        <Music size={14} />
                        <span>{tab.Views.toLocaleString()} просмотров</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02]">
                  Открыть табулатуру
                </button>
              </div>
            ))}
          </div>
        )}

        {!isLoading && !error && filteredTabs.length === 0 && (
          <div className="text-center py-12">
            <Music className="mx-auto text-slate-600 mb-4" size={48} />
            <h3 className="text-xl font-semibold text-white mb-2">Табулатуры не найдены</h3>
            <p className="text-slate-400">Попробуйте изменить параметры поиска или фильтры</p>
          </div>
        )}

        {!isLoading && !error && (
          <div className="mt-12 text-center">
            <div className="bg-slate-900/30 backdrop-blur-sm rounded-xl border border-slate-800 p-8">
              <h2 className="text-2xl font-semibold mb-4">Не нашли нужную табулатуру?</h2>
              <p className="text-slate-400 mb-6">
                Наша коллекция постоянно пополняется из базы данных Strapi. Вы можете запросить добавление конкретной композиции.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                  Запросить табулатуру
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  Обновить данные
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};