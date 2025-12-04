import React, { useState } from 'react';
import { Music, Volume2, ChevronDown, Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (item: string) => {
    console.log(`Нажато на: ${item}`);
    setIsMobileMenuOpen(false);
  };

  const handleToolsClick = (tool: string) => {
    console.log(`Выбран инструмент: ${tool}`);
    setIsToolsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-slate-950/50 backdrop-blur-md border-b border-white/10 p-4 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-amber-400 to-orange-600 p-2 rounded-lg shadow-lg shadow-orange-500/20">
            <Music className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              StrumMaster
            </h1>
            <p className="text-xs text-slate-500 font-medium">Guitar Rhythm Trainer</p>
          </div>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <button
            onClick={() => handleNavClick('Главная')}
            className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
          >
            Главная
          </button>
          <button
            onClick={() => handleNavClick('Курсы')}
            className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
          >
            Курсы
          </button>
          <div className="relative">
            <button
              onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
              className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors text-sm font-medium"
            >
              Инструменты
              <ChevronDown size={16} className={`transition-transform ${isToolsDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isToolsDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 bg-slate-900 border border-white/10 rounded-lg shadow-xl min-w-48 py-2">
                <button
                  onClick={() => handleToolsClick('Тюнер')}
                  className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  Тюнер
                </button>
                <button
                  onClick={() => handleToolsClick('Метроном')}
                  className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  Метроном
                </button>
                <button
                  onClick={() => handleToolsClick('Анализатор аккордов')}
                  className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  Анализатор аккордов
                </button>
                <button
                  onClick={() => handleToolsClick('Генератор аккордов')}
                  className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  Генератор аккордов
                </button>
              </div>
            )}
          </div>
          <button
            onClick={() => handleNavClick('Блог')}
            className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
          >
            Блог
          </button>
          <button
            onClick={() => handleNavClick('Табы')}
            className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
          >
            Табы
          </button>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 border border-slate-800 px-3 py-1 rounded-full ml-4">
            <Volume2 size={12} />
            <span>Synth Active</span>
          </div>
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-slate-300 hover:text-white"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-white/10">
          <nav className="flex flex-col gap-4">
            <button
              onClick={() => handleNavClick('Главная')}
              className="text-slate-300 hover:text-white transition-colors text-sm font-medium text-left"
            >
              Главная
            </button>
            <button
              onClick={() => handleNavClick('Курсы')}
              className="text-slate-300 hover:text-white transition-colors text-sm font-medium text-left"
            >
              Курсы
            </button>
            <div>
              <button
                onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
                className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors text-sm font-medium w-full text-left"
              >
                Инструменты
                <ChevronDown size={16} className={`transition-transform ${isToolsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isToolsDropdownOpen && (
                <div className="mt-2 ml-4 space-y-2">
                  <button
                    onClick={() => handleToolsClick('Тюнер')}
                    className="block w-full text-left text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    Тюнер
                  </button>
                  <button
                    onClick={() => handleToolsClick('Метроном')}
                    className="block w-full text-left text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    Метроном
                  </button>
                  <button
                    onClick={() => handleToolsClick('Анализатор аккордов')}
                    className="block w-full text-left text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    Анализатор аккордов
                  </button>
                  <button
                    onClick={() => handleToolsClick('Генератор аккордов')}
                    className="block w-full text-left text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    Генератор аккордов
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={() => handleNavClick('Блог')}
              className="text-slate-300 hover:text-white transition-colors text-sm font-medium text-left"
            >
              Блог
            </button>
            <button
              onClick={() => handleNavClick('Табы')}
              className="text-slate-300 hover:text-white transition-colors text-sm font-medium text-left"
            >
              Табы
            </button>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 border border-slate-800 px-3 py-1 rounded-full">
              <Volume2 size={12} />
              <span>Synth Active</span>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};