"use client"

import React, { useState } from "react"
import { t } from "@/lib/i18n"
import { logoutUser } from "@/lib/api"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  Library,
  Zap,
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react"

import { FloatingDock } from "@/components/ui/floating-dock"

export function Sidebar({ language }: { language: 'fr' | 'en' }) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const iconClass = "h-full w-full drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)] drop-shadow-md"
  const desktopIconClass = cn(iconClass, "text-white")

  const gradients = [
    "linear-gradient(135deg, #2E3D73, #43559B)",
    "linear-gradient(135deg, #2E3D73, #43559B)",
    "linear-gradient(135deg, #2E3D73, #43559B)",
    "linear-gradient(135deg, #2E3D73, #43559B)",
    "linear-gradient(135deg, #2E3D73, #43559B)",
  ]

  const handleLogout = async () => {
    await logoutUser();
    window.location.href = '/';
  }

  const links = [
    {
      title: t('nav.dashboard', language),
      icon: <LayoutDashboard className={desktopIconClass} strokeWidth={2.5} />,
      href: '/dashboard',
      gradient: gradients[0]
    },
    {
      title: t('nav.library', language),
      icon: <Library className={desktopIconClass} strokeWidth={2.5} />,
      href: '/dashboard/library',
      gradient: gradients[1]
    },
    {
      title: t('nav.pipeline', language),
      icon: <Zap className={desktopIconClass} strokeWidth={2.5} />,
      href: '/dashboard/jobs',
      gradient: gradients[2]
    },
    {
      title: t('nav.settings', language),
      icon: <Settings className={desktopIconClass} strokeWidth={2.5} />,
      href: '/dashboard/settings',
      gradient: gradients[3]
    },
    {
      title: t('nav.logout', language),
      icon: <LogOut className={cn(desktopIconClass, "drop-shadow-[0_2px_10px_rgba(239,68,68,0.5)]")} strokeWidth={2.5} />,
      href: '/',
      onClick: handleLogout,
      gradient: "linear-gradient(135deg, #ef4444, #991b1b)"
    },
  ]

  return (
    <>
      {/* 🚀 DESKTOP: Floating Dock (Bottom) */}
      <div className="hidden md:flex fixed bottom-6 w-full items-center justify-center z-50 pointer-events-none">
        <div className="pointer-events-auto">
          <FloatingDock 
            items={links} 
            desktopClassName="bg-white/60 dark:bg-neutral-900/40 backdrop-blur-2xl border border-border/50 shadow-xl"
            mobileClassName="hidden" 
          />
        </div>
      </div>

      {/* 📱 MOBILE: Burger Trigger */}
      <button 
        onClick={() => setIsMobileMenuOpen(true)}
        className="md:hidden fixed top-6 left-6 z-[60] size-11 rounded-2xl bg-white dark:bg-neutral-900 border border-border flex items-center justify-center text-foreground shadow-xl"
      >
        <Menu className="size-5" />
      </button>

      {/* 📱 MOBILE: Sidebar Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[70] md:hidden"
            />
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[300px] bg-white dark:bg-neutral-950 z-[80] p-6 flex flex-col md:hidden shadow-2xl"
            >
              <div className="flex items-center justify-between mb-10 pt-2">
                <Link href="/" className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                    <span className="text-primary-foreground font-black text-[11px] tracking-tighter">AR</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black text-[11px] tracking-[0.2em] uppercase leading-none text-neutral-900 dark:text-neutral-200">Aurith</span>
                    <span className="font-light text-[8px] tracking-[0.1em] uppercase text-neutral-400 mt-1">Recruit</span>
                  </div>
                </Link>
                <button onClick={() => setIsMobileMenuOpen(false)} className="size-9 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 hover:text-foreground transition-all">
                  <X className="size-5" />
                </button>
              </div>

              <div className="flex-1 flex flex-col gap-2">
                {links.filter(l => l.href !== '/').map((link, idx) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 relative group",
                        isActive 
                          ? "bg-primary/10 text-primary shadow-sm" 
                          : "text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                      )}
                    >
                      <div className={cn("size-6 p-1 relative z-10 [&&_svg]:!text-current", isActive ? "text-primary" : "text-neutral-400 group-hover:text-primary")}>
                        {link.icon}
                      </div>
                      <span className="text-[12px] font-bold uppercase tracking-[0.15em] relative z-10">{link.title}</span>
                    </Link>
                  )
                })}
              </div>

              <button 
                onClick={handleLogout}
                className="mt-auto flex items-center gap-4 px-5 py-5 rounded-2xl text-red-500 bg-red-500/5 hover:bg-red-500/10 transition-all font-bold text-[12px] uppercase tracking-[0.15em]"
              >
                <LogOut className="size-6" />
                {t('nav.logout', language)}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}