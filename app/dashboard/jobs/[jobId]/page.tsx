'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { getJob, getJobResults, type JobScore, type Job, type Candidate, exportResultsCSV } from '@/lib/api'
import { getStoredLanguage, t, Language } from '@/lib/i18n'
import { CandidateDrawer } from '@/components/hr/CandidateDrawer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ChevronLeft, GraduationCap, Mail, Phone, ExternalLink, Download, Search, Sparkles, Database } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

export default function JobDetailPage() {
  const router = useRouter()
  const params = useParams()
  const jobId = params.jobId as string

  const [language, setLanguage] = useState<Language>('fr')
  const [job, setJob] = useState<Job | null>(null)
  const [results, setResults] = useState<JobScore[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const loadData = useCallback(async () => {
    setIsLoading(true)
    const [j, res] = await Promise.all([getJob(jobId), getJobResults(jobId)])
    setJob(j)
    setResults(res)
    setIsLoading(false)
  }, [jobId])

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user || !user.email) { router.push('/login'); return }
    })
    setLanguage(getStoredLanguage())
    loadData()
  }, [jobId, router, loadData])

  const filteredResults = results.filter(res => {
    const search = searchQuery.toLowerCase()
    return (
      res.candidate.name?.toLowerCase().includes(search) ||
      res.candidate.email?.toLowerCase().includes(search) ||
      res.university?.toLowerCase().includes(search) ||
      res.candidate.university?.toLowerCase().includes(search)
    )
  })

  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage)

  const handleExport = async () => {
    if (!filteredResults.length) return
    const candidates = filteredResults.map(r => r.candidate)
    const csv = await exportResultsCSV(candidates)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Results_${job?.job_title || 'AI'}.csv`
    a.click()
    toast.success(language === 'fr' ? 'Exportation réussie' : 'Export successful')
  }

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-border border-t-primary" />
      </div>
    )
  }

  if (!job) {
    return (
      <div className="p-8 text-center bg-white/40 backdrop-blur-xl rounded-3xl border border-border/50 max-w-md mx-auto mt-20">
        <p className="text-lg font-black text-foreground uppercase tracking-widest">{language === 'fr' ? 'Job non trouvé' : 'Job not found'}</p>
        <Link href="/dashboard/library"><Button className="mt-6 rounded-xl h-11 px-8 bg-primary">Back to Library</Button></Link>
      </div>
    )
  }

  return (
    <div className="p-10 max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-6">
        <Link href="/dashboard/library">
          <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md border-border/50 hover:bg-primary hover:text-primary-foreground transition-all shadow-sm">
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </Link>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
             <span className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/10 shadow-sm">
              <Sparkles className="w-5 h-5" />
            </span>
            <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase italic">{job.job_title}</h1>
            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/10 rounded-lg px-3 py-1 font-black uppercase text-[10px] ml-4 tracking-widest">
              {job.status}
            </Badge>
          </div>
          <p className="text-muted-foreground font-medium text-lg ml-1 opacity-70">
            {language === 'fr' ? 'Pipeline IA - lancé le' : 'AI Pipeline - run on'} {new Date(job.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="ml-auto">
          <Button onClick={handleExport} className="gap-2 rounded-xl h-12 px-6 bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md border border-border/50 hover:bg-primary hover:text-primary-foreground font-black uppercase text-[10px] tracking-widest transition-all text-foreground shadow-sm">
            <Download className="w-4 h-4" />
            {language === 'fr' ? 'Exporter' : 'Export CSV'}
          </Button>
        </div>
      </motion.div>

      {/* Results Table */}
      <Card className="overflow-hidden border-border/50 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-xl rounded-[2.5rem] shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/40 bg-muted/30">
                <th className="p-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">{t('results.candidate', language)}</th>
                <th className="p-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">{t('common.contact', language)}</th>
                <th className="p-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">{t('common.education_short', language)}</th>
                <th className="p-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground text-center">{t('results.score', language)}</th>
                <th className="p-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">{t('common.ai_analysis', language)}</th>
                <th className="p-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground text-center">{language === 'fr' ? 'Action' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {paginatedResults.map((res) => (
                <tr 
                  key={res.id} 
                  className="group hover:bg-primary/5 transition-colors cursor-pointer"
                  onClick={() => { 
                    setSelectedCandidate({
                      ...res.candidate,
                      justification: res.justification,
                      analysis: res.analysis,
                      score: res.score,
                      badge: res.badge
                    }); 
                    setIsDrawerOpen(true) 
                  }}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2.5">
                      <div className={cn(
                        "h-8 w-8 rounded-lg flex items-center justify-center font-black text-[10px] border shadow-sm uppercase shrink-0",
                        res.badge === 'green' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                        res.badge === 'yellow' ? "bg-amber-50 text-amber-600 border-amber-100" :
                        "bg-red-50 text-red-600 border-red-100"
                      )}>
                        {res.candidate.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-[13px] text-foreground tracking-tight truncate leading-tight">{res.candidate.name}</p>
                        <p className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-wider truncate mt-0.5">{res.candidate.position || 'No Title'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-foreground/80 truncate">
                        <Mail className="w-2.5 h-2.5 text-primary/40" />
                        {res.candidate.email || 'No email'}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/60">
                        <Phone className="w-2.5 h-2.5" />
                        {res.phone || res.candidate.phone || 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-0.5 max-w-[180px]">
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-foreground/80 uppercase tracking-wider truncate">
                        <GraduationCap className="w-2.5 h-2.5 text-primary/40" />
                        {res.university || res.candidate.university || 'Unknown Uni'}
                      </div>
                      <p className="text-[9px] font-bold text-muted-foreground/60 truncate pl-4">{res.major || res.candidate.major || 'Unknown Major'}</p>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className={cn(
                      "inline-flex items-center px-2 py-1 rounded-lg font-black text-[10px] border shadow-sm transition-all",
                      res.badge === 'green' ? "bg-emerald-500 text-white border-emerald-400" :
                      res.badge === 'yellow' ? "bg-amber-50 text-amber-600 border-amber-100" :
                      "bg-red-50 text-red-600 border-red-100"
                    )}>
                      {res.score}%
                    </div>
                  </td>
                  <td className="p-4 max-w-xs">
                    <div className="space-y-2 py-1">
                       <div className="flex items-center gap-1.5 translate-x-[-2px]">
                         <Sparkles className="w-2.5 h-2.5 text-primary/50" />
                         <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/60">{t('common.why_candidate', language)}</p>
                       </div>
                       <p className="text-[11px] font-bold text-foreground/80 line-clamp-2 italic leading-relaxed pl-4 border-l-2 border-primary/10 group-hover:border-primary/40 transition-colors">
                        "{res.justification || t('pipeline.processing', language)}"
                       </p>
                    </div>
                  </td>
                  <td className="p-5 text-center">
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-primary/10 hover:text-primary transition-all">
                      <ExternalLink className="w-4 h-4 opacity-40 group-hover:opacity-100" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {results.length === 0 && (
            <div className="p-32 text-center space-y-4">
              <div className="h-16 w-16 rounded-3xl bg-muted flex items-center justify-center mx-auto text-muted-foreground animate-pulse">
                <Database className="h-8 w-8" />
              </div>
              <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">{language === 'fr' ? 'Aucun résultat trouvé pour ce job' : 'No results found for this job'}</p>
            </div>
          )}
        </div>
        
        {/* Pagination Controls */}
        {filteredResults.length > itemsPerPage && (
          <div className="border-t border-border/40 p-4 bg-muted/20 flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              {language === 'fr' ? 'Affichage de' : 'Showing'}{' '}
              {Math.min((currentPage - 1) * itemsPerPage + 1, filteredResults.length)} - {Math.min(currentPage * itemsPerPage, filteredResults.length)}{' '}
              {language === 'fr' ? 'sur' : 'of'} {filteredResults.length}
            </p>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="h-8 rounded-lg text-[10px] font-black uppercase tracking-widest"
              >
                {language === 'fr' ? 'Précédent' : 'Previous'}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage * itemsPerPage >= filteredResults.length}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="h-8 rounded-lg text-[10px] font-black uppercase tracking-widest"
              >
                {language === 'fr' ? 'Suivant' : 'Next'}
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Candidate Detail Drawer */}
      <CandidateDrawer
        candidate={selectedCandidate}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        language={language}
      />
    </div>
  )
}

