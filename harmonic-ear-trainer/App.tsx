import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Welcome from './components/Welcome';
import Trainer from './components/Trainer';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/trainer" element={<Trainer />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
