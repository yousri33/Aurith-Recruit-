"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import Link from "next/link";

interface NavItem {
  name: string;
  link: string;
}

export const Navbar = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <nav className={cn("fixed top-4 inset-x-0 z-50 flex justify-center px-4", className)}>
      {children}
    </nav>
  );
};

export const NavBody = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={cn(
      "hidden md:flex items-center justify-between w-full max-w-5xl h-14 px-6 rounded-full border border-white/20 dark:border-white/10 bg-white/60 dark:bg-neutral-900/40 backdrop-blur-2xl shadow-lg ring-1 ring-black/5",
      className
    )}>
      {children}
    </div>
  );
};

export const NavItems = ({ items, className }: { items: NavItem[]; className?: string }) => {
  return (
    <div className={cn("flex items-center gap-8", className)}>
      {items.map((item, idx) => (
        <Link
          key={`nav-item-${idx}`}
          href={item.link}
          className="text-sm font-black tracking-tight text-foreground/70 hover:text-primary transition-colors uppercase tracking-[0.1em]"
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
};

export const NavbarLogo = () => {
  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center font-black text-primary-foreground text-xs shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
        AR
      </div>
      <div className="flex flex-col">
        <span className="font-black text-sm tracking-tighter text-foreground leading-none">Aurith</span>
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/80 leading-none mt-1">Recruit</span>
      </div>
    </Link>
  );
};

export const NavbarButton = ({ 
  children, 
  variant = "primary", 
  className,
  onClick 
}: { 
  children: React.ReactNode; 
  variant?: "primary" | "secondary";
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all active:scale-95",
        variant === "primary" 
          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90" 
          : "bg-white/10 dark:bg-white/5 text-foreground hover:bg-white/20 border border-white/10",
        className
      )}
    >
      {children}
    </button>
  );
};

export const MobileNav = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={cn("md:hidden flex flex-col w-full max-w-md", className)}>
      {children}
    </div>
  );
};

export const MobileNavHeader = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={cn(
      "flex items-center justify-between w-full h-14 px-6 rounded-full border border-white/20 dark:border-white/10 bg-white/60 dark:bg-neutral-900/40 backdrop-blur-2xl shadow-lg",
      className
    )}>
      {children}
    </div>
  );
};

export const MobileNavToggle = ({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="p-2 text-foreground/70 hover:text-primary transition-colors"
    >
      {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
    </button>
  );
};

export const MobileNavMenu = ({ 
  children, 
  isOpen, 
  onClose,
  className
}: { 
  children: React.ReactNode; 
  isOpen: boolean; 
  onClose: () => void;
  className?: string;
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className={cn(
            "absolute top-16 inset-x-0 p-6 rounded-3xl border border-white/20 dark:border-white/10 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-3xl shadow-2xl flex flex-col gap-6 ring-1 ring-black/5",
            className
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
