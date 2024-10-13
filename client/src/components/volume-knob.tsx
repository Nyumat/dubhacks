import { useState } from "react"

interface VolumeKnobProps {
    min: number
    max: number
    step: number
    defaultValue: number
    onChange: (value: number) => void
}

export const VolumeKnob: React.FC<VolumeKnobProps> = ({ min, max, step, defaultValue, onChange }) => {
    const [value, setValue] = useState(defaultValue)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseFloat(e.target.value)
        setValue(newValue)
        onChange(newValue)
    }

    const rotation = ((value - min) / (max - min)) * 270 - 135

    return (
        <div className="relative w-12 h-12">
            <input
                type="range"
                className="knob absolute w-full h-full opacity-0 cursor-pointer z-10"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={handleChange}
            />
            <div
                className="knob-control absolute w-full h-full rounded-full border-2 border-primary bg-background flex items-center justify-center"
                style={{ transform: `rotate(${rotation}deg)` }}
            >
                <div className="w-0.5 h-4 bg-primary rounded-full transform -translate-y-1/2"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
                {/* <span className="text-lg font-semibold">{value.toFixed(1)}</span> */}
            </div>
        </div>
    )
}