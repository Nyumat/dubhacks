import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";
import { useSession } from "@clerk/clerk-react";
import { Music } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

export function Navbar() {
  const auth = useSession();
  const profileImage = auth.session?.user.hasImage
    ? auth.session?.user.imageUrl
    : "https://avatars.dicebear.com/api/initials/anonymous.svg";
  return (
    <header
      className={cn(
        "absolute top-0 z-50 w-full backdrop-blur-sm dark:bg-background/70 transition-all duration-300"
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-background to-primary/10 dark:from-primary/20 dark:via-background dark:to-primary/20 opacity-50"></div>
      <div className="relative px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" to="/">
          <Music className="h-6 w-6 text-primary" />
          <span className="ml-2 text-lg font-bold text-foreground">DubJam</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 mx-4 justify-center items-center">
          {auth.isSignedIn ? (
            <Link to="/">
              <img
                className="h-8 w-8 rounded-full"
                src={profileImage}
                alt="Profile"
              />
            </Link>
          ) : (
            <NavLink to="/login">Login</NavLink>
          )}

          {/* <NavLink to="/about">About</NavLink> */}
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
      className="text-sm font-medium hover:text-foreground transition-colors duration-200 hover:underline underline-offset-4"
      to={to}
    >
      {children}
    </Link>
  );
}
