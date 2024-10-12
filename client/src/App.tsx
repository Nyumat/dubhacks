import { Route, Routes } from 'react-router-dom'
import { Navbar } from './(misc)/navbar'
import Landing from './pages/landing/landing-page'
import About from './pages/about/about';

export default function App() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/platform" element={<Platform />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<h1>Login</h1>} />
                <Route path="/register" element={<h1>Register</h1>} />
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
