"use client";

import NumberFlow from '@number-flow/react'
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ExternalLink, Check, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export function PricingInteraction() {
  const [active, setActive] = useState(0);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    if (active === 1) {
        setPrice(149);
    } else {
        setPrice(0);
    }
  }, [active]);

  return (
    <div className="border border-border rounded-[32px] p-4 shadow-2xl max-w-sm w-full flex flex-col items-center gap-6 bg-card transition-all duration-500 hover:shadow-primary/5 hover:border-primary/20">
        {/* Selection Switch */}
        <div className="rounded-full relative w-full bg-muted p-1.5 flex items-center">
          <button
            className={cn(
                "font-black rounded-full w-full p-2.5 text-[10px] uppercase tracking-[0.2em] z-20 transition-all duration-300",
                active === 0 ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setActive(0)}
          >
            Free Tier
          </button>
          <button
            className={cn(
                "font-black rounded-full w-full p-2.5 text-[10px] uppercase tracking-[0.2em] z-20 transition-all duration-300",
                active === 1 ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setActive(1)}
          >
            Custom System
          </button>
          <div
            className="p-1.5 flex items-center justify-center absolute inset-0 w-1/2 z-10"
            style={{
              transform: `translateX(${active * 100}%)`,
              transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <div className="bg-primary shadow-lg rounded-full w-full h-full"></div>
          </div>
        </div>

        {/* Pricing Display */}
        <div className="w-full relative flex flex-col items-center justify-center py-6 min-h-[160px]">
            <div className="flex flex-col items-center text-center gap-2">
                <div className="flex items-baseline gap-2">
                    <NumberFlow
                        className={cn("text-7xl font-black tracking-tighter", active === 1 ? "text-primary" : "text-foreground")}
                        value={price}
                        format={{ minimumFractionDigits: 0 }}
                    />
                    <motion.span 
                        animate={{ color: active === 1 ? "var(--color-primary)" : "currentColor" }}
                        className="text-4xl font-black tracking-widest text-primary/80"
                    >
                        DA
                    </motion.span>
                    {active === 1 && (
                        <motion.span 
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-3xl font-black text-primary/40 ml-1"
                        >
                            +
                        </motion.span>
                    )}
                </div>
                <p className="text-muted-foreground font-black uppercase text-[10px] tracking-[0.3em] mt-2">
                    {active === 0 ? "Start Screening Now" : "Custom Built for You"}
                </p>
            </div>
        </div>

        {/* Features List */}
        <div className="w-full flex flex-col gap-8">
            <div className="space-y-4 px-2 min-h-[140px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={active}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="space-y-4"
                    >
                        {(active === 0 ? [
                            "Starter Free testing",
                            "Limited AI access",
                            "Basic automated screening",
                            "Standard dashboard view"
                        ] : [
                            "Full System Source Code",
                            "Custom Domain Integration",
                            "Advanced AI Pipelines",
                            "Priority Implementation Support"
                        ]).map((feature, i) => (
                            <div key={i} className="flex items-center gap-4 text-foreground/80 font-bold text-[10px] uppercase tracking-[0.15em] leading-none">
                                <div className={cn(
                                    "size-5 rounded-full flex items-center justify-center border transition-colors",
                                    active === 0 ? "bg-muted border-border" : "bg-primary/10 border-primary/20"
                                )}>
                                    <Check className={cn("size-3", active === 0 ? "text-muted-foreground" : "text-primary")} />
                                </div>
                                {feature}
                            </div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 mb-2">
                {active === 0 ? (
                    <Link 
                        href="/register"
                        className="rounded-2xl bg-foreground text-background text-[11px] font-black uppercase tracking-[0.2em] w-full py-5 shadow-xl transition-all duration-300 flex items-center justify-center gap-2 hover:translate-y-[-2px] hover:shadow-foreground/10 active:scale-95"
                    >
                        Start for Free <Sparkles className="size-3.5" />
                    </Link>
                ) : (
                    <Link 
                        href="https://aurith-dz.vercel.app"
                        target="_blank"
                        className="rounded-2xl bg-primary text-primary-foreground text-[11px] font-black uppercase tracking-[0.2em] w-full py-5 shadow-xl shadow-primary/20 transition-all duration-300 flex items-center justify-center gap-2 hover:translate-y-[-2px] hover:shadow-primary/30 active:scale-95"
                    >
                        Request Custom System <Zap className="size-3.5 fill-current" />
                    </Link>
                )}
                
                <p className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.2em] text-center px-6 leading-relaxed opacity-60">
                    {active === 1 
                        ? "Contact us to build your own white-labeled recruitment platform" 
                        : "Test the power of AI recruiting with no commitment"}
                </p>
            </div>
        </div>
      </div>
  );
}
