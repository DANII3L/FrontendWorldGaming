import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './app/auth/AuthContext';
import { NotificationProvider } from './app/shared/components/ui/UnifiedNotificationSystem';
import { ColorPaletteProvider, GameProvider, ConfirmationProvider } from './app/shared/contexts';
import NotificationServiceProvider from './app/shared/components/NotificationServiceProvider';
import { NotificationCenterProvider } from './app/shared/contexts/NotificationCenterContext';
import NavigationProvider from './app/shared/components/NavigationProvider';
import ProtectedRoute from './app/shared/core/guards/ProtectedRoute';
import ProtectedLayout from './app/shared/layouts/ProtectedLayout';
import { routeElements } from './app/shared/routes/AutoRoutes';
import AsyncOperationStatus from './app/shared/components/AsyncOperationStatus';
import LoadingScreen from './app/shared/components/ui/LoadingScreen';

// Code splitting: Lazy load de páginas principales
const LandingPage = lazy(() => import('./app/landing/LandingPage'));
const HomePage = lazy(() => import('./app/protected/pages/HomePage'));
const GoogleCallback = lazy(() => import('./app/auth/pages/GoogleCallback'));
const SteamCallback = lazy(() => import('./app/auth/pages/SteamCallback'));

// Componente wrapper para manejar los providers
const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <NotificationServiceProvider>
          <NotificationCenterProvider>
            <ConfirmationProvider>
              <ColorPaletteProvider>
                <GameProvider>
                  {children}
                </GameProvider>
              </ColorPaletteProvider>
            </ConfirmationProvider>
          </NotificationCenterProvider>
        </NotificationServiceProvider>
      </NotificationProvider>
    </AuthProvider>
  );
};

function App() {
  return (
    <AppProviders>
      <Router>
        <NavigationProvider>
          <Suspense fallback={<LoadingScreen title="Cargando..." subtitle="Por favor espera..." />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth/google/callback" element={<GoogleCallback />} />
              <Route path="/auth/steam/callback" element={<SteamCallback />} />
              <Route path="/worldGaming" element={
                <ProtectedRoute>
                  <ProtectedLayout />
                </ProtectedRoute>
              }>
                <Route index element={<HomePage />} />
                {routeElements.map((route, index) => (
                  <React.Fragment key={`route-${index}`}>
                    {route}
                  </React.Fragment>
                ))}
              </Route>
            </Routes>
          </Suspense>
        </NavigationProvider>
      </Router>
      <AsyncOperationStatus operations={[]} />
    </AppProviders>
  );
}

export default App;