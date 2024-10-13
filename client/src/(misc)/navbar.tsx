import { ModeToggle } from "@/components/mode-toggle";
import { cn } from '@/lib/utils';
import { Music } from "lucide-react";
import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import background_dark from "../assets/Background_dark1.png";
import background_light from "../assets/Background_light1.png";

export function Navbar() {
    const { theme } = useTheme();
    const [backgroundImage, setBackgroundImage] = useState('');

    useEffect(() => {
        if (theme === 'dark') {
            setBackgroundImage(`url(${background_dark})`);
        } else if (theme === 'light') {
            setBackgroundImage(`url(${background_light})`);
        } else {
            const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
            setBackgroundImage(`url(${isDarkMode ? background_dark : background_light})`);
        }
    }, [theme]);
    return (
        <header className={cn("sticky top-0 z-50 w-full backdrop-blur-sm bg-background/70 dark:bg-background/70 transition-all duration-300")} style={{ backgroundImage }}>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-background to-primary/10 dark:from-primary/20 dark:via-background dark:to-primary/20 opacity-50"></div>
            <div className="relative px-4 lg:px-6 h-14 flex items-center">
                <Link className="flex items-center justify-center" to="/">
                    <Music className="h-6 w-6 text-primary" />
                    <span className="ml-2 text-lg font-bold text-foreground">DubJam</span>
                </Link>
                <nav className="ml-auto flex gap-4 sm:gap-6 mx-4">
                    <NavLink to="/login">Login</NavLink>
                    <NavLink to="/register">Register</NavLink>
                    <NavLink to="/about">About</NavLink>
                    <NavLink to="/platform">Platform</NavLink>
                    <NavLink to="/settings">Settings</NavLink>
                </nav>
                <ModeToggle />
            </div>
        </header>
    );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
    return (
        <Link
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 hover:underline underline-offset-4"
            to={to}
        >
            {children}
        </Link>
    );
}