'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getProfile, type Profile } from '@/lib/api'
import { cn } from '@/lib/utils'
import { OnboardingDemo } from './OnboardingDemo'

function getInitials(name: string) {
  if (!name) return '?'
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

interface TopBarProps {
  title: string
  subtitle?: string
  onLanguageChange?: (lang: 'fr' | 'en') => void
}

export function TopBar({ title, subtitle, onLanguageChange }: TopBarProps) {
  const [mounted, setMounted] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    setMounted(true)
    const load = () => getProfile().then(data => setProfile(data))
    load()

    window.addEventListener('profile_updated', load)
    return () => window.removeEventListener('profile_updated', load)
  }, [])

  if (!mounted) return null

  return (
    <motion.div 
      initial={{ y: -20, x: 20, opacity: 0 }}
      animate={{ y: 0, x: 0, opacity: 1 }}
      className="fixed top-6 right-8 z-50 w-auto bg-transparent px-3 py-1.5 transition-all flex items-center justify-center gap-4 group duration-500"
    >
      <div className="flex items-center gap-4">
        <OnboardingDemo />

        {/* User Centric Info */}
        <div className="flex items-center gap-3 group/user cursor-pointer pr-1">
          <div className="relative">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-[10px] font-black tracking-tighter text-primary border border-primary/20 group-hover/user:bg-primary group-hover/user:text-primary-foreground ring-4 ring-transparent group-hover/user:ring-primary/10 transition-all duration-500 overflow-hidden">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.full_name || ''} className="h-full w-full object-cover" />
              ) : (
                getInitials(profile?.full_name || profile?.email || 'User')
              )}
            </div>
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-neutral-900 shadow-sm animate-pulse" />
          </div>
          <span className="hidden sm:block text-[13px] font-black tracking-tight text-foreground transition-all duration-300 group-hover/user:text-primary group-hover/user:translate-x-0.5">
            {profile?.full_name?.split(' ')[0] || profile?.email?.split('@')[0] || 'User'}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
