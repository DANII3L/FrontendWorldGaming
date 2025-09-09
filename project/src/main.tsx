import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ConfirmationProvider } from './app/shared/contexts/ConfirmationContext.tsx';
import { NotificationProvider } from './app/shared/contexts/NotificationContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfirmationProvider>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </ConfirmationProvider>
  </StrictMode>
);
