import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { 
  closeTuner, 
  setTunerMode, 
  startTuner, 
  stopTuner, 
  updateTunerResult,
  setTunerError 
} from '../../../store/slices/tunerSlice';
import { TunerMode } from '../../../store/slices/tunerSlice';
import { tunerService } from '../services/TunerService';
import { TunerDisplay } from './TunerDisplay';
import { TunerControls } from './TunerControls';

export const TunerModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isOpen, isRunning, mode, error } = useAppSelector(state => state.tuner);

  useEffect(() => {
    if (isOpen && !isRunning) {
      startTunerService();
    } else if (!isOpen && isRunning) {
      stopTunerService();
    }

    return () => {
      if (isRunning) {
        stopTunerService();
      }
    };
  }, [isOpen, isRunning]);

  const startTunerService = async () => {
    console.log('[TunerModal] Запуск тюнера через tunerService');
    try {
      await tunerService.start();
      dispatch(startTuner());
      
      // Start continuous analysis
      tunerService.startContinuousAnalysis((result) => {
        console.log('[TunerModal] Получен результат от tunerService:', result);
        if (result) {
          dispatch(updateTunerResult(result));
        }
      });
    } catch (err) {
      console.error('[TunerModal] Ошибка при запуске тюнера:', err);
      const errorMessage = err instanceof Error ? err.message : 'Не удалось запустить тюнер';
      dispatch(setTunerError(errorMessage));
    }
  };

  const stopTunerService = () => {
    tunerService.stop();
    dispatch(stopTuner());
  };

  const handleClose = () => {
    dispatch(closeTuner());
  };

  const handleModeChange = (newMode: TunerMode) => {
    dispatch(setTunerMode(newMode));
    tunerService.setMode(newMode);
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
          onToggle={isRunning ? stopTunerService : startTunerService}
          onModeChange={handleModeChange}
        />

        {/* Дисплей тюнера */}
        <div className="mt-4">
          <TunerDisplay />
        </div>
      </div>
    </div>
  );
};