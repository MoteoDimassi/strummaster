'use client';

import React from 'react';
import { Send, Type, Instagram, Youtube, Music } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const appVersion = '0.0.0'; // Версия из package.json

  const handleSocialClick = (social: string) => {
    console.log(`Переход на социальную сеть: ${social}`);
  };

  const handleLinkClick = (link: string) => {
    console.log(`Переход на страницу: ${link}`);
  };

  return (
    <footer className="bg-slate-950/50 backdrop-blur-md border-t border-white/10 p-6 mt-auto">
      <div className="max-w-6xl mx-auto">
        {/* Основной контент футера */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Информация о приложении */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-br from-amber-400 to-orange-600 p-2 rounded-lg shadow-lg shadow-orange-500/20">
                <Music className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                  StrumMaster
                </h3>
                <p className="text-xs text-slate-500 font-medium">Guitar Rhythm Trainer</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 text-center md:text-left">
              Ваш помощник в изучении игры на гитаре. Тренируйте ритм, настраивайте инструмент и улучшайте навыки.
            </p>
          </div>

          {/* Полезные ссылки */}
          <div className="flex flex-col items-center md:items-center">
            <h4 className="text-sm font-semibold text-white mb-4">Полезные ссылки</h4>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleLinkClick('Политика конфиденциальности')}
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                Политика конфиденциальности
              </button>
              <button
                onClick={() => handleLinkClick('Договор оферты')}
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                Договор оферты
              </button>
            </div>
          </div>

          {/* Социальные сети */}
          <div className="flex flex-col items-center md:items-end">
            <h4 className="text-sm font-semibold text-white mb-4">Мы в социальных сетях</h4>
            <div className="flex gap-3">
              <button
                onClick={() => handleSocialClick('Telegram')}
                className="bg-slate-800 hover:bg-slate-700 p-2 rounded-lg transition-colors group"
                aria-label="Telegram"
              >
                <Send className="text-slate-400 group-hover:text-white transition-colors" size={18} />
              </button>
              <button
                onClick={() => handleSocialClick('TikTok')}
                className="bg-slate-800 hover:bg-slate-700 p-2 rounded-lg transition-colors group"
                aria-label="TikTok"
              >
                <Type className="text-slate-400 group-hover:text-white transition-colors" size={18} />
              </button>
              <button
                onClick={() => handleSocialClick('Instagram')}
                className="bg-slate-800 hover:bg-slate-700 p-2 rounded-lg transition-colors group"
                aria-label="Instagram"
              >
                <Instagram className="text-slate-400 group-hover:text-white transition-colors" size={18} />
              </button>
              <button
                onClick={() => handleSocialClick('YouTube')}
                className="bg-slate-800 hover:bg-slate-700 p-2 rounded-lg transition-colors group"
                aria-label="YouTube"
              >
                <Youtube className="text-slate-400 group-hover:text-white transition-colors" size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Разделитель */}
        <div className="border-t border-white/10 mb-6"></div>

        {/* Копирайт и версия */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-slate-500 text-center md:text-left">
            © {currentYear} StrumMaster. Все права защищены.
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs text-slate-600 font-mono">
              Версия: {appVersion}
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 border border-slate-800 px-3 py-1 rounded-full">
              <Music size={10} />
              <span>Synth Active</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};