import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Music, Volume2, ChevronDown, Menu, X } from 'lucide-react';
import { useAppDispatch } from '../../store/hooks';
import { openTuner } from '../../store/slices/tunerSlice';

interface HeaderProps {
  onToolSelect?: (tool: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onToolSelect }) => {
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleToolsClick = (path: string) => {
    navigate(path);
    setIsToolsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleOpenTuner = () => {
    dispatch(openTuner());
  };

  return (
    <header className="bg-slate-950/50 backdrop-blur-md border-b border-white/10 p-4 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-amber-400 to-orange-600 p-2 rounded-lg shadow-lg shadow-orange-500/20">
            <Music className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              StrumMaster
            </h1>
            <p className="text-xs text-slate-500 font-medium">Guitar Rhythm Trainer</p>
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
          >
            Главная
          </Link>
          <Link
            to="/courses"
            className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
          >
            Курсы
          </Link>
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
                <Link
                  to="/tuner"
                  onClick={() => setIsToolsDropdownOpen(false)}
                  className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  Тюнер
                </Link>
                <Link
                  to="/metronome"
                  onClick={() => setIsToolsDropdownOpen(false)}
                  className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  Метроном
                </Link>
                <Link
                  to="/chord-analyzer"
                  onClick={() => setIsToolsDropdownOpen(false)}
                  className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  Анализатор аккордов
                </Link>
                <Link
                  to="/chord-generator"
                  onClick={() => setIsToolsDropdownOpen(false)}
                  className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  Генератор аккордов
                </Link>
                <Link
                  to="/dictation"
                  onClick={() => setIsToolsDropdownOpen(false)}
                  className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  Музыкальный диктант
                </Link>
              </div>
            )}
          </div>
          <Link
            to="/blog"
            className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
          >
            Блог
          </Link>
          <Link
            to="/tabs"
            className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
          >
            Табы
          </Link>
          <button
            onClick={handleOpenTuner}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors ml-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            Тюнер
          </button>
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
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-slate-300 hover:text-white transition-colors text-sm font-medium text-left"
            >
              Главная
            </Link>
            <Link
              to="/courses"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-slate-300 hover:text-white transition-colors text-sm font-medium text-left"
            >
              Курсы
            </Link>
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
                  <Link
                    to="/tuner"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-left text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    Тюнер
                  </Link>
                  <Link
                    to="/metronome"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-left text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    Метроном
                  </Link>
                  <Link
                    to="/chord-analyzer"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-left text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    Анализатор аккордов
                  </Link>
                  <Link
                    to="/chord-generator"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-left text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    Генератор аккордов
                  </Link>
                  <Link
                    to="/dictation"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-left text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    Музыкальный диктант
                  </Link>
                </div>
              )}
            </div>
            <Link
              to="/blog"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-slate-300 hover:text-white transition-colors text-sm font-medium text-left"
            >
              Блог
            </Link>
            <Link
              to="/tabs"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-slate-300 hover:text-white transition-colors text-sm font-medium text-left"
            >
              Табы
            </Link>
            <button
              onClick={handleOpenTuner}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              Тюнер
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};