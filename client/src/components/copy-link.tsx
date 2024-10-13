import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckIcon, ClipboardIcon } from "lucide-react";
import { useState } from 'react';

export function CopyLinkDialog({ link = "https://localhost:5173" }) {
    const [isCopied, setIsCopied] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(link);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="flex items-center justfiy-between space-x-2">
                                <Button variant="ghost" className="text-white" onClick={() => setIsDialogOpen(true)}>
                                    Copy Link
                                    <ClipboardIcon className="ml-16 h-4 w-4 text-gray-400" />
                                </Button>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Click to copy link</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Your DubJam Share Link</DialogTitle>
                    <DialogDescription>Share this link with your friends to jam together!
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                        <Input
                            className="w-full"
                            id="link"
                            defaultValue={link}
                            readOnly
                        />
                    </div>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button type="submit" size="sm" className="px-3" onClick={copyToClipboard}>
                                    <span className="sr-only">Copy</span>
                                    {isCopied ? <CheckIcon className="h-4 w-4" /> : <ClipboardIcon className="h-4 w-4" />}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{isCopied ? 'Copied!' : 'Copy'}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </DialogContent>
        </Dialog>
    );
}