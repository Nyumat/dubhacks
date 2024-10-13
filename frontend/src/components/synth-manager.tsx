import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { DraggableCard } from "./draggable-card";
import { RecordedNote } from "./synthesizer";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";

interface SynthManagerProps {
    startRecording: () => void;
    stopRecording: () => void;
    playBackRecording: () => void;
    octave: number;
    setOctave: (octave: number) => void;
    startOctave: number;
    setStartOctave: (startOctave: number) => void;
    isRecording: boolean;
    isPlayingBack: boolean;
    recordedNotes: RecordedNote[];
    playbackProgress: number;
    setShowControls: (showControls: boolean) => void;
}

export function SynthManager({
    startRecording,
    setShowControls,
    stopRecording,
    playBackRecording,
    octave,
    setOctave,
    startOctave,
    setStartOctave,
    isRecording,
    isPlayingBack,
    recordedNotes,
    playbackProgress,
}: SynthManagerProps) {
    const lastPosition = useRef({ x: 0, y: 0 });
    const [isOpen, setIsOpen] = useState(false);
    const [showProgress, setShowProgress] = useState(isPlayingBack);
    useEffect(() => {
        if (!isPlayingBack) {
            const timeout = setTimeout(() => {
                setShowProgress(false);
            }, 2000); // Hide progress bar 2 seconds after audio stops
            return () => clearTimeout(timeout);
        } else {
            setShowProgress(true);
        }
    }, [isPlayingBack]);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    }

    const minimizedContent = (
        <div onClick={toggleOpen} className="flex items-center justify-center gap-2">

            <Button id="startRecording" onClick={startRecording} disabled={isRecording || isPlayingBack} className="flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                Record
            </Button>
            <Button id="stopRecording" onClick={stopRecording} disabled={!isRecording} className="flex items-center justify-center">
                <div className="w-3 h-3 rounded-sm bg-white mr-2"></div>
                Stop
            </Button>
            <Button id="playBackRecording" onClick={playBackRecording} disabled={isRecording || isPlayingBack || recordedNotes.length === 0} className="flex items-center justify-center">
                <Play className="h-4 w-4 mr-1" />
                Play
            </Button>

            <div className="flex items-center justify-center w-full">
                {playbackProgress > 0 && (
                    <Progress value={playbackProgress} max={100} indicatorColor="dark:bg-primary bg-black" />
                )}
            </div>
        </div>
    );

    return (
        <DraggableCard
            title="Synth Controls"
            minimizedContent={minimizedContent}
            toggleClose={() => setShowControls(false)}
            lastPosition={lastPosition}
        >
            <div className="grid gap-3 space-y-3">
                <p className="text-sm">
                    Adjust your synthesizer settings and recording options here.
                </p>
                <div className="flex items-center justify-center space-x-2">
                    <Button
                        onClick={startRecording}
                        disabled={isRecording}
                        className="flex items-center justify-center"
                    >
                        <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                        Record
                    </Button>
                    <Button
                        onClick={stopRecording}
                        disabled={!isRecording || isPlayingBack}
                        className="flex items-center justify-center"
                    >
                        <div className="w-3 h-3 rounded-sm bg-white mr-2"></div>
                        Stop
                    </Button>
                    <Button
                        onClick={playBackRecording}
                        disabled={isRecording || isPlayingBack || recordedNotes.length === 0}
                        className="flex items-center justify-center"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2"
                        >
                            <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                        Play
                    </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="octaves">Octaves</Label>
                        <Input
                            id="octaves"
                            type="number"
                            value={octave}
                            className="ring-1 ring-primary dark:ring-primary"
                            onChange={(e) => setOctave(parseInt(e.target.value))}
                            min={1}
                            max={4}
                        />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="startOctave">Start Octave</Label>
                        <Input
                            id="startOctave"
                            type="number"
                            className="ring-1 ring-primary dark:ring-primary"
                            value={startOctave}
                            onChange={(e) => setStartOctave(parseInt(e.target.value))}
                            min={1}
                            max={8}
                        />
                    </div>
                </div>

                {showProgress && (
                    <motion.div
                        className="mt-4 w-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Progress value={playbackProgress} max={100} indicatorColor="dark:bg-primary bg-black" />
                    </motion.div>
                )}
            </div>
        </DraggableCard>
    );
}