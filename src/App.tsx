import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { store } from './store';
import { MainLayout } from './layouts/MainLayout';
import { LandingPage } from './pages/LandingPage';
import { TrainerPage } from './pages/TrainerPage';
import { TunerPage } from './pages/TunerPage';
import { DictationPage } from './pages/DictationPage';
import { BlogPage } from './pages/BlogPage';
import { CoursesPage } from './pages/CoursesPage';
import { TabsPage } from './pages/TabsPage';
import { MetronomePage } from './pages/MetronomePage';
import './index.css';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="trainer" element={<TrainerPage />} />
            <Route path="tuner" element={<TunerPage />} />
            <Route path="dictation" element={<DictationPage />} />
            <Route path="blog" element={<BlogPage />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="tabs" element={<TabsPage />} />
            <Route path="metronome" element={<MetronomePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;