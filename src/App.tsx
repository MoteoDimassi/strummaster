import React, { Suspense, lazy } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { store } from './store';
import { MainLayout } from './layouts/MainLayout';
import { ErrorBoundary } from './shared/components/ErrorBoundary';
import './index.css';

// Lazy loading pages for better performance
const LandingPage = lazy(() => import('./pages/LandingPage').then(module => ({ default: module.LandingPage })));
const TrainerPage = lazy(() => import('./pages/TrainerPage').then(module => ({ default: module.TrainerPage })));
const TunerPage = lazy(() => import('./pages/TunerPage').then(module => ({ default: module.TunerPage })));
const DictationPage = lazy(() => import('./pages/DictationPage').then(module => ({ default: module.DictationPage })));
const BlogPage = lazy(() => import('./pages/BlogPage').then(module => ({ default: module.BlogPage })));
const CoursesPage = lazy(() => import('./pages/CoursesPage').then(module => ({ default: module.CoursesPage })));
const TabsPage = lazy(() => import('./pages/TabsPage').then(module => ({ default: module.TabsPage })));
const MetronomePage = lazy(() => import('./pages/MetronomePage').then(module => ({ default: module.MetronomePage })));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
  </div>
);

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <HelmetProvider>
        <ErrorBoundary>
          <BrowserRouter>
            <Suspense fallback={<LoadingFallback />}>
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
            </Suspense>
          </BrowserRouter>
        </ErrorBoundary>
      </HelmetProvider>
    </Provider>
  );
};

export default App;