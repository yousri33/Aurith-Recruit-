'use client'

import { Candidate } from '@/lib/api'
import { Language, t } from '@/lib/i18n'
import {
  Sheet,
  SheetContent,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { X, GraduationCap, Briefcase, FileText, ExternalLink, Sparkles, Mail, Phone, Calendar, User, Zap, ChevronRight, Globe, MapPin, Database } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollArea } from '@/components/ui/scroll-area'

interface CandidateDrawerProps {
  candidate: Candidate | null
  isOpen: boolean
  onClose: () => void
  language: Language
}

export function CandidateDrawer({
  candidate,
  isOpen,
  onClose,
  language,
}: CandidateDrawerProps) {
  const [showCV, setShowCV] = useState(false)
  const [cvUrl, setCvUrl] = useState<string | null>(null)

  useEffect(() => {
    async function loadCvUrl() {
      if (!candidate?.cv_file_url) {
        setCvUrl(null)
        return
      }

      if (candidate.cv_file_url.startsWith('http')) {
        setCvUrl(candidate.cv_file_url)
      } else {
        const { data, error } = await supabase.storage
          .from('cv-files')
          .createSignedUrl(candidate.cv_file_url, 3600)
        
        if (error) {
          console.error('Error creating signed URL:', error)
          setCvUrl(null)
        } else {
          setCvUrl(data.signedUrl)
        }
      }
    }
    
    if (isOpen) {
      loadCvUrl()
      setShowCV(false)
    }
  }, [candidate, isOpen])

  if (!candidate) return null

  const meshGradientSrc = "https://products.ls.graphics/mesh-gradients/images/06.-Wisteria-p-130x130q80.jpeg"

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="right" 
        className={cn(
          "p-0 sm:max-w-md md:max-w-lg border-l border-border/10 bg-neutral-50/95 dark:bg-neutral-950/95 backdrop-blur-2xl transition-all duration-700 ease-in-out",
          showCV && "sm:max-w-4xl md:max-w-[85vw]" 
        )}
      >
        <div className="flex flex-col h-full overflow-hidden font-sans">
          
          {/* Immersive Header - Minimized Padding */}
          <div className="relative h-48 md:h-56 shrink-0 overflow-hidden">
             {/* Dynamic Mesh Backdrop */}
             <div 
               className="absolute inset-0 opacity-20 scale-110 blur-3xl animate-pulse duration-[10s]" 
               style={{ backgroundImage: `url(${meshGradientSrc})`, backgroundSize: 'cover' }} 
             />
             <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neutral-50/20 to-neutral-50 dark:via-neutral-950/20 dark:to-neutral-950" />
             
             {/* Content Overlay */}
             <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                <div className="flex items-center gap-6 translate-y-2">
                   <div className={cn(
                     "h-16 w-16 md:h-20 md:w-20 rounded-[1.5rem] border-4 border-white dark:border-neutral-900 shadow-xl flex items-center justify-center text-xl font-black shrink-0 relative group",
                     candidate.badge === 'green' ? "bg-emerald-500 text-white" :
                     candidate.badge === 'yellow' ? "bg-amber-500 text-white" :
                     "bg-neutral-600 text-white"
                   )}>
                     {candidate.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                     <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-2xl bg-white dark:bg-neutral-800 shadow-lg border border-border/50 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                     </div>
                   </div>

                   <div className="space-y-1">
                       <div className="flex flex-wrap items-center gap-2">
                         <h2 className="text-2xl md:text-3xl font-black tracking-tightest text-foreground uppercase leading-tight">{candidate.name}</h2>
                         {candidate.score > 0 && (
                           <Badge className="h-5 px-2 rounded-lg bg-primary text-white border-none font-black text-[8px] tracking-widest uppercase">
                             {candidate.score}%
                           </Badge>
                         )}
                       </div>
                       <div className="flex flex-wrap items-center gap-3 text-muted-foreground/60 font-bold uppercase tracking-widest text-[9px]">
                          <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" />{candidate.position}</span>
                          <span className="h-1 w-1 rounded-full bg-muted-foreground/20" />
                          <span className="flex items-center gap-2"><MapPin className="w-4 h-4" />{candidate.university?.split(' ')[0] || 'Unknown'}</span>
                       </div>
                   </div>
                </div>
             </div>

             {/* Close Button UI */}
             <button 
               onClick={onClose}
               className="absolute top-8 right-8 h-12 w-12 rounded-2xl bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-all duration-300 z-50 shadow-lg hover:rotate-90"
             >
                <X className="w-5 h-5 stroke-[2.5]" />
             </button>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Scrollable Intelligence Feed */}
            <ScrollArea className="flex-1 px-6 md:px-8 py-4">
              <div className="max-w-4xl space-y-10 pb-16">
                
                {/* ── AI Executive Summary ── */}
                <section className="relative p-8 rounded-[2rem] bg-white dark:bg-neutral-900 border border-border/40 shadow-[0_15px_40px_-12px_rgba(0,0,0,0.05)] overflow-hidden group">
                  <div className="absolute -top-10 -right-10 h-40 w-40 opacity-[0.03] rotate-45 group-hover:scale-110 transition-transform duration-700">
                      <Sparkles className="w-full h-full text-primary" />
                  </div>
                  
                  <div className="space-y-8">
                    <div className="flex items-center gap-3">
                       <div className="p-2.5 rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-sm">
                         <Sparkles className="w-5 h-5" />
                       </div>
                       <h3 className="text-sm font-black uppercase tracking-[0.25em] text-primary">Strategic Justification</h3>
                    </div>

                    <div className="space-y-6">
                       <p className="text-xl md:text-2xl font-black text-foreground/90 tracking-tight leading-[1.5] italic pr-6 relative">
                          <span className="absolute -left-5 top-0 text-6xl text-primary/10 select-none">"</span>
                          {candidate.justification || t('pipeline.processing', language)}
                       </p>
                       
                       {candidate.analysis && (
                         <div className="mt-6 pt-6 border-t border-border/10">
                            <h4 className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest mb-3">Deep Dive</h4>
                            <p className="text-base font-medium text-foreground/70 leading-relaxed max-w-2xl border-l-[3px] border-primary/20 pl-6 transition-all hover:border-primary/50 py-1">
                              {candidate.analysis}
                            </p>
                         </div>
                       )}
                    </div>
                  </div>
                </section>

                {/* ── Grid: Info Cards ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-8 rounded-[2.5rem] bg-white dark:bg-neutral-900 border border-border/40 hover:border-primary/20 transition-all duration-500">
                     <div className="flex items-center gap-3 mb-8">
                        <Mail className="w-4 h-4 text-primary" />
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/60">Contact Network</h4>
                     </div>
                     <div className="space-y-5">
                        <div className="flex flex-col">
                           <span className="text-[10px] uppercase font-black text-muted-foreground/40 mb-1">Professional Email</span>
                           <span className="text-base font-bold text-foreground truncate">{candidate.email}</span>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-[10px] uppercase font-black text-muted-foreground/40 mb-1">Direct Line</span>
                           <span className="text-base font-bold text-foreground">{candidate.phone || 'Not provided'}</span>
                        </div>
                     </div>
                  </div>

                  <div className="p-8 rounded-[2.5rem] bg-white dark:bg-neutral-900 border border-border/40 hover:border-primary/20 transition-all duration-500">
                     <div className="flex items-center gap-3 mb-8">
                        <GraduationCap className="w-4 h-4 text-blue-500" />
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/60">Academic Pedigree</h4>
                     </div>
                     <div className="space-y-5">
                        <div className="flex flex-col">
                           <span className="text-[10px] uppercase font-black text-muted-foreground/40 mb-1">Alma Mater</span>
                           <span className="text-base font-black uppercase tracking-tight text-foreground truncate">{candidate.university || 'Not identified'}</span>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-[10px] uppercase font-black text-muted-foreground/40 mb-1">Specialization</span>
                           <span className="text-base font-bold text-foreground truncate">{candidate.major || 'General Studies'}</span>
                        </div>
                     </div>
                  </div>
                </div>

                {/* ── Skills Cloud ── */}
                <section className="space-y-8">
                   <div className="flex items-center justify-between border-b border-border/40 pb-4">
                     <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-3 italic">
                        <Zap className="w-5 h-5 text-amber-500 fill-amber-500/20" />
                        Technical Stack
                     </h3>
                   </div>
                   <div className="flex flex-wrap gap-3">
                      {candidate.skills.map((skill) => (
                        <Badge key={skill} className="px-5 py-2.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-foreground border-none text-[12px] font-black hover:bg-primary hover:text-white transition-all duration-300 shadow-sm cursor-default">
                          {skill}
                        </Badge>
                      ))}
                   </div>
                </section>

                {/* ── Experience Timeline ── */}
                <section className="space-y-12">
                   <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-3 italic">
                      <Database className="w-5 h-5 text-blue-500 fill-blue-500/20" />
                      Professional History
                   </h3>
                   <div className="space-y-10 relative pl-4">
                      <div className="absolute left-4 top-4 bottom-4 w-px bg-gradient-to-b from-primary/40 via-primary/5 to-transparent" />
                      {candidate.experience.map((exp, idx) => (
                        <div key={idx} className="relative pl-12 group/exp">
                           <div className="absolute left-[-4px] top-[4px] h-2 w-2 rounded-full bg-primary shadow-[0_0_15px_rgba(59,130,246,0.5)] group-hover/exp:scale-150 transition-transform" />
                           <div className="space-y-2">
                              <span className="text-[10px] font-black text-primary/60 uppercase tracking-[0.2em]">{exp.company}</span>
                              <h5 className="text-2xl font-black text-foreground tracking-tight group-hover/exp:text-primary transition-colors">{exp.role}</h5>
                              <p className="text-sm font-bold text-muted-foreground/60">{exp.years} {exp.years > 1 ? 'years' : 'year'} of dedicated tenure</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </section>
              </div>
            </ScrollArea>

            {/* Expansive CV Viewer */}
            <AnimatePresence>
              {showCV && cvUrl && (
                <motion.div 
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: '55%', opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="hidden md:flex flex-col bg-neutral-900 border-l border-white/5 relative z-[60]"
                >
                   <div className="absolute top-6 left-6 z-10">
                      <Button variant="ghost" size="sm" onClick={() => setShowCV(false)} className="h-10 px-4 rounded-xl bg-white/10 text-white/60 hover:text-white backdrop-blur-md">
                        <X className="w-4 h-4 mr-2" />
                        Close PDF
                      </Button>
                   </div>
                   <iframe src={cvUrl} className="w-full h-full border-none brightness-[0.9] contrast-[1.1] grayscale-[0.2]" title="CV Document" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Footer - Minimized */}
          <footer className="p-6 md:px-8 border-t border-border/10 bg-white dark:bg-neutral-900 shrink-0 z-50 flex items-center justify-between">
             <div className="flex items-center gap-3">
               <Button 
                 onClick={() => setShowCV(!showCV)}
                 className={cn(
                   "h-12 px-6 rounded-xl gap-2 font-black uppercase text-[11px] tracking-widest transition-all duration-500",
                   showCV ? "bg-primary text-white scale-95 shadow-lg shadow-primary/20" : "bg-neutral-100 dark:bg-neutral-800 text-foreground hover:bg-primary hover:text-white"
                 )}
               >
                 <FileText className="w-4 h-4" />
                 {showCV ? "Exit Fullscreen" : "Review CV"}
               </Button>
               
               {cvUrl && (
                 <a href={cvUrl} target="_blank" rel="noopener noreferrer">
                   <Button variant="ghost" className="h-12 w-12 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/5">
                     <ExternalLink className="w-5 h-5" />
                   </Button>
                 </a>
               )}
             </div>

             <Button 
               onClick={onClose}
               className="h-12 px-8 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-[11px] hover:scale-105 transition-all shadow-xl"
             >
               Done
             </Button>
          </footer>
        </div>
      </SheetContent>
    </Sheet>
  )
}
