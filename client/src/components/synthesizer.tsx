/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck - this is a temporary fix to allow the code to compile
import { Input } from "@/components/ui/input";
import { keys, notes } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import * as Tone from "tone";
import * as Ably from 'ably';


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
            )} // Black keys are skinnier and overlaid between white keys
        >
            <button
                onMouseDown={() => playNote(note, true)}
                onMouseUp={() => playNote(note, false)}
                onContextMenu={(e) => {
                    // This addresses right click indefinite play issue
                    e.preventDefault();
                    playNote(note, false);
                }}
                className={`${isSharp
                    ? "absolute z-20 h-16 w-6 bg-black"
                    : "h-32 w-12 bg-white"
                    } rounded-sm border border-solid 
                    ${isSharp ? "border-black" : "border-neutral-800"} 
                    ${keyDown ? "bg-gray-300" : ""}`}
            >
                <span className="text-[8px] text-white absolute bottom-1 right-1">{keyName}</span>
            </button>
        </div>
    );
};


export function Synthesizer({ channel }: Ably.RealtimeChannel) {
    //remember to remove setOctave and just display the entire set of keys and octaves as a single scrollable row of keys
    const [octave, setOctave] = useState(3);
    const [startOctave, setStartOctave] = useState(3);
    const [synth, setSynth] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordedNotes, setRecordedNotes] = useState([]);
    const [isPlayingBack, setIsPlayingBack] = useState(false);
    const [keysDown, setKeysDown] = useState<Record<string, boolean>>({});

    useEffect(() => {
        setSynth(new Tone.PolySynth(Tone.Synth, { maxPolyphony: 32 }).toDestination()); // Increased max polyphony to 32

        return () => synth?.dispose();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const handleCapsLock = (e) => {
            if (e.getModifierState("CapsLock")) {
                alert("Notice: Caps Lock is on. This will affect the piano keys.");
            }
        };
        window.addEventListener("keydown", handleCapsLock);
        return () => window.removeEventListener("keydown", handleCapsLock);
    }, []);

    useEffect(() => {
        const noteKeyMap = generateNotes(startOctave, octave).reduce(
            (acc: NoteKeyMap, noteObj: Note) => {
                acc[noteObj.keyName] = noteObj;
                return acc;
            },
            {}
        );

        const handleKeyDown = (event: KeyboardEvent) => {
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
    }, [synth, keysDown, startOctave, octave]);


    // Subscribe to Ably channel for real-time key press/release events
    useEffect(() => {
        const subscribeToChannel = async () => {
            try {
                await channel.subscribe("keyPress", (message) => {
                    const { note } = message.data;
                    playNote(note, true, false); // false indicates not locally triggered
                });

                await channel.subscribe("keyRelease", (message) => {
                    const { note } = message.data;
                    playNote(note, false, false); // false indicates not locally triggered
                });
            } catch (error) {
                console.error("Error subscribing to the channel:", error);
            }
        };

        subscribeToChannel();
    }, [channel, synth]);

    // Publish key press and release events to Ably
    const playNoteWithAbly = (note: string, isKeyDown: boolean) => {
        if (isKeyDown) {
            // Publish keyPress event
            channel.publish("keyPress", { note });
        } else {
            // Publish keyRelease event
            channel.publish("keyRelease", { note });
        }
        playNote(note, isKeyDown, true); // true indicates locally triggered
    };


    const playNote = (note: string, isKeyDown: boolean, isLocal: boolean) => {
        if (isKeyDown) {
            synth?.triggerAttack(note);
            setKeysDown((prevKeysDown) => ({ ...prevKeysDown, [note]: true }));
            if (isRecording && isLocal) {
                setRecordedNotes((prevNotes) => [
                    ...prevNotes,
                    { note, time: Tone.now(), type: 'attack' },
                ]);
            }
        } else {
            synth?.triggerRelease(note);
            setKeysDown((prevKeysDown) => ({ ...prevKeysDown, [note]: false }));
            if (isRecording && isLocal) {
                setRecordedNotes((prevNotes) => [
                    ...prevNotes,
                    { note, time: Tone.now(), type: 'release' },
                ]);
            }
        }
    };

    const startRecording = () => {
        setIsRecording(true);
        setRecordedNotes([]);
    };

    const stopRecording = () => {
        setIsRecording(false);
    };

    const playBackRecording = () => {
        if (recordedNotes.length === 0) return;
        setIsPlayingBack(true);
        const now = Tone.now();

        for (let i = 0; i < recordedNotes.length; i++) {
            const { note, time, type } = recordedNotes[i];
            const delay = time - recordedNotes[0].time;
            if (type === 'attack') {
                synth.triggerAttack(note, now + delay);
            } else if (type === 'release') {
                synth.triggerRelease(note, now + delay);
            }
        }

        setTimeout(
            () => setIsPlayingBack(false),
            (recordedNotes[recordedNotes.length - 1].time - recordedNotes[0].time) *
            1000
        );
    };

    const visualizeRecording = () => {
        return (
            <div className="flex flex-col mt-4">
                <h3 className="text-lg mb-2">Recorded Notes:</h3>
                <div className="grid grid-cols-4 gap-2">
                    {recordedNotes.map((record, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center"
                            style={{
                                width: "20px",
                                height: `${Math.max(20, (recordedNotes[index + 1]?.time - record.time) * 100)}px`,
                                backgroundColor: record.type === 'attack' ? "#4CAF50" : "#FF5722",
                                marginRight: "4px",
                            }}
                        >
                            <span className="text-xs text-white font-bold">
                                {record.note}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col items-center bg-background text-white">
            {/* 
            <SynthControls {...{
                startRecording,
                stopRecording,
                playBackRecording,
                octave,
                setOctave,
                startOctave,
                setStartOctave,
                isRecording,
                isPlayingBack,
                recordedNotes,
            }} />
            */}
            <div className="flex h-fit flex-row justify-center overflow-x-auto mt-4">
                {generateNotes(startOctave, octave).map((noteObj) => (
                    <PianoKey
                        key={noteObj.note}
                        note={noteObj.note}
                        keyName={noteObj.keyName}
                        playNote={playNote}
                        keyDown={keysDown[noteObj.note] || false}
                    />
                ))}
            </div>

            {visualizeRecording()}
        </div>
    );
}

interface SynthControlProps {
    startRecording: () => void;
    stopRecording: () => void;
    playBackRecording: () => void;
    octave: number;
    setOctave: (octave: number) => void;
    startOctave: number;
    setStartOctave: (startOctave: number) => void;
    isRecording: boolean;
    isPlayingBack: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recordedNotes: any[];
}

function SynthControls({
    startRecording,
    stopRecording,
    playBackRecording,
    octave,
    setOctave,
    startOctave,
    setStartOctave,
    isRecording,
    isPlayingBack,
    recordedNotes,
}: SynthControlProps) {
    return (
        <>
            <div className="min-w-48">
                <div className="relative top-3.5 h-full">
                    <div className="flex h-fit max-w-full flex-col p-2">
                        <div className="flex flex-row justify-center">
                            <button
                                onClick={startRecording}
                                disabled={isRecording || isPlayingBack}
                                className="mr-2 h-fit rounded border-[1px] px-4 py-2 text-lg border-neutral-800"
                            >
                                <div className="size-5 rounded-full bg-red-500"></div>
                            </button>
                            <button
                                onClick={stopRecording}
                                disabled={!isRecording}
                                className="mr-2 h-fit rounded border-[1px] px-4 py-2 text-lg border-neutral-800"
                            >
                                <div className="size-5 rounded-sm bg-white"></div>
                            </button>
                            <button
                                onClick={playBackRecording}
                                disabled={
                                    isRecording || isPlayingBack || recordedNotes.length === 0
                                }
                                className="h-fit rounded border-[1px] px-3 py-1.5 text-lg border-neutral-800"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    class=" text-white"
                                >
                                    <polygon points="5 3 19 12 5 21 5 3" />
                                </svg>
                            </button>
                        </div>
                        <div className="mt-2 flex w-full flex-row justify-center">
                            <div className="flex w-full flex-col">
                                <p className="text-lg">Number of Octaves</p>
                                <Input
                                    type="number"
                                    value={octave}
                                    onChange={(e) => setOctave(parseInt(e.target.value))}
                                    min={1}
                                    max={4}
                                    className="size-12 w-full text-center"
                                />
                            </div>
                        </div>
                        <div className="mt-2 flex w-full flex-row justify-center">
                            <div className="flex w-full flex-col">
                                <p className="text-lg">Start Octave</p>
                                <Input
                                    type="number"
                                    value={startOctave}
                                    onChange={(e) => setStartOctave(parseInt(e.target.value))}
                                    min={1}
                                    max={8}
                                    className="size-12 w-full text-center"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
