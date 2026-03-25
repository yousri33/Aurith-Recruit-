'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { getJobs, type Job } from '@/lib/api'
import { getStoredLanguage } from '@/lib/i18n'
import { JobCard } from '@/components/hr/JobCard'
import { Button } from '@/components/ui/button'
import { Sparkles, Plus, Zap } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function JobsPage() {
  const router = useRouter()
  const [language, setLanguage] = useState<'fr' | 'en'>('en')
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  const loadJobs = useCallback(async () => {
    setIsLoading(true)
    const data = await getJobs()
    setJobs(data)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/login'); return }
      setLanguage(getStoredLanguage())
      setMounted(true)
      loadJobs()
    })
  }, [router, loadJobs])

  if (!mounted) return null

  return (
    <div className="p-10 max-w-6xl mx-auto space-y-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-sm transition-transform hover:rotate-6">
              <Sparkles className="h-7 w-7" />
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-foreground uppercase italic leading-none">
              {language === 'fr' ? 'AI Pipelines' : 'AI Pipelines'}
            </h1>
          </div>
          <p className="text-sm font-bold text-muted-foreground/60 uppercase tracking-[0.2em] pl-1 leading-relaxed">
            {language === 'fr'
              ? 'Historique des analyses et classements IA'
              : 'History of AI-powered candidate analyses & rankings'}
          </p>
        </div>

        <Link href="/dashboard/pipeline">
          <Button className="gap-2 rounded-xl px-6 h-11 shadow-sm transition-all hover:shadow-xl hover:scale-[1.02] bg-primary text-primary-foreground border-none">
            <Zap className="w-4 h-4 fill-current" />
            <span className="font-black uppercase tracking-widest text-[11px]">
              {language === 'fr' ? 'Nouvelle Analyse' : 'New Analysis'}
            </span>
          </Button>
        </Link>
      </motion.div>

      {/* Jobs Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-border border-t-primary" />
        </div>
      ) : jobs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-32 space-y-6 rounded-3xl border border-dashed border-border/50 bg-white/20 dark:bg-neutral-900/20"
        >
          <div className="h-20 w-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary">
            <Sparkles className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <p className="text-xl font-black text-foreground/60 uppercase tracking-widest">
              {language === 'fr' ? 'Aucun Pipeline AI' : 'No AI Pipelines Yet'}
            </p>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
              {language === 'fr'
                ? 'Lancez votre première analyse AI pour voir les résultats ici'
                : 'Run your first AI analysis to see results appear here'}
            </p>
          </div>
          <Link href="/dashboard/pipeline">
            <Button className="gap-2 rounded-xl px-8 h-12 bg-primary mt-2 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">
              <Zap className="w-4 h-4 fill-current" />
              <span className="font-black uppercase tracking-widest text-[11px]">
                {language === 'fr' ? 'Lancer une Analyse' : 'Run an Analysis'}
              </span>
            </Button>
          </Link>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {jobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <JobCard job={job} language={language} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
