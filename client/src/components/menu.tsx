import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarShortcut,
    MenubarTrigger,
} from "@/components/ui/menubar";
import { ClipboardIcon } from "lucide-react";
import React, { useCallback, useEffect } from "react";
import { CopyLinkDialog } from "./copy-link";

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
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        // Check if the key is already being handled by an input field
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
            return;
        }

        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const modifierKey = isMac ? e.metaKey : e.ctrlKey;

        if (modifierKey) {
            switch (e.key.toLowerCase()) {
                case 'p':
                    e.preventDefault();
                    handleStartClick();
                    setIsPlaying((prev) => !prev);
                    break;
                case 's':
                    e.preventDefault();
                    handleSaveClick();
                    break;
                case 'c':
                    e.preventDefault();
                    clearSteps();
                    break;
                case 'd':
                    e.preventDefault();
                    handleClearSessionClick();
                    break;
                case 't':
                    e.preventDefault();
                    setIsLayoutUnlocked((prev) => !prev);
                    break;
            }
        }
    }, [handleStartClick, handleSaveClick, handleClearSessionClick, clearSteps, setIsLayoutUnlocked, setIsPlaying]);

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);
    return (
        <Menubar className="dark:bg-primary/50 bg-primary/40 text-purple-100">
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
            <MenubarMenu>
                <MenubarTrigger>DubJam</MenubarTrigger>
                <MenubarContent>
                    <CopyLinkDialog link={window.location.href} />
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    );
}