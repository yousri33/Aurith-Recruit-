'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { t, getStoredLanguage } from '@/lib/i18n'
import { getFolders, runPipeline, type Folder } from '@/lib/api'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { LoaderFive } from '@/components/ui/loader'
import { LayoutDashboard, FileText, Zap, ChevronRight, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

export default function PipelinePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PipelineContent />
    </Suspense>
  )
}

function PipelineContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialFolderId = searchParams.get('folderId') || ''
  const [language, setLanguage] = useState<'fr' | 'en'>('en')
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [step, setStep] = useState(1)
  const [folders, setFolders] = useState<Folder[]>([])
  const [formData, setFormData] = useState({
    folderId: '',
    jobTitle: '',
    jobDescription: '',
    requiredSkills: '',
    yearsExperience: '',
  })

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/login'); return }
      const lang = getStoredLanguage()
      setLanguage(lang)
      getFolders().then(data => {
        setFolders(data)
        const currentFolderId = initialFolderId || (data.length > 0 ? data[0].id : '')
        const selected = data.find(f => f.id === currentFolderId)
        setFormData(prev => ({ 
          ...prev, 
          folderId: currentFolderId, 
          jobTitle: selected?.job_title || '' 
        }))
        setMounted(true)
      })
    })
  }, [router, initialFolderId])

  const loadingMessages = [
    t('pipeline.readingCVs', language) || 'Reading CVs...',
    t('pipeline.extractingSkills', language) || 'Extracting skills...',
    t('pipeline.detectingLacks', language) || 'Detecting gaps...',
    t('pipeline.calculatingScores', language) || 'Calculating scores...',
    t('pipeline.rankingCandidates', language) || 'Ranking candidates...',
  ]

  const handleRunPipeline = async () => {
    if (!formData.folderId || !formData.jobTitle || !formData.jobDescription) {
      toast.error(t('common.error', language))
      return
    }

    setIsLoading(true)
    const skills = formData.requiredSkills.split(',').map(s => s.trim()).filter(Boolean)

    // Animate progress messages
    for (let i = 0; i < loadingMessages.length; i++) {
      setMessage(loadingMessages[i])
      await new Promise((r) => setTimeout(r, 900))
    }

    const result = await runPipeline(
      formData.folderId,
      formData.jobTitle,
      formData.jobDescription,
      skills,
      parseInt(formData.yearsExperience) || 0,
      language,
    )

    setIsLoading(false)

    if (result) {
      toast.success(t('common.success', language))
      router.push(`/dashboard/jobs/${result.id}`)
    } else {
      toast.error(t('common.error', language))
    }
  }

  if (!mounted) return null

  const steps = [
    { id: 1, title: language === 'fr' ? 'Dossier' : 'Folder', icon: FileText },
    { id: 2, title: language === 'fr' ? 'Détails' : 'Details', icon: LayoutDashboard },
    { id: 3, title: language === 'fr' ? 'Lancer' : 'Launch', icon: Zap },
  ]

  return (
    <div className="min-h-screen p-6 max-w-2xl mx-auto relative pt-12">
      <div className="absolute top-0 right-0 -z-10 w-64 h-64 bg-primary/5 blur-[80px] rounded-full" />
      <div className="absolute bottom-0 left-0 -z-10 w-64 h-64 bg-purple-500/5 blur-[80px] rounded-full" />

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
        <h1 className="text-3xl font-black tracking-tight text-foreground mb-2">{t('pipeline.title', language)}</h1>
        <p className="text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">{t('pipeline.pipelineSubtitle', language)}</p>
      </motion.div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-3 mb-8">
        {steps.map((s, idx) => (
          <div key={s.id} className="flex items-center gap-3">
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                animate={{
                  backgroundColor: step >= s.id ? 'var(--primary)' : 'transparent',
                  borderColor: step >= s.id ? 'var(--primary)' : 'var(--border)',
                  scale: step === s.id ? 1.05 : 1,
                }}
                className={cn("w-9 h-9 rounded-xl border-2 flex items-center justify-center transition-colors shadow-md", step >= s.id ? "text-primary-foreground shadow-primary/10" : "text-muted-foreground/60")}
              >
                {step > s.id ? <CheckCircle2 className="w-5 h-5" /> : <s.icon className="w-4 h-4" />}
              </motion.div>
              <span className={cn("text-[10px] font-black uppercase tracking-[0.1em]", step >= s.id ? "text-primary" : "text-muted-foreground/50")}>{s.title}</span>
            </div>
            {idx < steps.length - 1 && (
              <div className="w-8 h-[2px] bg-border relative -mt-4 opacity-30">
                <motion.div animate={{ width: step > s.id ? '100%' : '0%' }} className="absolute inset-0 bg-primary transition-all duration-500" />
              </div>
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div key="loader" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}>
            <Card className="p-10 text-center border-none shadow-xl bg-white/60 dark:bg-neutral-900/40 backdrop-blur-2xl overflow-hidden relative">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
              <LoaderFive text={message} />
              <p className="mt-6 text-sm text-muted-foreground font-bold flex items-center justify-center gap-2 tracking-wide uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                {t('common.loading', language)}
              </p>
            </Card>
          </motion.div>
        ) : (
          <motion.div key={step} initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} transition={{ duration: 0.25, ease: "easeOut" }}>
            <Card className="p-7 border-none shadow-xl bg-white/60 dark:bg-neutral-900/40 backdrop-blur-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              {step === 1 && (
                <div className="space-y-6">
                  {folders.length === 0 ? (
                    <div className="text-center py-8 space-y-3">
                      <p className="text-muted-foreground font-medium">{language === 'fr' ? 'Aucun dossier trouvé' : 'No folders found'}</p>
                      <p className="text-sm text-muted-foreground/60">{language === 'fr' ? 'Créez un dossier dans la bibliothèque d\'abord' : 'Create a folder in the library first'}</p>
                      <Button onClick={() => router.push('/dashboard/library')} className="rounded-xl bg-primary">{language === 'fr' ? 'Aller à la bibliothèque' : 'Go to Library'}</Button>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3">
                        <label className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                          <FileText className="w-4 h-4 text-primary/70" />
                          {t('pipeline.selectFolder', language)}
                        </label>
                        <div className="relative">
                          <select
                            value={formData.folderId}
                            onChange={(e) => {
                              const selected = folders.find(f => f.id === e.target.value)
                              setFormData({ ...formData, folderId: e.target.value, jobTitle: selected?.job_title || '' })
                            }}
                            className="w-full h-11 pl-4 pr-10 appearance-none bg-white/40 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-xl text-foreground focus:ring-1 focus:ring-primary/50 transition-all outline-none font-bold text-sm"
                          >
                            {folders.map((f) => (
                              <option key={f.id} value={f.id} className="bg-background text-foreground">{f.name}</option>
                            ))}
                          </select>
                          <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 rotate-90" />
                        </div>
                      </div>
                      <Button onClick={() => setStep(2)} className="w-full h-11 rounded-xl text-sm font-black tracking-tight bg-primary hover:bg-primary/90 shadow-md shadow-primary/10 transition-all active:scale-[0.98] group">
                        {t('common.save', language)}
                        <ChevronRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                      </Button>
                    </>
                  )}
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="grid gap-5">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70">{t('pipeline.jobTitle', language)}</label>
                      <Input value={formData.jobTitle} onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })} placeholder="Senior Product Designer" className="h-11 rounded-xl bg-white/40 dark:bg-black/20 border-white/20 dark:border-white/10 text-sm font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70">{t('pipeline.jobDescription', language)}</label>
                      <textarea value={formData.jobDescription} onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })} rows={4} className="w-full px-4 py-3 bg-white/40 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-xl text-foreground focus:ring-2 focus:ring-primary/50 transition-all outline-none font-bold text-sm resize-none placeholder:font-normal" placeholder="Summary of requirements..." />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70">{t('pipeline.requiredSkills', language)}</label>
                      <Input value={formData.requiredSkills} onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })} placeholder="React, TypeScript, Node.js" className="h-11 rounded-xl bg-white/40 dark:bg-black/20 border-white/20 dark:border-white/10 text-sm font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70">{language === 'fr' ? "Années d'expérience" : 'Years of Experience'}</label>
                      <Input value={formData.yearsExperience} onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })} placeholder="5" type="number" min="0" className="h-11 rounded-xl bg-white/40 dark:bg-black/20 border-white/20 dark:border-white/10 text-sm font-bold" />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="ghost" onClick={() => setStep(1)} className="flex-1 h-11 rounded-xl font-black text-xs bg-white/20 dark:bg-white/5 hover:bg-white/40 transition-all uppercase tracking-widest">{t('common.cancel', language)}</Button>
                    <Button onClick={() => setStep(3)} className="flex-1 h-11 rounded-xl font-black text-xs uppercase tracking-widest bg-primary hover:bg-primary/90 shadow-md transition-all group">
                      {t('common.save', language)}
                      <ChevronRight className="ml-1 w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-[0.03]"><FileText className="w-12 h-12" /></div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70 mb-1">Confirmation</h3>
                    <p className="text-xl font-black text-foreground">{formData.jobTitle}</p>
                    <p className="text-xs text-muted-foreground mt-1.5 italic line-clamp-2">"{formData.jobDescription}"</p>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {formData.requiredSkills.split(',').filter(Boolean).map(s => (
                        <span key={s} className="text-[9px] font-black uppercase tracking-widest bg-primary/10 text-primary px-2 py-0.5 rounded-md border border-primary/10">{s.trim()}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="ghost" onClick={() => setStep(2)} className="flex-1 h-12 rounded-xl font-black text-xs bg-white/20 dark:bg-white/5 hover:bg-white/40 transition-all uppercase tracking-widest">{t('common.cancel', language)}</Button>
                    <Button onClick={handleRunPipeline} className="flex-[1.5] h-12 rounded-xl font-black bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 relative group overflow-hidden">
                      <motion.div animate={{ x: ["-100%", "200%"] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
                      <Zap className="w-4 h-4 fill-current" />
                      <span className="text-sm uppercase tracking-[0.1em]">{t('pipeline.runAnalysis', language)}</span>
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
