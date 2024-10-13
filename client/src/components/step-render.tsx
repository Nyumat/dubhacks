import { cn } from "@/lib/utils";
import * as Ably from 'ably';
import { Reorder } from "framer-motion";
import { TrashIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";
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
    const handleReorder = (newItems: number[]) => {
        if (isLayoutUnlocked) {
            setTrackIds(newItems);
        } else {
            toast.error("Unlock the layout to reorder tracks");
        }
    };

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
        (url: string, id: string, track: [number, number]) => {
            setSampleState((prev) => {
                const mutatedPrev = [...prev];
                mutatedPrev[track[0]].url = url;
                return mutatedPrev;
            });
        },
        []
    );

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
                                const shade = 500;
                                return (
                                    <label
                                        key={id}
                                        className={cn(
                                            `w-10 h-10 rounded-sm flex items-center justify-center transition-transform duration-75 cursor-default transform bg-purple-200/70 dark:bg-neutral-950/55 ring-2 ring-[#6D28D9] active:scale-90`,
                                            {
                                                "bg-green-500":
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
        </div>
    )
}
