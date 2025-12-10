import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import BpmControl from './components/Metronome/BpmControl';
import BeatsVisualizer from './components/Metronome/BeatsVisualizer';
import Controls from './components/Metronome/Controls';
import Settings from './components/Metronome/Settings';
import Subdivisions from './components/Metronome/Subdivisions';
import { useMetronome } from './hooks/useMetronome';

// Separated Inner Component to use the Hook which requires Provider context if it were using useDispatch, 
// though here the hook is used inside MetronomeApp. Ideally, App wraps Provider.
const MetronomeApp: React.FC = () => {
  const { activeBeat } = useMetronome();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl p-8 md:p-12 border border-slate-100 relative">
        
        {/* Top Tag */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
             {/* This space reserved for future "Pro" badge or similar if needed */}
        </div>

        <BpmControl />
        
        <div className="flex justify-center mb-6">
           <div className="bg-orange-50 text-slate-500 text-xs font-bold px-3 py-1 uppercase tracking-widest rounded-md">
             Биты
           </div>
        </div>

        <BeatsVisualizer currentBeat={activeBeat} />
        
        <Controls />
        
        <hr className="border-slate-100 my-8" />
        
        <Settings />
        
        <Subdivisions />

      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <MetronomeApp />
    </Provider>
  );
};

export default App;
