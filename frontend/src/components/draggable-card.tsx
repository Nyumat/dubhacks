import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { motion, useMotionValue } from 'framer-motion';
import { Maximize2, Minus, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface DraggableCardProps {
    title: string;
    minimizedContent: React.ReactNode;
    children: React.ReactNode;
    toggleClose: () => void;
    lastPosition: React.MutableRefObject<{ x: number; y: number }>;
}

export function DraggableCard({ title, minimizedContent, children, toggleClose, lastPosition }: DraggableCardProps) {
    const [isMinimized, setIsMinimized] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const toggleMinimize = () => {
        setIsMinimized(!isMinimized);
    };

    useEffect(() => {
        if (isMinimized) {
            lastPosition.current = { x: x.get(), y: y.get() };
            x.set(0);
            y.set(0);
        } else {
            x.set(lastPosition.current.x);
            y.set(lastPosition.current.y);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMinimized, x, y]);

    return (
        <motion.div
            ref={cardRef}
            drag
            dragMomentum={false}
            style={{ x, y }}
            whileDrag={{ cursor: 'grabbing' }}
            initial={{ x: lastPosition.current.x, y: lastPosition.current.y }}
            className="cursor-grab fixed z-50"
        >
            <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleClose()}
                className="absolute top-2 right-8 z-10"
            >
                <X className="h-4 w-4 mr-2" />
            </Button>
            <Card className="w-full shadow-lg relative bg-primary backdrop-blur-lg dark:bg-background/90 transition-all duration-300">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMinimize}
                    className="absolute top-2 right-2 z-10"
                >
                    {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
                </Button>
                <CardHeader className="px-6">
                    <h3 className="text-lg font-semibold">{title}</h3>
                </CardHeader>
                <motion.div
                    initial={false}
                    animate={{
                        height: isMinimized ? 'auto' : 'auto',
                        opacity: 1
                    }}
                    transition={{ duration: 0.3 }}
                >
                    {isMinimized ? (
                        <CardContent className="p-3">
                            {minimizedContent}
                        </CardContent>
                    ) : (
                        <CardContent>
                            {children}
                        </CardContent>
                    )}
                </motion.div>
            </Card>
        </motion.div >
    );
};