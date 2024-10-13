import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarShortcut,
    MenubarTrigger,
} from "@/components/ui/menubar";
import React from "react";

type props = {
    handleStartClick: () => Promise<void>;
    handleSaveClick: () => Promise<void>;
    handleClearSessionClick: () => Promise<void>;
    clearSteps: () => void;
    setIsLayoutUnlocked: React.Dispatch<React.SetStateAction<boolean>>;
    isLayoutUnlocked: boolean;
};

export function SequencerMenu({
    handleStartClick,
    handleSaveClick,
    handleClearSessionClick,
    clearSteps,
    setIsLayoutUnlocked,
    isLayoutUnlocked,
}: props) {
    const [isPlaying, setIsPlaying] = React.useState(false);

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "p" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                handleStartClick();
                setIsPlaying((prev) => !prev);
            }
            if (e.key === "s" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                handleSaveClick();
            }
            if (e.key === "c" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                clearSteps();
            }
            if (e.key === "d" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                handleClearSessionClick();
            }
            if (e.key === "t" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsLayoutUnlocked((prev) => !prev);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);

    }, [
        handleStartClick,
        handleSaveClick,
        handleClearSessionClick,
        clearSteps,
        setIsLayoutUnlocked,
        isLayoutUnlocked,
    ]);

    return (
        <Menubar>
            <MenubarMenu>
                <MenubarTrigger>Sequencer</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem
                        onSelect={() => {
                            handleStartClick();
                            setIsPlaying((prev) => !prev);
                        }}
                    >
                        {isPlaying ? "Stop" : "Play"}{" "}
                        <MenubarShortcut>⌘ + P</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem onSelect={handleSaveClick}>
                        Save Session <MenubarShortcut>⌘ + S</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem onSelect={clearSteps}>
                        Clear Steps <MenubarShortcut>⌘ + C</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem onSelect={handleClearSessionClick}>
                        Clear Session <MenubarShortcut>⌘ + D</MenubarShortcut>
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
                <MenubarTrigger>Layout</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem onSelect={() => setIsLayoutUnlocked((prev) => !prev)}>
                        {`${isLayoutUnlocked ? "Lock" : "Unlock"} Track Layout`}{" "}
                        <MenubarShortcut>⌘  T</MenubarShortcut>
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    );
}