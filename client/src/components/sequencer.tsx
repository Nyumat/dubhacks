/* eslint-disable @typescript-eslint/no-unused-vars */
import { cn } from "@/lib/utils";
import React, { useEffect } from "react";
import * as Tone from "tone";
import { SequencerMenu } from "./menu";
import StepRender from "./step-render";
const NOTE = "C2";


type Track = {
    id: number;
    sampler: Tone.Sampler;
    volume: Tone.Volume;
};

type Props = {
    samples: { url: string; name: string }[];
    numOfSteps?: number;
};

export function Sequencer({ samples, numOfSteps = 16 }: Props) {
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [isLayoutUnlocked, setIsLayoutUnlocked] = React.useState(false);
    const [checkedSteps, setCheckedSteps] = React.useState([] as string[]);
    const [currentStep, setCurrentStep] = React.useState(0);
    const [sampleState, setSampleState] = React.useState(samples);
    const tracksRef = React.useRef<Track[]>([]);
    const stepsRef = React.useRef<HTMLInputElement[][]>([[]]);
    const lampsRef = React.useRef<HTMLInputElement[]>([]);
    const seqRef = React.useRef<Tone.Sequence | null>(null);
const [trackIds, setTrackIds] = React.useState([
        ...Array(samples.length).keys(),
    ]);
    const stepIds = [...Array(numOfSteps).keys()] as const;

    const handleStartClick = async () => {
        if (Tone.Transport.state === "started") {
            Tone.Transport.pause();
            setIsPlaying(false);
        } else {
            await Tone.start();
            Tone.Transport.start();
            setIsPlaying(true);
        }
    };

    const handleSaveClick = async () => {
        const data = {
            samples: samples,
            numOfSteps: numOfSteps,
            checkedSteps: checkedSteps,
        };
        localStorage.setItem("data", JSON.stringify(data));
    };

    useEffect(() => {
        const data = localStorage.getItem("data");
        if (data) {
            const parsedData = JSON.parse(data);
            setCheckedSteps(parsedData.checkedSteps);
        }
    }, []);

    useEffect(() => {
        if (seqRef.current) {
            seqRef.current.callback = (time, step) => {
                setCurrentStep(step);
                tracksRef.current.map((trk) => {
                    const id = trk.id + "-" + step;
                    if (checkedSteps.includes(id)) {
                        trk.sampler.triggerAttack(NOTE, time);
                    }
                    lampsRef.current[step].checked = true;
                });
            };
        }
    }, [checkedSteps]);

    const handleBpmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        Tone.Transport.bpm.value = Number(e.target.value);
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        Tone.Destination.volume.value = Tone.gainToDb(Number(e.target.value));
    };

    const handleTrackVolumeChange = (
        e: number,
        trackId: number
    ) => {
        tracksRef.current[trackId].volume.volume.value = Tone.gainToDb(e);
    };

    const clearSteps = () => {
        setCheckedSteps([]);
        stepsRef.current.map((track) => {
            track.map((step) => {
                step.checked = false;
            });
        });
    };

    React.useEffect(() => {
        tracksRef.current = samples.map((sample, i) => {
            const volume = new Tone.Volume(0).toDestination();
            const sampler = new Tone.Sampler({
                urls: {
                    [NOTE]: sample.url,
                },
            }).connect(volume);
            return {
                id: i,
                sampler,
                volume,
            };
        });
        seqRef.current = new Tone.Sequence(
            (time, step) => {
                setCurrentStep(step);
                tracksRef.current.map((trk) => {
                    if (stepsRef.current[trk.id]?.[step]?.checked) {
                        trk.sampler.triggerAttack(NOTE, time);
                    }
                    lampsRef.current[step].checked = true;
                });
            },
            [...stepIds],
            "16n"
        );
        seqRef.current.start(0);

        return () => {
            seqRef.current?.dispose();
            tracksRef.current.map((trk) => void trk.sampler.dispose());
        };
    }, [samples, numOfSteps]);

    const handleRename = (
        e: React.ChangeEvent<HTMLInputElement>,
        trackId: number
    ) => {
        setSampleState((prev) => {
            const mutatedPrev = [...prev];
            mutatedPrev[trackId].name = e.target.value;
            return mutatedPrev;
        });
    };

    const removeTrack = (index: number) => {
        setSampleState((prev) => {
            const modifiedArr = [...prev];
            modifiedArr.splice(index, 1);
            return [...modifiedArr];
        });
        setCheckedSteps((prev) => {
            return prev.filter((box) => {
                const parsedStringArr = box.split("-");
                return !parsedStringArr.includes(index.toString());
            });
        });
    };

    const handleClearSessionClick = React.useCallback(async () => {
        try {
            localStorage.removeItem("data");
            alert("Session Cleared");
            setSampleState(samples);
            setCheckedSteps([]);
        } catch (err) {
            alert("Error clearing session");
            console.error(err);
        }
        // TODO: Maybe remove?
    }, [samples]);

    return (
        <>
            <div className="flex flex-col items-center space-y-4 my-4">
                <SequencerMenu
                    handleStartClick={handleStartClick}
                    handleSaveClick={handleSaveClick}
                    handleClearSessionClick={handleClearSessionClick}
                    clearSteps={clearSteps}
                    setIsLayoutUnlocked={setIsLayoutUnlocked}
                    isLayoutUnlocked={isLayoutUnlocked}
                />
                <div className="flex flex-col space-y-2 items-center">
                    <div className="flex flex-row space-x-2">
                        {stepIds.map((stepId) => (
                            <label key={stepId} className="hidden">
                                <input
                                    key={stepId}
                                    id={`lamp-${stepId}`}
                                    type="checkbox"
                                    className="hidden"
                                    ref={(elm) => {
                                        if (!elm) return;
                                        lampsRef.current[stepId] = elm;
                                    }}
                                />
                            </label>
                        ))}
                    </div>
                    <StepRender {...{
                        trackIds,
                        sampleState,
                        setSampleState,
                        stepIds,
                        samples,
                        checkedSteps,
                        setCheckedSteps,
                        stepsRef,
                        handleTrackVolumeChange,
                        currentStep,
                        isPlaying,
                        isLayoutUnlocked,
                        setTrackIds,
                    }} />
                </div>
                <ControlSequencer
                    hide={true}
                    isPlaying={isPlaying}
                    handleStartClick={handleStartClick}
                    handleSaveClick={handleSaveClick}
                    clearSteps={clearSteps}
                    handleBpmChange={handleBpmChange}
                    handleVolumeChange={handleVolumeChange}
                />
            </div>
        </>
    );
}

interface ControlSequencerProps {
    hide: boolean
    isPlaying: boolean;
    handleStartClick: () => void;
    handleSaveClick: () => void;
    clearSteps: () => void;
    handleBpmChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function ControlSequencer({ ...props }: ControlSequencerProps) {
    const { isPlaying, handleStartClick, handleSaveClick, clearSteps, handleBpmChange, handleVolumeChange, hide } = props;
    return (
        <>
            <div className={cn("grid grid-cols-3 gap-4 place-items-center", { hidden: hide })}>
                <button
                    onClick={handleStartClick}
                    className="w-36 h-12 bg-blue-500 text-white rounded"
                >
                    {isPlaying ? "Pause" : "Start"}
                </button>
                <button
                    onClick={handleSaveClick}
                    className="w-36 h-12 bg-blue-500 text-white rounded"
                >
                    Save Set
                </button>
                <button
                    onClick={clearSteps}
                    className="w-36 h-12 bg-red-500 text-white rounded"
                >
                    Clear
                </button>
                <label className="flex flex-col items-center">
                    <span>BPM</span>
                    <input
                        type="range"
                        min={30}
                        max={300}
                        step={1}
                        onChange={handleBpmChange}
                        defaultValue={120}
                    />
                </label>
                <label className="flex flex-col items-center">
                    <span>Volume</span>
                    <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        onChange={handleVolumeChange}
                        defaultValue={1}
                    />
                </label>
            </div>
        </>
    )
}