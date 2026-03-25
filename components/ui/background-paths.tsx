"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

function FloatingPaths({ position }: { position: number }) {
    // Generate paths that start WAY off-screen left and end WAY off-screen right
    const paths = useMemo(() => Array.from({ length: 24 }, (_, i) => {
        const spread = i * 25 * position;
        const yOffset = i * 15;
        // Start far off-screen left
        const x0 = -800 - spread;
        const y0 = -200 + yOffset;
        
        // Control points
        const cx1 = 200 - spread * 0.3;
        const cy1 = 800 - yOffset * 1.5;
        
        const mx = 700 + spread * 0.2;
        const my = 400 - yOffset * 0.5;
        
        const cx2 = 1200 + spread * 0.4;
        const cy2 = -200 + yOffset * 0.8;
        
        // End far off-screen right
        const x1 = 2200 + spread * 0.5;
        const y1 = 800 - yOffset;

        // Group lines into 2 distinct "packs"
        const packIndex = i % 2;
        
        return {
            id: i,
            d: `M${x0} ${y0} C${cx1} ${cy1}, ${mx} ${my}, ${cx2} ${cy2} S${x1} ${y1}, ${x1} ${y1}`,
            width: 0.5 + i * 0.05,
            // Significantly faster velocity
            duration: 6 + (packIndex * 2), 
            // Pack 1 starts around 0.1, Pack 2 around 0.6. Tiny stagger within the pack keeps them tight.
            startOffset: (packIndex * 0.5) + ((i % 12) * 0.015),
        };
    }), [position]);

    return (
        <div className="absolute inset-0 pointer-events-none [mask-image:linear-gradient(to_bottom,white_40%,transparent_100%)]">
            <svg
                className="w-full h-full text-primary/80 dark:text-primary/40"
                viewBox="0 0 1440 800"
                preserveAspectRatio="xMidYMid slice"
                fill="none"
                shapeRendering="geometricPrecision"
            >
                <title>Background Paths</title>
                {paths.map((path) => (
                    <motion.path
                        key={path.id}
                        d={path.d}
                        stroke="currentColor"
                        strokeWidth={path.width}
                        strokeLinecap="round"
                        opacity={0.1 + (path.id * 0.02)}
                        // Draw a "snake" of 40% curve length
                        initial={{ 
                            pathLength: 0.4, 
                            pathOffset: path.startOffset 
                        }}
                        // Move it constantly forward by 1 full loop
                        animate={{ 
                            pathOffset: path.startOffset + 1 
                        }}
                        transition={{
                            duration: path.duration,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                        }}
                    />
                ))}
            </svg>
        </div>
    );
}

export function BackgroundPaths({
    title = "Background Paths",
    subtitle = "",
    ctaText = "Discover Excellence",
    onCtaClick,
    children
}: {
    title?: string;
    subtitle?: string;
    ctaText?: string;
    onCtaClick?: () => void;
    children?: React.ReactNode;
}) {
    const words = title.split(" ");

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background">
            <div className="absolute inset-0">
                <FloatingPaths position={1} />
                <FloatingPaths position={-1} />
            </div>

            <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2 }}
                    className="max-w-4xl mx-auto"
                >
                    <h1 className="text-5xl sm:text-7xl md:text-8xl font-black mb-8 tracking-tighter">
                        {words.map((word, wordIndex) => (
                            <span
                                key={wordIndex}
                                className="inline-block mr-4 last:mr-0"
                            >
                                {word.split("").map((letter, letterIndex) => (
                                    <motion.span
                                        key={`${wordIndex}-${letterIndex}`}
                                        initial={{ y: 100, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{
                                            delay:
                                                wordIndex * 0.1 +
                                                letterIndex * 0.03,
                                            type: "spring",
                                            stiffness: 150,
                                            damping: 25,
                                        }}
                                        className="inline-block text-transparent bg-clip-text 
                                        bg-black 
                                        dark:from-white dark:to-white/80"
                                    >
                                        {letter}
                                    </motion.span>
                                ))}
                            </span>
                        ))}
                    </h1>

                    {subtitle && (
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 1 }}
                            className="text-xl text-muted-foreground/80 mb-10 max-w-2xl mx-auto leading-relaxed"
                        >
                            {subtitle}
                        </motion.p>
                    )}

                    {children}

                    {onCtaClick && (
                        <div
                            className="inline-block group relative bg-gradient-to-b from-black/10 to-white/10 
                            dark:from-white/10 dark:to-black/10 p-px rounded-2xl backdrop-blur-lg 
                            overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                        >
                            <Button
                                variant="ghost"
                                onClick={onCtaClick}
                                className="rounded-[1.15rem] px-8 py-6 text-lg font-semibold backdrop-blur-md 
                                bg-white/95 hover:bg-white/100 dark:bg-black/95 dark:hover:bg-black/100 
                                text-black dark:text-white transition-all duration-300 
                                group-hover:-translate-y-0.5 border border-black/10 dark:border-white/10
                                hover:shadow-md dark:hover:shadow-neutral-800/50"
                            >
                                <span className="opacity-90 group-hover:opacity-100 transition-opacity">
                                    {ctaText}
                                </span>
                                <span
                                    className="ml-3 opacity-70 group-hover:opacity-100 group-hover:translate-x-1.5 
                                    transition-all duration-300"
                                >
                                    →
                                </span>
                            </Button>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}