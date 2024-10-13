import { cn } from "@/lib/utils";
import { Sample } from "@/types";
import * as Ably from 'ably';
import { Reorder } from "framer-motion";
import { TrashIcon } from "lucide-react";
import React from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { TrackActionsDialog } from "./add-sample";
import { ManageSample } from "./sample-manager";
import { Input } from "./ui/input";
import { VolumeKnob } from "./volume-knob";

interface Props {
    trackIds: number[];
    stepIds: readonly number[];
    samples: { url: string; name: string }[];
    checkedSteps: string[];
    setCheckedSteps: React.Dispatch<React.SetStateAction<string[]>>;
    stepsRef: React.MutableRefObject<HTMLInputElement[][]>
    handleTrackVolumeChange: (e: number, trackId: number) => void;
    currentStep: number;
    isPlaying: boolean;
    isLayoutUnlocked: boolean;
    setTrackIds: React.Dispatch<React.SetStateAction<number[]>>;
    setSampleState: React.Dispatch<React.SetStateAction<{ url: string; name: string }[]>>;
    sampleState: { url: string; name: string }[];
    channel: Ably.RealtimeChannel | null;
}

export default function StepRender({
    trackIds,
    stepIds,
    setSampleState,
    checkedSteps,
    setCheckedSteps,
    stepsRef,
    handleTrackVolumeChange,
    currentStep,
    isPlaying,
    isLayoutUnlocked,
    setTrackIds,
    sampleState,
    channel,
}: Props) {

    const onDrop = React.useCallback(async (acceptedFiles: File[]) => {
        const formattedAcceptedFiles = acceptedFiles.map((file) => {
            const url = URL.createObjectURL(file);
            const name = file.name.split(".");
            name.pop();
            return {
                url,
                name: name.join(""),
            };
        });
        setTempTrack(formattedAcceptedFiles);

        // Add the track to the track list
        setTrackIds((prev) => {
            return [...prev, sampleState.length];
        });

        // Add the sample to the sample list
        setSampleState((prev) => {
            return [...prev, ...formattedAcceptedFiles];
        });
    }, []);

    

    const {
        getRootProps,
        getInputProps,
        isDragAccept,
        isDragReject,
    } = useDropzone({ onDrop, multiple: false, accept: { "audio/wav": [] } });


    const handleReorder = (newItems: number[]) => {
        if (isLayoutUnlocked) {
            setTrackIds(newItems);
        } else {
            toast.error("Unlock the layout to reorder tracks");
        }
    };
    const [tempTrack, setTempTrack] = React.useState<Sample[]>([]);
    const removeTrack = (index: number) => {
        setCheckedSteps((prev) => {
            return prev.filter((box) => {
                const parsedStringArr = box.split("-");
                return !parsedStringArr.includes(index.toString());
            });
        });
        setTrackIds((prev) => {
            const modifiedArr = [...prev];
            modifiedArr.splice(index, 1);
            return [...modifiedArr];
        });
    };

    const changeSample = React.useCallback(
        (url: string, _id: string, track: [number, number]) => {
            setSampleState((prev) => {
                const mutatedPrev = [...prev];
                mutatedPrev[track[0]].url = url;
                return mutatedPrev;
            });
        },
        []
    );

    const addTrack = (sample: Sample) => {
        const url = new Blob([sample.url]).toString();
        const name = sample.name;
        setSampleState((prev) => [...prev, { url, name }]);
        setTempTrack([]);
    };

    const handleAddTrack = () => {
        if (tempTrack === null) return;
        setSampleState((prev) => [...prev, ...tempTrack]);
        setTempTrack([]);
    };

    

    return (

        <div className="flex flex-col space-y-2">
            <Reorder.Group
                className="flex flex-col space-y-2"
                values={trackIds}
                onReorder={handleReorder}
                as="div"
            >
                {trackIds.map((trackId, index) => (
                    <Reorder.Item
                        value={trackId}
                        className="relative flex w-full cursor-grab flex-row items-center justify-center gap-2 space-y-2 align-middle"
                        key={trackId}
                        as="div"
                    >
                        <TrashIcon
                            onClick={() => removeTrack(index)}
                            className="absolute -left-11 cursor-pointer stroke-white dark:stroke-primary"
                        />
                        {sampleState[trackId] !== undefined && (
                            <ManageSample
                                key={trackId}
                                url={sampleState[trackId].url ?? ""}
                                name={sampleState[trackId].name ?? ""}
                                id={trackId.toString()}
                                track={[trackId, index + 1]}
                                handleSampleChange={changeSample}
                            />
                        )}
                        <div className="-my-2 mx-3 flex flex-row gap-0 space-x-[8px]">
                            {stepIds.map((stepId) => {
                                const id = trackId + "-" + stepId;
                                const checkedStep =
                                    checkedSteps.includes(id)
                                        ? id
                                        : null;
                                const isCurrentStep =
                                    stepId === currentStep && isPlaying;
                                return (
                                    <label
                                        key={id}
                                        className={cn(
                                            `w-10 h-10 rounded-sm flex items-center justify-center transition-transform duration-75 cursor-default transform bg-purple-200/70 ring-2 ring-[#6D28D9] active:scale-90`,
                                            {
                                                "bg-blue-500 z-50":
                                                    checkedStep,
                                                "bg-purple-500 scale-110 transition-transform duration-100":
                                                    isCurrentStep,
                                                "drop-shadow-[0_0_0.4rem_#a855f7]":
                                                    isCurrentStep,
                                                "active:scale-90": true,
                                            }
                                        )}
                                    >
                                        <Input
                                            key={id}
                                            id={id}
                                            type="checkbox"
                                            className="hidden"
                                            ref={(elm) => {
                                                if (!elm) return;
                                                if (
                                                    !stepsRef.current[
                                                    trackId
                                                    ]
                                                ) {
                                                    stepsRef.current[
                                                        trackId
                                                    ] = [];
                                                }
                                                stepsRef.current[
                                                    trackId
                                                ][stepId] = elm;
                                            }}
                                            onChange={() => {
                                                if (!channel) {
                                                    toast.error("Channel not found");
                                                    return;
                                                }

                                                const messageData = { trackId, stepId };

                                                setCheckedSteps((prev) => {
                                                    if (prev.includes(id)) {
                                                        // Publish the step unchecking event
                                                        channel.publish("stepToggle", { ...messageData, action: "uncheck" });
                                                        return prev.filter((step) => step !== id);
                                                    }
                                                    // Publish the step checking event
                                                    channel.publish("stepToggle", { ...messageData, action: "check" });
                                                    return [...prev, id];
                                                });
                                            }}
                                        />
                                    </label>
                                );
                            })}
                        </div>
                        <label className="flex flex-col items-center">
                            <VolumeKnob
                                min={0}
                                max={10}
                                step={0.1}
                                defaultValue={5}
                                onChange={(e) => handleTrackVolumeChange(e, trackId)}
                            />
                        </label>
                    </Reorder.Item>
                ))}
            </Reorder.Group>
            <TrackActionsDialog
                getRootProps={getRootProps}
                getInputProps={getInputProps}
                isDragAccept={isDragAccept}
                isDragReject={isDragReject}
                onSampleSave={handleAddTrack}
                addTrack={addTrack}
                tempTrack={tempTrack}
            />
        </div>
    )
}
