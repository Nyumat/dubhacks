import { Route, Routes } from 'react-router-dom';
import { Navbar } from './(misc)/navbar';
import About from './pages/about/about';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import Landing from './pages/landing/landing-page';

export default function App() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/platform" element={<Platform />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<h1>Not Found</h1>} />
            </Routes>
        </>
    )
}


function Platform() {
    return <h1>Platform</h1>
}

// function About() {
//     return <h1>About</h1>
// }
