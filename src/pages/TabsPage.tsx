import React, { useState } from 'react';
import { Search, Music, Clock, Star, Filter, ChevronDown } from 'lucide-react';

export const TabsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Все жанры');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Любая сложность');
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
  const [isDifficultyDropdownOpen, setIsDifficultyDropdownOpen] = useState(false);

  // Моковые данные для табулатур
  const tabs = [
    {
      id: 1,
      title: "Stairway to Heaven",
      artist: "Led Zeppelin",
      genre: "Рок",
      difficulty: "Средний",
      duration: "8:02",
      rating: 4.9,
      views: 15420,
      tuning: "Standard (EADGBE)"
    },
    {
      id: 2,
      title: "Blackbird",
      artist: "The Beatles",
      genre: "Поп-рок",
      difficulty: "Средний",
      duration: "2:18",
      rating: 4.8,
      views: 12350,
      tuning: "Standard (EADGBE)"
    },
    {
      id: 3,
      title: "Dust in the Wind",
      artist: "Kansas",
      genre: "Фолк-рок",
      difficulty: "Начальный",
      duration: "3:27",
      rating: 4.7,
      views: 18930,
      tuning: "Standard (EADGBE)"
    },
    {
      id: 4,
      title: "Hotel California",
      artist: "Eagles",
      genre: "Рок",
      difficulty: "Продвинутый",
      duration: "6:30",
      rating: 4.9,
      views: 22150,
      tuning: "Standard (EADGBE)"
    },
    {
      id: 5,
      title: "Wonderwall",
      artist: "Oasis",
      genre: "Поп-рок",
      difficulty: "Начальный",
      duration: "4:18",
      rating: 4.6,
      views: 25780,
      tuning: "Standard (EADGBE)"
    },
    {
      id: 6,
      title: "Classical Gas",
      artist: "Mason Williams",
      genre: "Классика",
      difficulty: "Продвинутый",
      duration: "3:05",
      rating: 4.8,
      views: 8920,
      tuning: "Standard (EADGBE)"
    }
  ];

  const genres = ['Все жанры', 'Рок', 'Поп-рок', 'Фолк-рок', 'Классика', 'Джаз', 'Блюз'];
  const difficulties = ['Любая сложность', 'Начальный', 'Средний', 'Продвинутый'];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Начальный":
        return "bg-green-900/30 text-green-400 border-green-800";
      case "Средний":
        return "bg-yellow-900/30 text-yellow-400 border-yellow-800";
      case "Продвинутый":
        return "bg-red-900/30 text-red-400 border-red-800";
      default:
        return "bg-gray-900/30 text-gray-400 border-gray-800";
    }
  };

  const filteredTabs = tabs.filter(tab => {
    const matchesSearch = tab.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         tab.artist.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'Все жанры' || tab.genre === selectedGenre;
    const matchesDifficulty = selectedDifficulty === 'Любая сложность' || tab.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesGenre && matchesDifficulty;
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
              
              <div className="relative">
                <button
                  onClick={() => setIsDifficultyDropdownOpen(!isDifficultyDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white hover:bg-slate-700 transition-colors"
                >
                  <Filter size={16} />
                  {selectedDifficulty}
                  <ChevronDown size={16} className={`transition-transform ${isDifficultyDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isDifficultyDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl min-w-40 z-10">
                    {difficulties.map((difficulty) => (
                      <button
                        key={difficulty}
                        onClick={() => {
                          setSelectedDifficulty(difficulty);
                          setIsDifficultyDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                      >
                        {difficulty}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Список табулатур */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTabs.map((tab) => (
            <div 
              key={tab.id} 
              className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-800 p-6 hover:border-amber-600/30 transition-all duration-300 hover:shadow-lg hover:shadow-amber-600/10"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-1">{tab.title}</h3>
                  <p className="text-slate-400">{tab.artist}</p>
                </div>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star size={16} fill="currentColor" />
                  <span className="text-white text-sm">{tab.rating}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                  {tab.genre}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(tab.difficulty)}`}>
                  {tab.difficulty}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                  {tab.tuning}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{tab.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Music size={14} />
                    <span>{tab.views.toLocaleString()} просмотров</span>
                  </div>
                </div>
              </div>
              
              <button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02]">
                Открыть табулатуру
              </button>
            </div>
          ))}
        </div>

        {filteredTabs.length === 0 && (
          <div className="text-center py-12">
            <Music className="mx-auto text-slate-600 mb-4" size={48} />
            <h3 className="text-xl font-semibold text-white mb-2">Табулатуры не найдены</h3>
            <p className="text-slate-400">Попробуйте изменить параметры поиска или фильтры</p>
          </div>
        )}

        <div className="mt-12 text-center">
          <div className="bg-slate-900/30 backdrop-blur-sm rounded-xl border border-slate-800 p-8">
            <h2 className="text-2xl font-semibold mb-4">Не нашли нужную табулатуру?</h2>
            <p className="text-slate-400 mb-6">
              Наша коллекция постоянно пополняется. Вы можете запросить добавление конкретной композиции.
            </p>
            <button className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
              Запросить табулатуру
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};