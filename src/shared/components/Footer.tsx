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
    <footer className="bg-background-secondary border-t border-accents-neutral-border p-6 mt-auto shadow-minimal">
      <div className="max-w-[1280px] mx-auto">
        {/* Основной контент футера */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Информация о приложении */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-brand-blue p-2 rounded-soft shadow-minimal">
                <Music className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-primary">
                  StrumMaster
                </h3>
                <p className="text-caption text-text-secondary font-medium">Guitar Rhythm Trainer</p>
              </div>
            </div>
            <p className="text-body text-text-secondary text-center md:text-left">
              Ваш помощник в изучении игры на гитаре. Тренируйте ритм, настраивайте инструмент и улучшайте навыки.
            </p>
          </div>

          {/* Полезные ссылки */}
          <div className="flex flex-col items-center md:items-center">
            <h4 className="text-body font-semibold text-text-primary mb-4">Полезные ссылки</h4>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleLinkClick('Политика конфиденциальности')}
                className="text-body text-text-secondary hover:text-brand-blue transition-colors"
              >
                Политика конфиденциальности
              </button>
              <button
                onClick={() => handleLinkClick('Договор оферты')}
                className="text-body text-text-secondary hover:text-brand-blue transition-colors"
              >
                Договор оферты
              </button>
            </div>
          </div>

          {/* Социальные сети */}
          <div className="flex flex-col items-center md:items-end">
            <h4 className="text-body font-semibold text-text-primary mb-4">Мы в социальных сетях</h4>
            <div className="flex gap-3">
              <button
                onClick={() => handleSocialClick('Telegram')}
                className="bg-background-surface-tinted hover:bg-brand-blue p-2 rounded-soft transition-colors group"
                aria-label="Telegram"
              >
                <Send className="text-text-secondary group-hover:text-white transition-colors" size={18} />
              </button>
              <button
                onClick={() => handleSocialClick('TikTok')}
                className="bg-background-surface-tinted hover:bg-brand-blue p-2 rounded-soft transition-colors group"
                aria-label="TikTok"
              >
                <Type className="text-text-secondary group-hover:text-white transition-colors" size={18} />
              </button>
              <button
                onClick={() => handleSocialClick('Instagram')}
                className="bg-background-surface-tinted hover:bg-brand-blue p-2 rounded-soft transition-colors group"
                aria-label="Instagram"
              >
                <Instagram className="text-text-secondary group-hover:text-white transition-colors" size={18} />
              </button>
              <button
                onClick={() => handleSocialClick('YouTube')}
                className="bg-background-surface-tinted hover:bg-brand-blue p-2 rounded-soft transition-colors group"
                aria-label="YouTube"
              >
                <Youtube className="text-text-secondary group-hover:text-white transition-colors" size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Разделитель */}
        <div className="border-t border-accents-neutral-border mb-6"></div>

        {/* Копирайт и версия */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-caption text-text-secondary text-center md:text-left">
            © {currentYear} StrumMaster. Все права защищены.
          </div>
          <div className="flex items-center gap-4">
            <div className="text-caption text-text-secondary font-mono">
              Версия: {appVersion}
            </div>
            <div className="flex items-center gap-2 text-caption font-mono text-text-secondary border border-accents-neutral-border px-3 py-1 rounded-full">
              <Music size={10} />
              <span>Synth Active</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};