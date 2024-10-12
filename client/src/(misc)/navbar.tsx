import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";

const NavItems = ({ className = "", onClick = () => { } }) => (
    <>
        <li>
            <Link to="/" className={className} onClick={onClick}>
                Home
            </Link>
        </li>
        <li>
            <Link to="/about" className={className} onClick={onClick}>
                About
            </Link>
        </li>
        <li>
            <Link to="/test" className={className} onClick={onClick}>
                Test
            </Link>
        </li>
    </>
);

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
                <div className="mr-4 flex">
                    <Link to="/" className="mx-6 flex items-center space-x-2">
                        <span className="font-bold text-xl">DubJam</span>
                    </Link>
                    <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                        <NavItems className="transition-colors hover:text-foreground/80 text-foreground/60" />
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        <Button variant="ghost" className="h-9 w-9 px-0 md:hidden">
                            Join
                        </Button>
                    </div>
                    <nav className="flex items-center space-x-2">
                        <ModeToggle />
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="h-9 w-9 px-0 md:hidden"
                                >
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right">
                                <nav className="flex flex-col space-y-4">
                                    <NavItems
                                        className="text-foreground/60 transition-colors hover:text-foreground/80"
                                        onClick={() => {
                                            document.body.click();
                                        }}
                                    />
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </nav>
                </div>
            </div>
        </header>
    );
}