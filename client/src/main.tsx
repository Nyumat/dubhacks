import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { ThemeProvider } from './components/theme-provider.tsx';
import './index.css';
import { AblyProvider } from "ably/react";
import { nanoid } from "nanoid";
import { Realtime } from 'ably';
import { Toaster } from 'sonner';

const client = new Realtime({
    clientId: nanoid(),
    key: import.meta.env.VITE_ABLY_KEY,
});

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AblyProvider client={client}>
            <BrowserRouter>
                <ThemeProvider>
                    <App />
                    <Toaster />
                </ThemeProvider>
            </BrowserRouter>
        </AblyProvider>
    </StrictMode>,
)
