'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { t, Language } from '@/lib/i18n'
import { getFolder, getFolderCandidates, deleteCandidate, uploadCV, findDuplicateCandidate, reanalyzeCandidate, type Candidate, type Folder } from '@/lib/api'
import { CandidateDrawer } from '@/components/hr/CandidateDrawer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ChevronLeft, Upload, FileText, Loader2, Minus, AlertCircle, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function FolderDetailPage() {
  const router = useRouter()
  const params = useParams()
  const folderId = params.folderId as string

  const [language, setLanguage] = useState<Language>('fr')
  const [folder, setFolder] = useState<Folder | null>(null)
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  
  // Duplication handling
  const [duplicateFile, setDuplicateFile] = useState<File | null>(null)
  const [duplicateCandidate, setDuplicateCandidate] = useState<Candidate | null>(null)
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false)
  const [pendingFiles, setPendingFiles] = useState<File[]>([])

  const loadData = useCallback(async () => {
    setIsLoading(true)
    const [f, cands] = await Promise.all([getFolder(folderId), getFolderCandidates(folderId)])
    setFolder(f)
    setCandidates(cands)
    setIsLoading(false)
  }, [folderId])

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/login'); return }
    })
    const savedLang = (localStorage.getItem('aurith_language') as Language) || 'fr'
    setLanguage(savedLang)
    loadData()
  }, [folderId, router, loadData])

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true) }
  const handleDragLeave = () => setIsDragging(false)

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf' || f.name.endsWith('.pdf'))
    if (files.length > 0) {
      await handleFileUpload(files)
    } else {
      toast.error(language === 'fr' ? 'Seulement les fichiers PDF sont acceptés' : 'Only PDF files are accepted')
    }
  }

  const handleFileUpload = async (files: File[]) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !folder) return
    setIsUploading(true)

    const filesToProcess = [...files]
    
    for (let i = 0; i < filesToProcess.length; i++) {
      const file = filesToProcess[i]
      // Add a small delay between multiple files to avoid rate limiting
      if (i > 0) {
        await new Promise(resolve => setTimeout(resolve, 1500))
      }
      
      const result = await uploadCV(file, folderId)

      if (result.status === 'duplicate') {
        setDuplicateFile(file)
        setDuplicateCandidate(result.candidate!)
        setPendingFiles(filesToProcess.slice(i + 1))
        setShowDuplicateDialog(true)
        setIsUploading(false)
        return // Stop loop and wait for user decision
      }

      if (result.status === 'success' && result.candidate) {
        setCandidates(prev => [...prev, result.candidate as Candidate])
      }
    }

    setIsUploading(false)
    toast.success(t('common.cv_uploaded', language))
  }

  const handleDuplicateDecision = async (decision: 'update' | 'keep') => {
    if (!duplicateFile || !folder) return
    setShowDuplicateDialog(false)
    setIsUploading(true)

    const forceUpdate = decision === 'update'
    const result = await uploadCV(duplicateFile, folderId, { updateIfDuplicate: forceUpdate })

    if (result.status === 'success' && result.candidate) {
      setCandidates(prev => {
        const otherCandidates = prev.filter(c => c.id !== (result.candidate as Candidate).id)
        return [...otherCandidates, result.candidate as Candidate]
      })
      toast.success(language === 'fr' ? 'Base de données mise à jour' : 'Database updated')
    }

    setDuplicateFile(null)
    setDuplicateCandidate(null)
    
    // Continue with pending files
    if (pendingFiles.length > 0) {
      await handleFileUpload(pendingFiles)
      setPendingFiles([])
    } else {
      setIsUploading(false)
    }
  }

  const handleDeleteCandidate = async (candidateId: string) => {
    const ok = await deleteCandidate(folderId, candidateId)
    if (ok) {
      setCandidates(prev => prev.filter(c => c.id !== candidateId))
      toast.success(language === 'fr' ? 'Candidat supprimé' : 'Candidate deleted')
    }
  }

  const handleReanalyzeCandidate = async (candidateId: string) => {
    toast.promise(reanalyzeCandidate(candidateId), {
      loading: language === 'fr' ? 'Analyse en cours...' : 'AI is analyzing CV...',
      success: (data) => {
        if (data) {
          setCandidates(prev => prev.map(c => c.id === data.id ? data : c))
          return language === 'fr' ? 'Analyse réussie' : 'Analysis successful'
        }
        throw new Error('Failed to re-analyze')
      },
      error: language === 'fr' ? 'Erreur lors de l\'analyse' : 'Error during analysis'
    })
  }

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-border border-t-primary" />
      </div>
    )
  }

  if (!folder) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg text-muted-foreground">{language === 'fr' ? 'Dossier non trouvé' : 'Folder not found'}</p>
        <Link href="/dashboard/library"><Button className="mt-4" variant="outline">Back</Button></Link>
      </div>
    )
  }

  return (
    <div className="p-12 max-w-7xl mx-auto space-y-12">
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
              <FileText className="w-5 h-5" />
            </span>
            <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase">{folder.name}</h1>
          </div>
          <p className="text-muted-foreground font-medium text-lg ml-1">{folder.job_title}</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 bg-muted px-4 py-2 rounded-xl border border-border/50 shadow-sm">
            {candidates.length} {language === 'fr' ? 'candidat(s)' : 'candidate(s)'}
          </span>
        </div>
      </motion.div>

      {/* Upload Area */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative overflow-hidden p-10 text-center border-2 border-dashed transition-all duration-500 rounded-[2rem] group",
            isDragging ? "border-primary bg-primary/5 scale-[1.01]" : "border-border/60 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-xl"
          )}
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.05] transition-opacity duration-700 pointer-events-none bg-cover bg-center" style={{ backgroundImage: `url(https://products.ls.graphics/mesh-gradients/images/03.-Snowy-Mint_1-p-130x130q80.jpeg)` }} />
          <div className="relative z-10">
            <div className="p-4 bg-primary/10 rounded-xl w-fit mx-auto mb-4 border border-primary/20 group-hover:scale-110 group-hover:rotate-6 transition-transform">
              {isUploading ? <Loader2 className="w-8 h-8 text-primary animate-spin" /> : <Upload className="w-8 h-8 text-primary" />}
            </div>
            <h3 className="text-xl font-black tracking-tight text-foreground mb-2">{t('library.upload_cv', language)}</h3>
            <p className="text-muted-foreground font-medium max-w-sm mx-auto mb-6 leading-relaxed text-sm">{t('library.drag_drop', language)}</p>
            <div className="flex gap-3 justify-center">
              <label className="cursor-pointer">
                <input type="file" accept=".pdf" multiple className="hidden" onChange={(e) => { if (e.target.files) handleFileUpload(Array.from(e.target.files)) }} />
                <span className="inline-flex items-center h-11 px-6 rounded-xl gap-2 bg-white/50 backdrop-blur-md border border-border/50 hover:bg-primary hover:text-primary-foreground font-black uppercase text-[10px] tracking-widest transition-all cursor-pointer text-foreground">
                  {t('library.upload_pdf', language)}
                </span>
              </label>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Candidates */}
      {candidates.length > 0 ? (
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } }}>
          {candidates.map((candidate: Candidate) => (
            <motion.div key={candidate.id} variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } }} whileHover={{ y: -5, scale: 1.01 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
              <Card className="group relative overflow-hidden p-7 cursor-pointer bg-white/60 dark:bg-neutral-900/40 backdrop-blur-xl border border-border/50 hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-xl rounded-[1.5rem] flex flex-col justify-between h-full min-h-[240px]" onClick={() => { setSelectedCandidate(candidate); setIsDrawerOpen(true) }}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.08] transition-opacity duration-500 pointer-events-none bg-cover bg-center" style={{ backgroundImage: `url(https://products.ls.graphics/mesh-gradients/images/15.-Perfume_1-p-130x130q80.jpeg)` }} />
                <div className="relative z-10 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <h3 className="text-base font-black tracking-tight text-foreground group-hover:text-primary transition-colors truncate">
                        {candidate.name}
                      </h3>
                      <p className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-widest truncate">
                        {candidate.position}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                       <div className={cn("h-8 w-8 shrink-0 rounded-lg flex items-center justify-center font-black text-[10px] border shadow-sm transition-all group-hover:scale-110",
                        candidate.score >= 80 ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/10" :
                        candidate.score >= 60 ? "bg-amber-500/10 text-amber-600 border-amber-500/10" :
                        "bg-neutral-100 dark:bg-neutral-800 text-muted-foreground border-border/50")}>
                        {candidate.score > 0 ? candidate.score : '0'}
                      </div>
                      
                      {/* AI Re-analyze Button if no skills */}
                      {(candidate.skills.length === 0 || !candidate.email) && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation()
                            handleReanalyzeCandidate(candidate.id)
                          }}
                          className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 hover:bg-primary hover:text-white transition-all shadow-sm group/ai"
                          title={language === 'fr' ? 'Analyse IA' : 'AI Analysis'}
                        >
                          <Sparkles className="w-4 h-4 text-primary group-hover/ai:text-white" />
                        </button>
                      )}
                      
                      {/* Delete Button matching user request image */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          if (window.confirm(language === 'fr' ? 'Supprimer ce candidat ?' : 'Delete this candidate?')) {
                            handleDeleteCandidate(candidate.id)
                          }
                        }}
                        className="h-8 w-8 rounded-lg bg-red-100 dark:bg-red-950/30 flex items-center justify-center border border-red-200 dark:border-red-900/50 hover:bg-red-500 hover:text-white transition-all shadow-sm group/delete"
                      >
                        <Minus className="w-4 h-4 text-red-600 group-hover/delete:text-white stroke-[4]" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="flex flex-wrap gap-1.5">
                      {candidate.skills.slice(0, 3).map((skill: string) => (
                        <Badge key={skill} variant="secondary" className="bg-primary/10 text-primary border-primary/10 rounded-md px-2 py-0.5 text-[9px] font-bold">{skill}</Badge>
                      ))}
                      {candidate.skills.length === 0 && <span className="text-[10px] text-muted-foreground italic">No skills yet • run pipeline</span>}
                      {candidate.skills.length > 3 && <Badge variant="secondary" className="bg-muted text-muted-foreground rounded-md px-2 py-0.5 text-[9px] font-bold border-border/50">+{candidate.skills.length - 3}</Badge>}
                    </div>
                  </div>
                </div>
                <div className="relative z-10">
                  <Button variant="outline" className="w-full h-11 rounded-xl gap-2 bg-white/50 backdrop-blur-md border-border/50 hover:bg-primary hover:text-primary-foreground font-black uppercase text-[10px] tracking-widest transition-all shadow-sm">
                    <FileText className="w-4 h-4" />
                    {language === 'fr' ? 'Consulter' : 'View'}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <Card className="p-12 text-center bg-white/40 dark:bg-neutral-900/40 backdrop-blur-xl border border-border/40 rounded-[1.5rem]">
          <p className="text-muted-foreground font-medium">{t('library.no_candidates', language)}</p>
          <p className="text-sm text-muted-foreground/60 mt-1">{language === 'fr' ? 'Glissez des CVs PDF pour commencer' : 'Drop PDF CVs above to get started'}</p>
        </Card>
      )}

      {/* Candidate Detail Drawer */}
      <CandidateDrawer
        candidate={selectedCandidate}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        language={language}
        onDelete={handleDeleteCandidate}
      />

      {/* Duplicate Dialog */}
      <AlertDialog open={showDuplicateDialog} onOpenChange={setShowDuplicateDialog}>
        <AlertDialogContent className="rounded-[2rem] border-none shadow-2xl bg-white/60 dark:bg-neutral-900/40 backdrop-blur-2xl p-10">
          <AlertDialogHeader className="space-y-4">
            <div className="h-16 w-16 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-600 mx-auto border border-amber-500/10">
              <AlertCircle className="w-8 h-8" />
            </div>
            <AlertDialogTitle className="text-2xl font-black tracking-tight text-center uppercase italic">
              {language === 'fr' ? 'Candidat déjà présent' : 'Duplicate Found'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center font-medium text-muted-foreground leading-relaxed">
              {language === 'fr' 
                ? `Le candidat ${duplicateCandidate?.name || ''} (${duplicateCandidate?.email}) est déjà dans votre base de données. Que voulez-vous faire ?`
                : `Candidate ${duplicateCandidate?.name || ''} (${duplicateCandidate?.email}) is already in your database. What would you like to do?`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-3 mt-8">
            <Button 
               variant="outline" 
               onClick={() => handleDuplicateDecision('keep')}
               className="h-12 w-full sm:flex-1 rounded-xl bg-white/20 hover:bg-white/40 border-border/50 font-black uppercase tracking-widest text-[10px]"
            >
              {language === 'fr' ? 'Garder les données' : 'Keep Current Data'}
            </Button>
            <Button 
               onClick={() => handleDuplicateDecision('update')}
               className="h-12 w-full sm:flex-1 rounded-xl bg-primary shadow-lg shadow-primary/20 font-black uppercase tracking-widest text-[10px]"
            >
              {language === 'fr' ? 'Mettre à jour' : 'Update & Overwrite'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
