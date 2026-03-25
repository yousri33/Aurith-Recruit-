'use client'

import { useState, useEffect } from 'react'
import { t, getStoredLanguage } from '@/lib/i18n'
import { type Candidate, type PipelineResult } from '@/lib/api'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, FileText, TrendingUp, Users, Target, UserCheck } from 'lucide-react'
import { toast } from 'sonner'
import { CandidateDrawer } from '@/components/hr/CandidateDrawer'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { NoiseBackground } from '@/components/ui/noise-background'

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const avatarStyles: Record<'green' | 'yellow' | 'red', string> = {
  green: 'ring-emerald-500 bg-emerald-50 text-emerald-700',
  yellow: 'ring-amber-400 bg-amber-50 text-amber-700',
  red: 'ring-red-400 bg-red-50 text-red-600',
}

const scoreStyles: Record<string, string> = {
  high: 'bg-emerald-500 text-white',
  mid: 'bg-amber-500 text-white',
  low: 'bg-red-500 text-white',
}

const barColors: Record<string, string> = {
  high: 'bg-emerald-500',
  mid: 'bg-amber-400',
  low: 'bg-red-500',
}

function scoreLevel(score: number) {
  if (score >= 75) return 'high'
  if (score >= 50) return 'mid'
  return 'low'
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return (
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-500/20 text-yellow-600 border border-yellow-500/20 font-black text-sm shadow-[0_0_15px_rgba(234,179,8,0.1)]">
      1
    </div>
  )
  if (rank === 2) return (
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-400/20 text-slate-500 border border-slate-400/20 font-black text-sm">
      2
    </div>
  )
  if (rank === 3) return (
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-400/20 text-orange-600 border border-orange-400/20 font-black text-sm">
      3
    </div>
  )
  return <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/30 text-muted-foreground border border-border/50 font-black text-[12px]">{rank}</div>
}

export default function ResultsPage() {
  const [language, setLanguage] = useState<'fr' | 'en'>('en')
  const [mounted, setMounted] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)

  const [pipelineResult, setPipelineResult] = useState<PipelineResult | null>(null)

  useEffect(() => {
    setLanguage(getStoredLanguage())
    const stored = sessionStorage.getItem('pipelineResult')
    if (stored) {
      try { setPipelineResult(JSON.parse(stored)) } catch {}
    }
    setMounted(true)
  }, [])

  const handleExport = () => {
    toast.success(t('common.success', language))
  }

  if (!mounted) return null

  // Read from real pipeline result stored after running analysis
  const candidates = (pipelineResult?.rankedCandidates ?? []) as Candidate[]

  return (
    <div className="p-12 max-w-7xl mx-auto space-y-12 relative">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-sm transition-transform hover:rotate-6">
              <TrendingUp className="h-7 w-7" />
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-foreground uppercase italic leading-none">{t('results.title', language)}</h1>
          </div>
          <p className="text-sm font-bold text-muted-foreground/60 uppercase tracking-[0.2em] pl-1">
            {pipelineResult ? pipelineResult.job_title : t('results.resultsSubtitle', language)}
          </p>
        </div>

        <div className="flex gap-3">
          <Button onClick={handleExport} className="h-10 px-5 rounded-xl gap-2 bg-primary text-primary-foreground font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
            <Download className="h-3.5 w-3.5" />
            {t('results.exportCSV', language)}
          </Button>
          <Button variant="outline" onClick={handleExport} className="h-10 px-5 rounded-xl gap-2 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md border-border/50 font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all">
            <Download className="h-3.5 w-3.5" />
            {t('results.exportPDF', language)}
          </Button>
        </div>
      </motion.div>

      {/* Main Results Container */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
          }
        }}
        className="space-y-3"
      >
        {/* Header Row */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 overflow-hidden">
          <div className="col-span-1">Rang</div>
          <div className="col-span-4">Candidat</div>
          <div className="col-span-2 text-center">Score</div>
          <div className="col-span-3">Adéquation</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {candidates.map((candidate, idx) => {
          const level = scoreLevel(candidate.score)
          return (
            <motion.div
              key={candidate.id}
              variants={{
                hidden: { opacity: 0, x: -10 },
                visible: { opacity: 1, x: 0 }
              }}
              whileHover={{ x: 5, scale: 1.005 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              onClick={() => setSelectedCandidate(candidate)}
            >
              <Card className="group relative overflow-hidden p-4 cursor-pointer bg-white/60 dark:bg-neutral-900/40 backdrop-blur-xl border border-border/50 hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-xl rounded-[1.25rem] grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                {/* mesh bg */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-[0.05] transition-opacity duration-500 pointer-events-none bg-cover bg-center scale-110"
                  style={{ backgroundImage: `url(https://products.ls.graphics/mesh-gradients/images/15.-Perfume_1-p-130x130q80.jpeg)` }}
                />

                {/* Rank */}
                <div className="col-span-1 flex items-center justify-center md:justify-start">
                  <RankBadge rank={idx + 1} />
                </div>

                {/* Candidate */}
                <div className="col-span-4 flex items-center gap-3">
                  <div className="relative group/avatar">
                    <div className={cn(
                      "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-black tracking-tighter transition-transform duration-500 group-hover/avatar:scale-110 border-2 border-white dark:border-neutral-900 shadow-sm ring-2",
                      candidate.score >= 80 ? "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20" :
                      candidate.score >= 60 ? "bg-amber-500/10 text-amber-600 ring-amber-500/20" :
                      "bg-red-500/10 text-red-600 ring-red-500/20"
                    )}>
                      {getInitials(candidate.name)}
                    </div>
                    <span className={cn(
                      "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white dark:border-neutral-900 shadow-sm",
                      candidate.score >= 60 ? "bg-emerald-500" : "bg-red-500"
                    )} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <p className="text-sm font-black tracking-tight text-foreground group-hover:text-primary transition-colors truncate">{candidate.name}</p>
                    <p className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest leading-tight truncate">{candidate.position}</p>
                  </div>
                </div>

                {/* Score */}
                <div className="col-span-2 flex items-center justify-center">
                  <div className={cn(
                    "px-3 py-1 rounded-lg font-black text-[12px] tracking-tight border shadow-sm transition-all group-hover:scale-110",
                    candidate.score >= 80 ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/10" :
                    candidate.score >= 60 ? "bg-amber-500/10 text-amber-600 border-amber-500/10" :
                    "bg-red-500/10 text-red-600 border-red-500/10"
                  )}>
                    {candidate.score} <span className="text-[9px] opacity-60">/ 100</span>
                  </div>
                </div>

                {/* Match % */}
                <div className="col-span-3 flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">
                    <span>Maintenance</span>
                    <span>{candidate.match_percentage}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted/30 rounded-full overflow-hidden p-[2px] border border-border/20">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${candidate.match_percentage}%` }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.1 * idx }}
                      className={cn(
                        "h-full rounded-full relative",
                        candidate.match_percentage >= 80 ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" :
                        candidate.match_percentage >= 60 ? "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.3)]" :
                        "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]"
                      )}
                    >
                      <div className="absolute top-0 right-0 h-full w-[2px] bg-white/40 animate-pulse" />
                    </motion.div>
                  </div>
                </div>

                {/* Combined Action */}
                <div className="col-span-2 flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 px-4 rounded-xl gap-2 font-black uppercase text-[10px] tracking-widest text-primary hover:bg-primary/5 transition-all group-hover:translate-x-1"
                  >
                    Details
                    <FileText className="h-3 w-3" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Candidate detail drawer */}
      <CandidateDrawer
        candidate={selectedCandidate}
        isOpen={selectedCandidate !== null}
        onClose={() => setSelectedCandidate(null)}
        language={language}
      />
    </div>
  )
}
