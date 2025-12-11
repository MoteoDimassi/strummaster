import React from 'react';
import { TunerMode } from '../../../store/slices/tunerSlice';
import { Button } from '@/src/components/ui/button';
import { Mic, MicOff } from 'lucide-react';

interface TunerControlsProps {
  isRunning: boolean;
  mode: TunerMode;
  onToggle: () => void;
  onModeChange: (mode: TunerMode) => void;
}

export const TunerControls: React.FC<TunerControlsProps> = ({
  isRunning,
  mode,
  onToggle,
  onModeChange
}) => {
  return (
    <div className="flex flex-col gap-6 w-full max-w-md">
      <Button
        onClick={onToggle}
        variant={isRunning ? "destructive" : "default"}
        size="lg"
        className="w-full text-lg h-12"
      >
        {isRunning ? (
          <>
            <MicOff className="mr-2 h-5 w-5" />
            Выключить микрофон
          </>
        ) : (
          <>
            <Mic className="mr-2 h-5 w-5" />
            Включить микрофон
          </>
        )}
      </Button>

      {/* Переключатель режима */}
      <div className="flex justify-center gap-2 p-1 bg-muted rounded-lg">
        <button
          onClick={() => onModeChange('chromatic')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            mode === 'chromatic'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Хроматический
        </button>
        <button
          onClick={() => onModeChange('guitar')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            mode === 'guitar'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Гитара
        </button>
      </div>
    </div>
  );
};