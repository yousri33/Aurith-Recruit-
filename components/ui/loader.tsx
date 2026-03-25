'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function LoaderFive({ text = "Loading...", className }: { text?: string, className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-6", className)}>
      <div className="relative flex h-16 w-16 items-center justify-center">
        {/* Outer vibrant glow */}
        <motion.div
           className="absolute inset-[-50%] rounded-full bg-gradient-to-tr from-primary/30 to-fuchsia-500/30 blur-2xl"
           animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
           transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        
        {/* Primary ring */}
        <motion.div 
           className="absolute h-full w-full rounded-full border-[3px] border-t-primary border-r-primary border-b-transparent border-l-transparent"
           animate={{ rotate: 360 }}
           transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Secondary inner ring */}
        <motion.div 
           className="absolute h-[70%] w-[70%] rounded-full border-[3px] border-b-fuchsia-400 border-l-fuchsia-400 border-t-transparent border-r-transparent opacity-80"
           animate={{ rotate: -360 }}
           transition={{ duration: 1.3, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Center pulsing core */}
        <motion.div 
           className="absolute h-[30%] w-[30%] rounded-full bg-gradient-to-tr from-primary to-fuchsia-500 shadow-[0_0_15px_rgba(var(--primary),0.5)]"
           animate={{ scale: [0.8, 1.3, 0.8] }}
           transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
      
      {text && (
        <motion.p
           className="text-[12px] font-black tracking-[0.2em] text-foreground/80 uppercase relative z-10"
           animate={{ opacity: [0.5, 1, 0.5] }}
           transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {text}
        </motion.p>
      )}
    </div>
  )
}

export function LoaderThree({ className }: { className?: string }) {
  return (
    <motion.div
      className={cn(
        "h-4 w-4 rounded-full border-2 border-current border-t-transparent",
        className
      )}
      animate={{ rotate: 360 }}
      transition={{
        duration: 0.8,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  )
}

export function LoaderThreeDemo() {
  return <LoaderThree />;
}
