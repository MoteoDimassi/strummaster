import React from 'react';
import { TunerDisplay } from '../features/tuner/components/TunerDisplay';
import { TunerControls } from '../features/tuner/components/TunerControls';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export const TunerPage: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 w-full">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-3xl font-bold text-primary">Гитарный Тюнер</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-8 p-6 sm:p-8">
          <TunerDisplay />
          <TunerControls />
        </CardContent>
      </Card>
    </div>
  );
};