import Spaces from "@ably/spaces";
import { useAbly } from "ably/react";
import { Route, Routes } from "react-router-dom";
import { Navbar } from "./(misc)/navbar";
import About from "./pages/about/about";
import Login from "./pages/auth/login";
import Landing from "./pages/landing/landing-page";
import { PlatformHome } from "./pages/platform/home";
import Settings from "./pages/settings/settings";
import { ThemeProvider } from "@/components/theme-provider";

export default function App() {
  const client = useAbly();
  const spaces = new Spaces(client);
  return (
    <>
      <ThemeProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/platform" element={<PlatformHome spaces={spaces} />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
      </ThemeProvider>
    </>
  );
}
