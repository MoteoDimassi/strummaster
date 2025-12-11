import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Music, ChevronDown, Menu, X } from 'lucide-react';
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
    <header className="bg-background-secondary/80 backdrop-blur-md border-b border-accents-neutral-border p-4 sticky top-0 z-50 shadow-minimal">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="bg-brand-blue p-2 rounded-soft shadow-minimal">
            <Music className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary">
              StrumMaster
            </h1>
            <p className="text-caption text-text-secondary font-medium">Guitar Rhythm Trainer</p>
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="text-text-secondary hover:text-brand-blue transition-colors text-body font-medium"
          >
            Главная
          </Link>
          <Link
            to="/trainer"
            className="text-text-secondary hover:text-brand-blue transition-colors text-body font-medium"
          >
            Тренажер
          </Link>
          <Link
            to="/courses"
            className="text-text-secondary hover:text-brand-blue transition-colors text-body font-medium"
          >
            Курсы
          </Link>
          <div className="relative">
            <button
              onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
              className="flex items-center gap-1 text-text-secondary hover:text-brand-blue transition-colors text-body font-medium"
            >
              Инструменты
              <ChevronDown size={16} className={`transition-transform ${isToolsDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isToolsDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 bg-background-secondary border border-accents-neutral-border rounded-card shadow-card min-w-48 py-2">
                <Link
                  to="/tuner"
                  onClick={() => setIsToolsDropdownOpen(false)}
                  className="block w-full text-left px-4 py-2 text-body text-text-secondary hover:bg-background-surface-tinted hover:text-brand-blue transition-colors"
                >
                  Тюнер
                </Link>
                <Link
                  to="/metronome"
                  onClick={() => setIsToolsDropdownOpen(false)}
                  className="block w-full text-left px-4 py-2 text-body text-text-secondary hover:bg-background-surface-tinted hover:text-brand-blue transition-colors"
                >
                  Метроном
                </Link>
                <Link
                  to="/chord-trainer"
                  onClick={() => setIsToolsDropdownOpen(false)}
                  className="block w-full text-left px-4 py-2 text-body text-text-secondary hover:bg-background-surface-tinted hover:text-brand-blue transition-colors"
                >
                  Подбор аккордов
                </Link>
                <Link
                  to="/dictation"
                  onClick={() => setIsToolsDropdownOpen(false)}
                  className="block w-full text-left px-4 py-2 text-body text-text-secondary hover:bg-background-surface-tinted hover:text-brand-blue transition-colors"
                >
                  Мелодический диктант
                </Link>
              </div>
            )}
          </div>
          <Link
            to="/blog"
            className="text-text-secondary hover:text-brand-blue transition-colors text-body font-medium"
          >
            Блог
          </Link>
          <Link
            to="/tabs"
            className="text-text-secondary hover:text-brand-blue transition-colors text-body font-medium"
          >
            Табы
          </Link>
          <button
            onClick={handleOpenTuner}
            className="flex items-center gap-2 px-4 py-2 bg-brand-blue hover:bg-brand-hover text-white rounded-image font-medium transition-colors ml-4 shadow-minimal"
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
          className="md:hidden text-text-secondary hover:text-brand-blue"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-accents-neutral-border">
          <nav className="flex flex-col gap-4">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-text-secondary hover:text-brand-blue transition-colors text-body font-medium text-left"
            >
              Главная
            </Link>
            <Link
              to="/trainer"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-text-secondary hover:text-brand-blue transition-colors text-body font-medium text-left"
            >
              Тренажер
            </Link>
            <Link
              to="/courses"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-text-secondary hover:text-brand-blue transition-colors text-body font-medium text-left"
            >
              Курсы
            </Link>
            <div>
              <button
                onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
                className="flex items-center gap-1 text-text-secondary hover:text-brand-blue transition-colors text-body font-medium w-full text-left"
              >
                Инструменты
                <ChevronDown size={16} className={`transition-transform ${isToolsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isToolsDropdownOpen && (
                <div className="mt-2 ml-4 space-y-2">
                  <Link
                    to="/tuner"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-left text-body text-text-secondary hover:text-brand-blue transition-colors"
                  >
                    Тюнер
                  </Link>
                  <Link
                    to="/metronome"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-left text-body text-text-secondary hover:text-brand-blue transition-colors"
                  >
                    Метроном
                  </Link>
                  <Link
                    to="/chord-trainer"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-left text-body text-text-secondary hover:text-brand-blue transition-colors"
                  >
                    Подбор аккордов
                  </Link>
                  <Link
                    to="/dictation"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-left text-body text-text-secondary hover:text-brand-blue transition-colors"
                  >
                    Мелодический диктант
                  </Link>
                </div>
              )}
            </div>
            <Link
              to="/blog"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-text-secondary hover:text-brand-blue transition-colors text-body font-medium text-left"
            >
              Блог
            </Link>
            <Link
              to="/tabs"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-text-secondary hover:text-brand-blue transition-colors text-body font-medium text-left"
            >
              Табы
            </Link>
            <button
              onClick={handleOpenTuner}
              className="flex items-center gap-2 px-4 py-2 bg-brand-blue hover:bg-brand-hover text-white rounded-image font-medium transition-colors shadow-minimal"
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