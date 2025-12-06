import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { store } from './store';
import { MainLayout } from './layouts/MainLayout';
import { HomePage } from './pages/HomePage';
import { TunerPage } from './pages/TunerPage';
import { DictationPage } from './pages/DictationPage';
import { BlogPage } from './pages/BlogPage';
import './index.css';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="tuner" element={<TunerPage />} />
            <Route path="dictation" element={<DictationPage />} />
            <Route path="blog" element={<BlogPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;