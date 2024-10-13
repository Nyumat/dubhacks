import * as Ably from 'ably';
import { Sequencer } from "@/components/sequencer";
import { Synthesizer } from "@/components/synthesizer";
import { useState } from "react";

export interface SoundboardProps {
    channel: Ably.RealtimeChannel | null;
}

export function Soundboard({ channel }: SoundboardProps) {
    const [isSequencerOpen, setIsSequencerOpen] = useState(false);
    const [isPianoOpen, setIsPianoOpen] = useState(false);
    return (
        <div>
          <div>
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={() => setIsSequencerOpen(!isSequencerOpen)}
                        className="bg-gray-800 text-white px-4 py-2 rounded-lg"
                    >
                        {isSequencerOpen ? "Close Sequencer" : "Open Sequencer"}
                    </button>
                    <button
                        onClick={() => setIsPianoOpen(!isPianoOpen)}
                        className="bg-gray-800 text-white px-4 py-2 rounded-lg"
                    >
                        {isPianoOpen ? "Close Piano" : "Open Piano"}
                    </button>
                </div>
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
                {isPianoOpen && <Synthesizer />}
            </div>
        </div>
    )
}