import React, { useEffect } from 'react';
import { useAppDispatch } from '../../../store/hooks';
import { closeTuner } from '../../../store/slices/tunerSlice';
import { TunerDisplay } from './TunerDisplay';
import { TunerControls } from './TunerControls';
import { useTuner } from '../hooks/useTuner';

export const TunerModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isRunning, mode, error, isOpen, start, stop, toggle, changeMode } = useTuner();

  useEffect(() => {
    if (isOpen) {
      start();
    } else {
      stop();
    }
  }, [isOpen, start, stop]);

  const handleClose = () => {
    dispatch(closeTuner());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md p-6 relative flex flex-col gap-6">
        {/* Кнопка закрытия */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Закрыть"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Заголовок */}
        <h2 className="text-2xl font-bold text-foreground text-center">Тюнер</h2>

        {/* Ошибка */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/30 text-destructive p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Управление */}
        <TunerControls
          isRunning={isRunning}
          mode={mode}
          onToggle={toggle}
          onModeChange={changeMode}
        />

        {/* Дисплей тюнера */}
        <div className="mt-4">
          <TunerDisplay />
        </div>
      </div>
    </div>
  );
};