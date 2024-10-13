import * as Ably from 'ably';
import { Sequencer } from "@/components/sequencer";

export interface SoundboardProps {
    channel: Ably.RealtimeChannel | null;
}

export function Soundboard({ channel }: SoundboardProps) {

    return (
        <div>
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
        </div>
    )
}