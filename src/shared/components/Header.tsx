import React from 'react';
import { Music, Volume2 } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-950/50 backdrop-blur-md border-b border-white/10 p-4 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-amber-400 to-orange-600 p-2 rounded-lg shadow-lg shadow-orange-500/20">
            <Music className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              StrumMaster
            </h1>
            <p className="text-xs text-slate-500 font-medium">Guitar Rhythm Trainer</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 border border-slate-800 px-3 py-1 rounded-full">
          <Volume2 size={12} />
          <span>Synth Active</span>
        </div>
      </div>
    </header>
  );
};