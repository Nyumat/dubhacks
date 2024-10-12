import { ModeToggle } from "@/components/mode-toggle";
import { Music } from "lucide-react";
import { Link } from "react-router-dom";

export function Navbar() {
    return (
        <header className="px-4 lg:px-6 h-14 flex items-center">
            <Link className="flex items-center justify-center" to="/">
                <Music className="h-6 w-6" />
                <span className="ml-2 text-lg font-bold">DubJam</span>
            </Link>
            <nav className="ml-auto flex gap-4 sm:gap-6 mx-4">
                <Link className="text-sm font-medium hover:underline underline-offset-4" to="/login">
                    Login
                </Link>
                <Link className="text-sm font-medium hover:underline underline-offset-4" to="/register">
                    Register
                </Link>
                <Link className="text-sm font-medium hover:underline underline-offset-4" to="/about">
                    About
                </Link>
                {/* TODO: Only If they're authorized */}
                <Link className="text-sm font-medium hover:underline underline-offset-4" to="/platform">
                    Platform
                </Link>
            </nav>
            <ModeToggle />
        </header>
    );
}
