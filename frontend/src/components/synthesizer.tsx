
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { keys, notes } from "@/lib/constants";
import { cn } from "@/lib/utils";
import * as Ably from "ably";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import * as Tone from "tone";
import { SynthManager } from "./synth-manager";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

type Note = {
    note: string;
    keyName: string;
};

type NoteKeyMap = {
    [key: string]: Note;
};

type PianoKeyProps = {
    note: string;
    playNote: (note: string, isKeyDown: boolean) => void;
    keyName: string;
    keyDown: boolean;
};

const generateNotes = (startOctave: number, numOctaves: number) => {
    let result: Note[] = [];
    for (let i = 0; i < numOctaves; i++) {
        const octave = startOctave + i;
        result = result.concat(
            notes.map((note: string, index: number) => ({
                note: `${note}${octave}`,
                keyName: keys[i * 12 + index],
            }))
        );
    }
    return result;
};

const PianoKey = ({ note, playNote, keyName, keyDown }: PianoKeyProps) => {
    const isSharp = note.includes("#");
    return (
        <div
            className={cn(
                "relative inline-block",
                isSharp ? "top-0 w-2 h-16 -ml-3 z-20" : "w-12 h-32"
            )}
        >
            <button
                onMouseDown={() => playNote(note, true)}
                onMouseUp={() => playNote(note, false)}
                onContextMenu={(e) => {
                    e.preventDefault();
                    playNote(note, false);
                }}
                className={`${isSharp
                    ? "absolute z-20 h-16 w-6 bg-purple-900"
                    : "h-32 w-12 bg-white"
                    } rounded-sm border border-solid 
                    ${isSharp ? "border-black" : "border-neutral-800"} 
                    ${keyDown ? "bg-purple-400" : ""}`}
            >
                <span className="text-[8px] text-purple-400 absolute bottom-1 right-1">{keyName}</span>
            </button>
        </div>
    );
};

const instruments = [
    { name: "Synth", value: "synth" },
    { name: "AM Synth", value: "amSynth" },
    { name: "FM Synth", value: "fmSynth" },
    { name: "Membrane Synth", value: "membraneSynth" },
];

type DubJamSynth = Tone.PolySynth | Tone.Synth | Tone.AMSynth | Tone.FMSynth | Tone.MembraneSynth;
export type RecordedNote = {
    note: string;
    time: number;
    type: string;
};

export function Synthesizer({ channel }: { channel: Ably.RealtimeChannel }) {
    const [octave, setOctave] = useState(3);
    const [startOctave, setStartOctave] = useState(3);
    const [synth, setSynth] = useState<DubJamSynth | undefined>(undefined);
    const [isRecording, setIsRecording] = useState(false);
    const [recordedNotes, setRecordedNotes] = useState<RecordedNote[]>([]);
    const [isPlayingBack, setIsPlayingBack] = useState(false);
    const [keysDown, setKeysDown] = useState<Record<string, boolean>>({});
    const [currentInstrument, setCurrentInstrument] = useState("synth");
    const [playbackProgress, setPlaybackProgress] = useState(0);
    const [, setPlaybackDuration] = useState(0);
    const [startRecordingTime, setStartRecordingTime] = useState(0);
    const [showControls, setShowControls] = useState(false);

    const startRecording = useCallback(() => {
        setRecordedNotes([]);
        setIsRecording(true);
        setStartRecordingTime(Tone.now());
    }, []);

    const playBackRecording = useCallback(() => {
        if (recordedNotes.length === 0) return;

        setIsPlayingBack(true);
        Tone.Transport.stop();
        Tone.Transport.cancel();

        const playbackDuration = recordedNotes[recordedNotes.length - 1].time;
        setPlaybackDuration(playbackDuration);

        recordedNotes.forEach((noteEvent) => {
            const { note, time, type } = noteEvent;
            if (type === 'attack') {
                Tone.Transport.schedule((time) => {
                    synth?.triggerAttack(note, time);
                }, time);
            } else {
                Tone.Transport.schedule((time) => {
                    synth?.triggerRelease(note, time);
                }, time);
            }
        });

        Tone.Transport.start();

        const interval = setInterval(() => {
            const elapsedTime = Tone.Transport.seconds;
            setPlaybackProgress((elapsedTime / playbackDuration) * 100);
            if (elapsedTime >= playbackDuration) {
                clearInterval(interval);
                setIsPlayingBack(false);
                setPlaybackProgress(0);
                Tone.Transport.stop();
                Tone.Transport.cancel();
            }
        }, 100);
    }, [recordedNotes, synth]);

    useEffect(() => {
        const createSynth = () => {
            let newSynth;
            switch (currentInstrument) {
                case "amSynth":
                    newSynth = new Tone.PolySynth(Tone.AMSynth);
                    break;
                case "fmSynth":
                    newSynth = new Tone.PolySynth(Tone.FMSynth);
                    break;
                case "membraneSynth":
                    newSynth = new Tone.PolySynth(Tone.MembraneSynth);
                    break;
                default:
                    newSynth = new Tone.PolySynth(Tone.Synth);
                    break;
            }
            // newSynth.set({ maxPolyphony: 32 });
            newSynth.toDestination();
            return newSynth;
        };

        const newSynth = createSynth();
        setSynth(newSynth);

        return () => {
            newSynth.dispose();
        };
    }, [currentInstrument]);

    useEffect(() => {
        const handleCapsLock = (e: KeyboardEvent) => {
            if (e.getModifierState("CapsLock")) {
                toast.error("Caps Lock is on. This will affect the piano keys.");
            }
        };
        window.addEventListener("keydown", handleCapsLock);
        return () => window.removeEventListener("keydown", handleCapsLock);
    }, []);

    useEffect(() => {
        const handleModifierKeyUp = (event: KeyboardEvent) => {
            if (event.key === "Control" || event.key === "Alt" || event.key === "Meta") {
                Object.keys(keysDown).forEach((note) => {
                    if (keysDown[note]) {
                        playNoteWithAbly(note, false);
                    }
                });
                setKeysDown({});
            }
        };

        window.addEventListener("keyup", handleModifierKeyUp);

        return () => window.removeEventListener("keyup", handleModifierKeyUp);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [keysDown]);

    useEffect(() => {
        const noteKeyMap = generateNotes(startOctave, octave).reduce(
            (acc: NoteKeyMap, noteObj: Note) => {
                acc[noteObj.keyName] = noteObj;
                return acc;
            },
            {}
        );

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.repeat || event.ctrlKey || event.altKey || event.metaKey) return;

            if (noteKeyMap[event.key] && !keysDown[noteKeyMap[event.key].note]) {
                const { note } = noteKeyMap[event.key];
                playNoteWithAbly(note, true);
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            if (noteKeyMap[event.key]) {
                const { note } = noteKeyMap[event.key];
                playNoteWithAbly(note, false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [octave, keysDown, startOctave]);

    useEffect(() => {
        const subscribeToChannel = async () => {
            try {
                await channel.subscribe("keyPress", (message) => {
                    const { note } = message.data;
                    console.log("Received keyPress event:", note);
                    playNote(note, true, false);
                });

                await channel.subscribe("keyRelease", (message) => {
                    const { note } = message.data;
                    console.log("Received keyRelease event:", note);
                    playNote(note, false, false);
                });
            } catch (error) {
                console.error("Error subscribing to the channel:", error);
            }
        };

        subscribeToChannel();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [channel]);

    const playNoteWithAbly = (note: string, isKeyDown: boolean) => {
        if (isKeyDown) {
            channel.publish("keyPress", { note });
        } else {
            channel.publish("keyRelease", { note });
        }
        playNote(note, isKeyDown, true);
    };

    const playNote = (note: string, isKeyDown: boolean, isLocal: boolean) => {
        if (isKeyDown) {
            synth?.triggerAttack(note);
            setKeysDown((prevKeysDown) => ({ ...prevKeysDown, [note]: true }));
            if (isRecording && isLocal) {
                setRecordedNotes((prevNotes) => [
                    ...prevNotes,
                    { note, time: Tone.now() - startRecordingTime, type: 'attack' },
                ]);
            }
        } else {
            synth?.triggerRelease(note);
            setKeysDown((prevKeysDown) => ({ ...prevKeysDown, [note]: false }));
            if (isRecording && isLocal) {
                setRecordedNotes((prevNotes) => [
                    ...prevNotes,
                    { note, time: Tone.now() - startRecordingTime, type: 'release' },
                ]);
            }
        }
    };

    const slideAnimation = {
        hidden: { opacity: 0, x: -100 },
        visible: { opacity: 1, x: 0 },
    };

    useEffect(() => {
        const handleOctaveChange = (event: KeyboardEvent) => {
            if (event.key === "ArrowUp") {
                Object.keys(keysDown).forEach((note) => {
                    if (keysDown[note]) {
                        playNoteWithAbly(note, false);
                    }
                });
                setKeysDown({});
                setStartOctave((prev) => Math.min(prev + 1, 8));
            } else if (event.key === "ArrowDown") {
                Object.keys(keysDown).forEach((note) => {
                    if (keysDown[note]) {
                        playNoteWithAbly(note, false);
                    }
                });
                setKeysDown({});
                setStartOctave((prev) => Math.max(prev - 1, 1));
            }
        };

        window.addEventListener("keydown", handleOctaveChange);

        return () => window.removeEventListener("keydown", handleOctaveChange);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [keysDown]);

    const handleOctaveChange = (direction: "up" | "down") => {
        Object.keys(keysDown).forEach((note) => {
            if (keysDown[note]) {
                playNoteWithAbly(note, false);
            }
        });
        setKeysDown({});
        setStartOctave((prev) =>
            direction === "up" ? Math.min(prev + 1, 8) : Math.max(prev - 1, 1)
        );
    };

    const handleInstrumentChange = (value: string) => {
        setCurrentInstrument(value);
        // Release all currently pressed keys
        Object.keys(keysDown).forEach((note) => {
            if (keysDown[note]) {
                playNoteWithAbly(note, false);
            }
        });
        setKeysDown({});
    };

    const stopRecording = () => {
        setIsRecording(false);
    }

    return (
        <div className="h-full flex flex-col items-center gap-4 dark:bg-black/50 p-4 rounded-lg shadow-md backdrop-blur-lg border border-neutral-200 dark:border-neutral-700">
            <div className="w-full flex justify-center -my-6 py-4">
                <Label htmlFor="showControls" className="mr-2">
                    Show Controls
                </Label>
                <Switch checked={showControls} onCheckedChange={setShowControls} />
                {showControls &&
                    <SynthManager
                        setShowControls={setShowControls}
                        playBackRecording={playBackRecording}
                        startRecording={startRecording}
                        isRecording={isRecording}
                        stopRecording={stopRecording}
                        octave={octave}
                        setOctave={setOctave}
                        startOctave={startOctave}
                        setStartOctave={setStartOctave}
                        isPlayingBack={isPlayingBack}
                        recordedNotes={recordedNotes}
                        playbackProgress={playbackProgress}
                    />
                }
            </div>
            <div className="flex flex-col justify-center items-center my-2 gap-4">
                <h2 className="text-xl font-bold text-center">Type of Synthesizer</h2>
                <Select onValueChange={handleInstrumentChange} value={currentInstrument}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select instrument" />
                    </SelectTrigger>
                    <SelectContent>
                        {instruments.map((instrument) => (
                            <SelectItem key={instrument.value} value={instrument.value}>
                                {instrument.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="flex h-fit flex-row justify-center items-center overflow-x-auto mt-4">
                <Button onClick={() => handleOctaveChange("down")} className="mr-4 h-6 w-6 bg-primary text-white rounded-full flex items-center justify-center">
                    ←
                </Button>
                <motion.div
                    className="flex"
                    initial="hidden"
                    animate="visible"
                    variants={slideAnimation}
                >
                    {generateNotes(startOctave, octave).map((noteObj) => (
                        <PianoKey
                            key={noteObj.note}
                            note={noteObj.note}
                            keyName={noteObj.keyName}
                            playNote={playNoteWithAbly}
                            keyDown={keysDown[noteObj.note] || false}
                        />
                    ))}
                </motion.div>
                <Button onClick={() => handleOctaveChange("up")} className="ml-4 h-6 w-6 bg-primary text-white rounded-full flex items-center justify-center">
                    →
                </Button>
            </div>

            <p className="text-neutral-500 text-sm mt-4">
                Use the keyboard to play notes. Use the arrow keys to change the octave (up/down).
                <br/>If the note is playing indefinitely, press CTRL / CMD / ALT to release the note.
            </p>
        </div>
    );
}