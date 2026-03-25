'use client'

import * as React from 'react'
import { useState } from "react"
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  BookOpen,
  Building,
  Building2,
  CircleDashed,
  Code2,
  Download,
  Megaphone,
  Palette,
  Rocket,
  TrendingUp,
  HelpCircle,
  Zap,
  Target,
  LayoutDashboard,
  BrainCircuit,
  Users,
  Search,
  ChevronRight,
  Check
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  ChoiceGroup,
  FeatureCarousel,
  Onboarding,
  TipsList,
  useOnboarding,
} from "../ui/onboarding"

const STEP_CONFIG = [
  {
    title: "Intelligence Center",
    description: "Start accelerating your recruitment with high-performance AI agents.",
  },
  {
    title: "Personalize Experience",
    description: "Tell us about your focus so we can tailor the command center logic.",
  },
  {
    title: "Strategic Readiness",
    description: "Key protocols to extract maximum performance from Aurith Recruit.",
  },
]

export const FEATURES = [
  {
    id: "dock",
    icon: LayoutDashboard,
    title: "The Dock Interface",
    description:
      "Access all primary recruitment tools from the floating dock at the bottom of your screen.",
    image: "/onboarding/onboarding 1.png",
  },
  {
    id: "dashboard",
    icon: LayoutDashboard,
    title: "Command Overview",
    description:
      "Monitor your entire recruitment funnel with real-time analytics and high-density data visualization.",
    image: "/onboarding/onboarding 1.png",
  },
  {
    id: "ranking",
    icon: BrainCircuit,
    title: "Candidate Analysis",
    description:
      "Automated agents analyze skill match, experience metrics, and CV structure for every candidate.",
    image: "/onboarding/onboarding 2.png",
  },
] as const

export const ROLES = [
  { id: "hr_director", label: "HR Director", icon: Users },
  { id: "founder", label: "Founder", icon: Rocket },
  { id: "tech_lead", label: "Tech Lead", icon: Code2 },
  { id: "recruiter", label: "Recruiter", icon: Search },
  { id: "other", label: "Other", icon: CircleDashed },
] as const

export const GOALS = [
  { id: "volume", label: "High Volume Hiring" },
  { id: "tech", label: "Deep Tech Sourcing" },
  { id: "speed", label: "Reducing Time-to-Hire" },
  { id: "quality", label: "Candidate Quality" },
] as const

export const TIPS = [
  {
    number: 1,
    text: "Review the 'Job Physics' score to understand why a candidate was ranked as a top match.",
  },
  {
    number: 2,
    text: "Use the Library to maintain a persistent talent pool across different recruitment seasons.",
  },
  {
    number: 3,
    text: "Trigger 'Quick Scans' on the dashboard for immediate insights on newly uploaded folders.",
  },
] as const

export const TOTAL_STEPS = 3
export const MAX_STEP_VALUE = FEATURES.length - 1

export function OnboardingDemo() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <button className="h-9 w-9 rounded-full bg-white/40 dark:bg-neutral-800/40 backdrop-blur-xl border border-white/20 dark:border-white/5 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-300 shadow-sm group/help">
          <HelpCircle className="w-5 h-5 transition-transform duration-300 group-hover/help:scale-110" />
        </button>
      </DialogTrigger>
      <DialogContent
        className="w-full max-w-4xl border-none bg-white dark:bg-neutral-900 shadow-2xl rounded-[1.5rem] overflow-hidden sm:max-w-4xl"
        showCloseButton={true}
      >
        <div className="w-full px-6 py-8 md:px-10 md:py-10">
          <Onboarding
            canGoNext={() => true}
            className="relative"
            maxStepValue={MAX_STEP_VALUE}
            onComplete={() => setOpen(false)}
            totalSteps={2}
          >
            <HeadlessOnboardingHeader />
            <div className="my-6 min-h-[380px]">
              <Onboarding.Step step={1}>
                <HeadlessFeatureStep />
              </Onboarding.Step>
              <Onboarding.Step step={2}>
                 <HeadlessTipsStep />
              </Onboarding.Step>
            </div>
            <Onboarding.Navigation 
              completeLabel="Complete"
              className="mt-2 pt-4 border-none"
            />
          </Onboarding>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function HeadlessOnboardingHeader() {
  const { currentStep } = useOnboarding()
  const config = STEP_CONFIG[currentStep - 1]

  return (
    <div className="text-center space-y-2 max-w-2xl mx-auto">
      <div className="space-y-0.5">
        <h1 className="text-2xl font-black tracking-tight text-foreground uppercase italic leading-tight">
          {config.title}
        </h1>
        <p className="text-[14px] font-bold text-muted-foreground/80 tracking-tight leading-relaxed">
          {config.description}
        </p>
      </div>
      <div className="flex justify-center pt-1.5">
        <Onboarding.StepIndicator className="gap-2" />
      </div>
    </div>
  )
}

function HeadlessFeatureStep() {
  const { stepValue, setStepValue } = useOnboarding()

  return (
    <div className="flex flex-col md:flex-row gap-10 items-start">
      <div className="w-full md:w-[240px] shrink-0 space-y-2 pt-1">
        {FEATURES.map((feature, index) => {
          const Icon = feature.icon
          const isActive = stepValue === index
          return (
            <div
              key={feature.id}
              onClick={() => setStepValue(index)}
              className={cn(
                "flex items-center gap-3 p-3.5 rounded-xl transition-all duration-300 cursor-pointer group/item",
                isActive
                  ? "bg-primary/5 shadow-sm scale-[1.02]"
                  : "hover:bg-muted/50"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-lg transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                <Icon className="size-4 shrink-0" />
              </div>
              <div className="space-y-0.5">
                <h4 className={cn(
                  "text-[13px] font-black tracking-tight transition-colors uppercase italic",
                  isActive ? "text-primary" : "text-foreground/60"
                )}>
                  {feature.title}
                </h4>
                {isActive && (
                  <p className="text-[11px] leading-tight text-muted-foreground font-medium line-clamp-2">
                    {feature.description}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
      <div className="flex-1 w-full flex items-center justify-center pt-2">
        <div className="relative w-full max-w-[540px] flex items-center justify-center">
             <AnimatePresence mode="wait">
               <motion.div
                 key={stepValue}
                 initial={{ opacity: 0, scale: 0.98 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 1.02 }}
                 className="w-full h-auto flex items-center justify-center"
               >
                 <img 
                   src={FEATURES[stepValue].image} 
                   alt="Platform Preview" 
                   className="w-full h-auto max-h-[340px] object-contain rounded-xl transition-transform duration-1000 group-hover/screen:scale-[1.01] border border-border/50 shadow-sm"
                 />
               </motion.div>
             </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function HeadlessRoleStep({
  selectedRole,
  onRoleSelect,
  selectedGoal,
  onGoalSelect,
}: {
  selectedRole: string | null
  onRoleSelect: (v: string) => void
  selectedGoal: string | null
  onGoalSelect: (v: string) => void
}) {
  const { handleNext } = useOnboarding()
  const [question, setQuestion] = useState(selectedGoal ? 2 : 1)

  return (
    <div className="max-w-xl mx-auto py-4">
      <AnimatePresence mode="wait">
        {question === 1 ? (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6" 
            key="q1"
          >
            <div className="space-y-1">
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Requirement 01/02</p>
               <h3 className="text-2xl font-black uppercase italic tracking-tight text-foreground">What describes your mission?</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
              {ROLES.map((role) => {
                const Icon = role.icon
                const isSelected = selectedRole === role.id
                return (
                  <button
                    key={role.id}
                    onClick={() => {
                        onRoleSelect(role.id)
                        setTimeout(() => setQuestion(2), 300)
                    }}
                    className={cn(
                      "flex flex-col items-center gap-4 cursor-pointer rounded-2xl border p-5 transition-all duration-300 group/role",
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground shadow-lg scale-105"
                        : "border-border/50 bg-white/40 dark:bg-white/5 text-foreground hover:border-primary/40 hover:bg-primary/5"
                    )}
                  >
                    <Icon className={cn("size-6 scale-110", isSelected ? "text-white" : "text-primary")} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{role.label}</span>
                  </button>
                )
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6" 
            key="q2"
          >
             <div className="space-y-1">
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Requirement 02/02</p>
               <h3 className="text-2xl font-black uppercase italic tracking-tight text-foreground">Select your primary objective</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {GOALS.map((goal) => {
                const isSelected = selectedGoal === goal.id
                return (
                  <button
                    key={goal.id}
                    onClick={() => {
                        onGoalSelect(goal.id)
                        setTimeout(() => handleNext(), 300)
                    }}
                    className={cn(
                      "flex items-center justify-center cursor-pointer h-16 rounded-2xl border p-4 text-center transition-all duration-300",
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground shadow-lg"
                        : "border-border/50 bg-white/40 dark:bg-white/5 text-foreground hover:border-primary/40 hover:bg-primary/5 shadow-sm"
                    )}
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest">{goal.label}</span>
                  </button>
                )
              })}
            </div>
            <div className="pt-4">
              <button
                className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.15em] text-muted-foreground/60 hover:text-primary transition-all group/back"
                onClick={() => setQuestion(1)}
              >
                <ArrowLeft className="size-3 group-hover/back:-translate-x-1 transition-transform" />
                Change Selection
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function HeadlessTipsStep() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
      <div className="space-y-6">
        <div className="space-y-1">
           <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">Success Protocols</p>
           <h3 className="text-xl font-black uppercase italic tracking-tight text-foreground">Operational Excellence</h3>
        </div>
        <div className="space-y-4">
          {TIPS.map((tip) => (
            <div key={tip.number} className="flex items-start gap-4 p-5 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/5 group/tip hover:border-primary/30 transition-all shadow-sm">
                <div className="h-8 w-8 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center text-[11px] font-black text-primary border border-primary/20 group-hover/tip:bg-primary group-hover/tip:text-white transition-all duration-300">
                    {tip.number}
                </div>
                <p className="text-[11px] leading-relaxed text-muted-foreground font-medium pr-2">
                    {tip.text}
                </p>
            </div>
          ))}
        </div>
      </div>
      <div className="hidden md:flex items-center justify-center">
        <div className="relative w-full aspect-square rounded-[2.5rem] border border-primary/20 bg-primary/2 overflow-hidden shadow-2xl p-10 flex flex-col items-center justify-center text-center space-y-4">
             <div className="absolute inset-0 bg-[#000]/2 rounded-[2.5rem]" />
             <div className="relative z-10 space-y-6">
                <div className="h-24 w-24 mx-auto rounded-3xl bg-emerald-500 flex items-center justify-center text-white shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                  <Check className="w-12 h-12" strokeWidth={3} />
                </div>
                <div className="space-y-2">
                   <h3 className="text-xl font-black uppercase italic tracking-tight text-foreground">System Optimized</h3>
                   <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground leading-relaxed">
                    Protocols loaded successfully.<br/> Command center operational.
                   </p>
                </div>
             </div>
        </div>
      </div>
    </div>
  )
}
