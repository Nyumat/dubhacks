import { ClerkProvider } from "@clerk/clerk-react";
import { Realtime } from "ably";
import { AblyProvider } from "ably/react";
import { nanoid } from "nanoid";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import App from "./App.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import "./index.css";

const client = new Realtime({
    clientId: nanoid(),
    key: import.meta.env.VITE_ABLY_KEY,
});

const PUBLISHABLE_KEY =
    "pk_test_d29ydGh5LWZvd2wtMjcuY2xlcmsuYWNjb3VudHMuZGV2JA";

createRoot(document.getElementById("root")!).render(
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl={"/"}>
        <AblyProvider client={client}>
            <BrowserRouter>
                <ThemeProvider>
                    <App />
                    <Toaster />
                </ThemeProvider>
            </BrowserRouter>
        </AblyProvider>
    </ClerkProvider>
);
