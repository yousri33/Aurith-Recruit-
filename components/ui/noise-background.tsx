"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NoiseBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  gradientColors?: string[];
  noiseOpacity?: number;
}

export const NoiseBackground = ({
  children,
  className,
  containerClassName,
  gradientColors = ["#8b5cf6", "#ec4899", "#3b82f6"],
  noiseOpacity = 0.05,
}: NoiseBackgroundProps) => {
  const gradientString = useMemo(() => {
    return gradientColors.join(", ");
  }, [gradientColors]);

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        containerClassName
      )}
    >
      <motion.div
        className={cn(
          "absolute inset-0 z-0 opacity-40",
          className
        )}
        style={{
          background: `radial-gradient(circle at center, ${gradientString})`,
          filter: "blur(60px)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {/* Performance-Optimized Glow Orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-30">
        <div className="absolute -top-[50%] -left-[50%] w-full h-full bg-primary/20 rounded-full animate-pulse blur-[60px]" />
      </div>
      <div
        className="absolute inset-0 z-0 opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
};
