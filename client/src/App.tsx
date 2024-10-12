import { Route, Routes } from 'react-router-dom';
import { Navbar } from './(misc)/navbar';
import About from './pages/about/about';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import Landing from './pages/landing/landing-page';
import Settings from './pages/settings/settings';
import { PlatformHome } from './pages/platform/home';

export default function App() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/platform" element={<PlatformHome />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<h1>Not Found</h1>} />
            </Routes>
        </>
    )
}
