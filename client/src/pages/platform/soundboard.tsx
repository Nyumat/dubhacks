import { Sequencer } from "@/components/sequencer";
import { Synthesizer } from "@/components/synthesizer";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import * as Ably from 'ably';
import { useState } from "react";

export interface SoundboardProps {
    channel: Ably.RealtimeChannel | null;
}

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

export function Soundboard({ channel }: SoundboardProps) {
    const [isSequencerOpen, setIsSequencerOpen] = useState(true);
    const [isPianoOpen, setIsPianoOpen] = useState(false);
    return (
        <div>
            <div>
                <div className="flex items-center justify-between gap-4">
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
                <div>
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
                    {isPianoOpen && (
                        <Synthesizer
                            channel={channel!}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}