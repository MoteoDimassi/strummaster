import React from 'react';
import { useAppSelector } from '../../../store/hooks';
import { Badge } from '@/src/components/ui/badge';

export const TunerDisplay: React.FC = () => {
  const { currentNote, currentFrequency, currentDetune, pointerPosition, isInTune } = useAppSelector(state => state.tuner);

  return (
    <div className="flex flex-col items-center w-full max-w-md">
      {/* Нота */}
      <div className="relative flex items-center justify-center w-40 h-40 mb-6 rounded-full bg-muted border-4 border-muted-foreground/20">
        <div className={`text-7xl font-bold transition-colors ${
          isInTune ? 'text-green-500' : 'text-foreground'
        }`}>
          {currentNote}
        </div>
        {isInTune && (
          <div className="absolute inset-0 rounded-full border-4 border-green-500 animate-pulse" />
        )}
      </div>

      {/* Частота */}
      <div className="flex items-center gap-2 mb-8">
        <Badge variant="outline" className="text-lg px-4 py-1">
          {currentFrequency} Hz
        </Badge>
      </div>

      {/* Индикатор настройки */}
      <div className="w-full relative mb-2">
        <div className="h-6 bg-muted rounded-full overflow-hidden relative border border-border">
          {/* Центральная метка */}
          <div className="absolute top-0 left-1/2 w-0.5 h-full bg-muted-foreground/30 -translate-x-1/2 z-10" />
          
          {/* Указатель */}
          <div
            className={`absolute top-0 w-1.5 h-full transition-all duration-100 rounded-full z-20 ${
              isInTune ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]' : 'bg-primary'
            }`}
            style={{
              left: `${pointerPosition}%`,
              transform: 'translateX(-50%)'
            }}
          />
        </div>
        
        {/* Шкала */}
        <div className="flex justify-between w-full px-1 mt-2 text-xs text-muted-foreground font-medium">
          <span>-50</span>
          <span>-25</span>
          <span>0</span>
          <span>+25</span>
          <span>+50</span>
        </div>
      </div>

      {/* Центы */}
      <div className={`text-sm font-medium mt-2 ${
        Math.abs(currentDetune) < 5 ? 'text-green-500' : 'text-muted-foreground'
      }`}>
        {currentDetune > 0 ? '+' : ''}{currentDetune} cents
      </div>
    </div>
  );
};