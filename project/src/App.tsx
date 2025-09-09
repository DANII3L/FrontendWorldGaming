import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './app/auth/AuthContext';
import { NotificationProvider } from './app/shared/contexts/NotificationContext';
import { ColorPaletteProvider } from './app/shared/contexts/ColorPaletteContext';
import { GameProvider } from './app/shared/contexts/GameContext';
import { ConfirmationProvider } from './app/shared/contexts/ConfirmationContext';
import { NotificationCenterProvider } from './app/shared/contexts/NotificationCenterContext';
import { NotificationModalProvider } from './app/shared/contexts/NotificationModalContext';
import LandingPage from './app/landing/LandingPage';
import ProtectedRoute from './app/shared/core/guards/ProtectedRoute';
import ProtectedLayout from './app/shared/layouts/ProtectedLayout';
import { routeElements } from './app/shared/routes/AutoRoutes';
import HomePage from './app/protected/pages/HomePage';
import GlobalNotificationModal from './app/shared/components/GlobalNotificationModal';
import AsyncOperationStatus from './app/shared/components/AsyncOperationStatus';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ConfirmationProvider>
          <ColorPaletteProvider>
            <GameProvider>
              <NotificationCenterProvider>
                <NotificationModalProvider>
                  <Router>
                    <Routes>
                      <Route path="/" element={<LandingPage />} />
                      <Route path="/worldGaming" element={
                        <ProtectedRoute>
                          <ProtectedLayout />
                        </ProtectedRoute>
                      }>
                        <Route index element={<HomePage />} />
                        {routeElements}
                      </Route>
                    </Routes>
                  </Router>
                  <GlobalNotificationModal />
                  <AsyncOperationStatus operations={[]} />
                </NotificationModalProvider>
              </NotificationCenterProvider>
            </GameProvider>
          </ColorPaletteProvider>
        </ConfirmationProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;