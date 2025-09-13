import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './app/auth/AuthContext';
import { NotificationProvider } from './app/shared/components/ui/UnifiedNotificationSystem';
import { ColorPaletteProvider } from './app/shared/contexts/ColorPaletteContext';
import { GameProvider } from './app/shared/contexts/GameContext';
import { ConfirmationProvider } from './app/shared/contexts/ConfirmationContext';
import LandingPage from './app/landing/LandingPage';
import ProtectedRoute from './app/shared/core/guards/ProtectedRoute';
import ProtectedLayout from './app/shared/layouts/ProtectedLayout';
import { routeElements } from './app/shared/routes/AutoRoutes';
import HomePage from './app/protected/pages/HomePage';
import AsyncOperationStatus from './app/shared/components/AsyncOperationStatus';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ConfirmationProvider>
          <ColorPaletteProvider>
            <GameProvider>
              <Router>
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
              </Router>
              <AsyncOperationStatus operations={[]} />
            </GameProvider>
          </ColorPaletteProvider>
        </ConfirmationProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;