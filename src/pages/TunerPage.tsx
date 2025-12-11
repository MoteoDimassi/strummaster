import React, { useEffect } from 'react';
import { TunerDisplay } from '../features/tuner/components/TunerDisplay';
import { TunerControls } from '../features/tuner/components/TunerControls';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useTuner } from '../features/tuner/hooks/useTuner';

export const TunerPage: React.FC = () => {
  const { isRunning, mode, error, toggle, changeMode, stop } = useTuner();

  // Останавливаем тюнер при уходе со страницы
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 w-full">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-3xl font-bold text-primary">Гитарный Тюнер</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-8 p-6 sm:p-8">
          {error && (
            <div className="w-full bg-destructive/10 border border-destructive/30 text-destructive p-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}
          <TunerDisplay />
          <TunerControls
            isRunning={isRunning}
            mode={mode}
            onToggle={toggle}
            onModeChange={changeMode}
          />
        </CardContent>
      </Card>
    </div>
  );
};