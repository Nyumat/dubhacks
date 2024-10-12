import { Link } from "react-router-dom";

export function Navbar() {
    return (
        <div className="bg-secondary p-4">
            <nav className="container mx-auto">
                <ul className="flex space-x-4">
                    <li>
                        <Link to="/" className="text-white hover:text-gray-400">Home</Link>
                    </li>
                    <li>
                        <Link to="/about" className="text-white hover:text-gray-400">About</Link>
                    </li>
                    <li>
                        <Link to="/test" className="text-white hover:text-gray-400">Test</Link>
                    </li>
                </ul>
            </nav>
        </div>
    )
}
