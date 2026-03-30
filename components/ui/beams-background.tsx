"use client";

import { useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BeamsBackgroundProps {
    title?: string;
    subtitle?: string;
    className?: string;
    children?: React.ReactNode;
    intensity?: "subtle" | "medium" | "strong";
}

interface Beam {
    x: number;
    y: number;
    width: number;
    length: number;
    angle: number;
    speed: number;
    opacity: number;
    hue: number;
    pulse: number;
    pulseSpeed: number;
}

function createBeam(width: number, height: number): Beam {
    const angle = -35 + Math.random() * 10;
    return {
        x: Math.random() * width * 1.5 - width * 0.25,
        y: Math.random() * height * 1.5 - height * 0.25,
        width: 30 + Math.random() * 60,
        length: height * 2.5,
        angle: angle,
        speed: 0.6 + Math.random() * 1.2,
        opacity: 0.1 + Math.random() * 0.15,
        hue: 200 + Math.random() * 5, // Neutral cool gray-blue
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03,
    };
}

export function BeamsBackground({
    title,
    subtitle,
    className,
    children,
    intensity = "strong",
}: BeamsBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const beamsRef = useRef<Beam[]>([]);
    const animationFrameRef = useRef<number>(0);
    const MINIMUM_BEAMS = 20;

    const opacityMap = {
        subtle: 0.7,
        medium: 0.85,
        strong: 1,
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const updateCanvasSize = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            ctx.scale(dpr, dpr);

            const totalBeams = Math.floor(MINIMUM_BEAMS * 1.5);
            beamsRef.current = Array.from({ length: totalBeams }, () =>
                createBeam(canvas.width, canvas.height)
            );
        };

        updateCanvasSize();
        window.addEventListener("resize", updateCanvasSize);

        function resetBeam(beam: Beam, index: number, totalBeams: number) {
            if (!canvas) return beam;
            
            const column = index % 3;
            const spacing = canvas.width / 3;

            beam.y = canvas.height + 100;
            beam.x =
                column * spacing +
                spacing / 2 +
                (Math.random() - 0.5) * spacing * 0.5;
            beam.width = 100 + Math.random() * 100;
            beam.speed = 0.5 + Math.random() * 0.4;
            beam.hue = 200 + (index * 5) / totalBeams; // Subtle cool gray-blue
            beam.opacity = 0.08 + Math.random() * 0.08;
            return beam;
        }

        function drawBeam(ctx: CanvasRenderingContext2D, beam: Beam) {
            ctx.save();
            ctx.translate(beam.x, beam.y);
            ctx.rotate((beam.angle * Math.PI) / 180);

            const pulsingOpacity =
                beam.opacity *
                (0.8 + Math.sin(beam.pulse) * 0.2) *
                opacityMap[intensity];

            const gradient = ctx.createLinearGradient(0, 0, 0, beam.length);

            gradient.addColorStop(0, `hsla(${beam.hue}, 85%, 65%, 0)`);
            gradient.addColorStop(
                0.1,
                `hsla(${beam.hue}, 85%, 65%, ${pulsingOpacity * 0.5})`
            );
            gradient.addColorStop(
                0.4,
                `hsla(${beam.hue}, 85%, 65%, ${pulsingOpacity})`
            );
            gradient.addColorStop(
                0.6,
                `hsla(${beam.hue}, 85%, 65%, ${pulsingOpacity})`
            );
            gradient.addColorStop(
                0.9,
                `hsla(${beam.hue}, 85%, 65%, ${pulsingOpacity * 0.5})`
            );
            gradient.addColorStop(1, `hsla(${beam.hue}, 85%, 65%, 0)`);

            ctx.fillStyle = gradient;
            ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length);
            ctx.restore();
        }

        function animate() {
            if (!canvas || !ctx) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.filter = "blur(35px)";

            const totalBeams = beamsRef.current.length;
            beamsRef.current.forEach((beam, index) => {
                beam.y -= beam.speed;
                beam.pulse += beam.pulseSpeed;

                if (beam.y + beam.length < -100) {
                    resetBeam(beam, index, totalBeams);
                }

                drawBeam(ctx, beam);
            });

            animationFrameRef.current = requestAnimationFrame(animate);
        }

        animate();

        return () => {
            window.removeEventListener("resize", updateCanvasSize);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [intensity]);

    const words = title ? title.split(" ") : [];

    return (
        <div
            className={cn(
                "relative min-h-screen w-full overflow-hidden bg-background",
                className
            )}
        >
            <canvas
                ref={canvasRef}
                className="absolute inset-1 pointer-events-none"
                style={{ filter: "blur(15px)" }}
            />

            <motion.div
                className="absolute inset-0 bg-background/5"
                animate={{
                    opacity: [0.05, 0.15, 0.05],
                }}
                transition={{
                    duration: 10,
                    ease: "easeInOut",
                    repeat: Number.POSITIVE_INFINITY,
                }}
                style={{
                    backdropFilter: "blur(50px)",
                }}
            />

            <motion.div
                className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background to-transparent z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
            />

            <div className="relative z-10 flex min-h-screen w-full items-center justify-center py-20">
                <div className="flex flex-col items-center justify-center gap-6 px-4 text-center w-full">
                    {(title || subtitle) && (
                        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center gap-6">
                            {title && (
                                <h1 className="text-5xl sm:text-7xl md:text-8xl font-black mb-4 tracking-tighter">
                                    {words.map((word, wordIndex) => (
                                        <span key={wordIndex} className="inline-block mr-4 last:mr-0">
                                            {word.split("").map((letter, letterIndex) => (
                                                <motion.span
                                                    key={`${wordIndex}-${letterIndex}`}
                                                    initial={{ y: 100, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{
                                                        delay: wordIndex * 0.1 + letterIndex * 0.03,
                                                        type: "spring",
                                                        stiffness: 150,
                                                        damping: 25,
                                                    }}
                                                    className="inline-block text-transparent bg-clip-text bg-black dark:text-white"
                                                >
                                                    {letter}
                                                </motion.span>
                                            ))}
                                        </span>
                                    ))}
                                </h1>
                            )}
                            
                            {subtitle && (
                                <motion.p
                                    className="text-xl text-muted-foreground/80 mb-10 max-w-2xl mx-auto leading-relaxed"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.5 }}
                                >
                                    {subtitle}
                                </motion.p>
                            )}
                        </div>
                    )}

                    {children}
                </div>
            </div>
        </div>
    );
}
