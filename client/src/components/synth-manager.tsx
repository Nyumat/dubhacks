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
import { Settings } from 'lucide-react';

export function SynthManager({
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
}) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="relative space-x-3 dark:bg-primary/50 bg-primary/40 text-purple-100 hover:cursor-pointer hover:bg-primary" variant={"outline"}>
                    <Settings className="h-4 w-4" />
                    <span className="sr-only">Synth Controls</span>
                    <span className="absolute -top-1 -right-1 text-xs font-semibold text-white bg-primary rounded-full w-5 h-5 flex items-center justify-center">
                        {recordedNotes.length}
                    </span>
                    <p>
                        Synth Controls
                        <span className="sr-only">Controls</span>
                    </p>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Synth Controls</DialogTitle>
                    <DialogDescription>
                        Adjust your synthesizer settings and recording options here.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex items-center justify-center space-x-2">
                        <Button
                            onClick={startRecording}
                            disabled={isRecording || isPlayingBack}
                            className="flex items-center justify-center"
                        >
                            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                            Record
                        </Button>
                        <Button
                            onClick={stopRecording}
                            disabled={!isRecording}
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
                            <label htmlFor="octaves">Number of Octaves</label>
                            <Input
                                id="octaves"
                                type="number"
                                value={octave}
                                onChange={(e) => setOctave(parseInt(e.target.value))}
                                min={1}
                                max={4}
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <label htmlFor="startOctave">Start Octave</label>
                            <Input
                                id="startOctave"
                                type="number"
                                value={startOctave}
                                onChange={(e) => setStartOctave(parseInt(e.target.value))}
                                min={1}
                                max={8}
                            />
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}