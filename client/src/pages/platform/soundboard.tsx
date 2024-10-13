/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Sequencer } from "@/components/sequencer";
import { Synthesizer } from "@/components/synthesizer";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useState } from "react";


interface MusicControlsProps {
    isSequencerOpen: boolean;
    setIsSequencerOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isPianoOpen: boolean;
    setIsPianoOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MusicControls = ({ isSequencerOpen, setIsSequencerOpen, isPianoOpen, setIsPianoOpen }: MusicControlsProps) => {
    return (
        <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-4">
                <Switch
                    id="sequencer-mode"
                    checked={isSequencerOpen}
                    onCheckedChange={setIsSequencerOpen}
                />
                <Label htmlFor="sequencer-mode">Sequencer</Label>
            </div>
            <div className="flex items-center space-x-4">
                <Switch
                    id="piano-mode"
                    checked={isPianoOpen}
                    onCheckedChange={setIsPianoOpen}
                />
                <Label htmlFor="piano-mode">Piano</Label>
            </div>
        </div>
    );
};

export function Soundboard({ channel }: { channel: any }) {
    const [isSequencerOpen, setIsSequencerOpen] = useState(true);
    const [isPianoOpen, setIsPianoOpen] = useState(false);
    return (
        <div className="min-h-screen p-4">
            <div className=" mx-auto mt-16">
                <div className={cn("flex items-center justify-between gap-4 py-4")}>
                    <div>
                        <h1 className="text-2xl font-semibold dark:text-white">DubJam Soundboard</h1>
                        <p className="text-sm dark:text-neutral-400">Share the link with your friends to jam together!</p>
                    </div>
                    <MusicControls
                        isSequencerOpen={isSequencerOpen}
                        setIsSequencerOpen={setIsSequencerOpen}
                        isPianoOpen={isPianoOpen}
                        setIsPianoOpen={setIsPianoOpen}
                    />
                </div>
                <div className="flex flex-col gap-4 relative">
                    {isSequencerOpen && (
                        <Sequencer
                            samples={[
                                { url: "/samples/clap.wav", name: "Clap" },
                                { url: "/samples/hat.wav", name: "Closed Hat" },
                                { url: "/samples/kick.wav", name: "808 Kick" },
                                { url: "/samples/kick2.wav", name: "808 Kick 2" },
                                { url: "/samples/ohat.wav", name: "Open Hat" },
                                { url: "/samples/snare.wav", name: "Snare" },
                                { url: "/samples/tom.wav", name: "Tom" },
                                { url: "/samples/tom2.wav", name: "Tom 2" },
                            ]}
                            channel={channel!}
                        />
                    )}
                    <div className="relative flex justify-center w-full">
                        {isPianoOpen && (
                            <div className="w-max">
                                {/* // @ts-ignore */}
                                <Synthesizer channel={channel} />
                            </div>
                        )}
                    </div>

                    <div>
                        {!isSequencerOpen && !isPianoOpen && (
                            <div className="flex items-center justify-center h-64">
                                <p className="text-lg dark:text-neutral-400 text-center">Hey there! <br /> Select an instrument to start jamming!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}