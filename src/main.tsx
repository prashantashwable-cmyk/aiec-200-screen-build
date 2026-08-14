import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { DataProvider } from '@/data/DataProvider';
import { SessionProvider } from '@/session/SessionProvider';
import { ToastProvider } from '@/design-system';
import { CaptureDraftProvider } from '@/features/leadCapture/CaptureDraftProvider';

// Order matters: tokens define the variables everything else consumes.
import 'leaflet/dist/leaflet.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/utilities.css';
import './styles/components.css';
import './styles/shell.css';
import './styles/map.css';

// Registers i18next and applies the saved language + font pairing.
import '@/i18n';

/**
 * To go live on Firebase, implement `firebaseRepository` (see data/firebase.ts)
 * and pass it here:  <DataProvider repository={firebaseRepository}>
 * Everything downstream codes against the Repository interface, so nothing else
 * changes.
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <DataProvider>
        <SessionProvider>
          <ToastProvider>
            <CaptureDraftProvider>
              <App />
            </CaptureDraftProvider>
          </ToastProvider>
        </SessionProvider>
      </DataProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
