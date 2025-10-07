import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './app/auth/AuthContext';
import { NotificationProvider } from './app/shared/components/ui/UnifiedNotificationSystem';
import { ColorPaletteProvider, GameProvider, ConfirmationProvider } from './app/shared/contexts';
import NotificationServiceProvider from './app/shared/components/NotificationServiceProvider';
import { NotificationCenterProvider } from './app/shared/contexts/NotificationCenterContext';
import NavigationProvider from './app/shared/components/NavigationProvider';
import LandingPage from './app/landing/LandingPage';
import ProtectedRoute from './app/shared/core/guards/ProtectedRoute';
import ProtectedLayout from './app/shared/layouts/ProtectedLayout';
import { routeElements } from './app/shared/routes/AutoRoutes';
import HomePage from './app/protected/pages/HomePage';
import AsyncOperationStatus from './app/shared/components/AsyncOperationStatus';

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
          <Routes>
            <Route path="/" element={<LandingPage />} />
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
        </NavigationProvider>
      </Router>
      <AsyncOperationStatus operations={[]} />
    </AppProviders>
  );
}

export default App;