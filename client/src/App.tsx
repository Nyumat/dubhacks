import { Route, Routes } from 'react-router-dom'
import { Navbar } from './(misc)/navbar'

export default function App() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/test" element={<Test />} />
                <Route path="/login" element={<h1>Login</h1>} />
                <Route path="/register" element={<h1>Register</h1>} />
                <Route path="*" element={<h1>Not Found</h1>} />
            </Routes>
        </>
    )
}

function Home() {
    return <h1>Home</h1>
}

function About() {
    return <h1>About</h1>
}

function Test() {
    return <h1>Test</h1>
}
