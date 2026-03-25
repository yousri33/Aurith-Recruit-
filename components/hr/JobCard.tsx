'use client'

import { Job } from '@/lib/api'
import { Language, t } from '@/lib/i18n'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Calendar, Users, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface JobCardProps {
  job: Job
  language: Language
}

export function JobCard({ job, language }: JobCardProps) {
  const date = new Date(job.created_at).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })

  return (
    <Link href={`/dashboard/jobs/${job.id}`}>
      <motion.div
        whileHover={{ y: -5, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <Card className="group relative overflow-hidden p-8 cursor-pointer bg-white/60 dark:bg-neutral-900/40 backdrop-blur-xl border border-border/50 hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-xl rounded-[2rem] flex flex-col justify-between h-full min-h-[220px]">
          {/* Mesh gradient effect */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-[0.1] transition-opacity duration-700 pointer-events-none bg-cover bg-center" 
            style={{ backgroundImage: `url(https://products.ls.graphics/mesh-gradients/images/03.-Snowy-Mint_1-p-130x130q80.jpeg)` }} 
          />
          
          <div className="relative z-10 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="p-1.5 rounded-lg bg-primary/10 text-primary border border-primary/10 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-3.5 h-3.5" />
                  </span>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80 truncate">
                    AI Pipeline Run
                  </p>
                </div>
                <h3 className="text-xl font-black tracking-tighter text-foreground group-hover:text-primary transition-colors leading-tight">
                  {job.job_title}
                </h3>
              </div>
              
              <div className="h-10 w-10 rounded-full flex items-center justify-center bg-muted/30 border border-border/30 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 items-center pt-2">
              <div className="flex items-center gap-2 text-muted-foreground font-medium">
                <Calendar className="w-3.5 h-3.5" />
                <span className="text-xs">{date}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground font-medium">
                <Users className="w-3.5 h-3.5" />
                <span className="text-xs">{job.total_processed} {language === 'fr' ? 'Candidats' : 'Candidates'}</span>
              </div>
            </div>
            
            <div className="pt-2">
               <Badge 
                variant="secondary" 
                className="bg-emerald-500/10 text-emerald-600 border-emerald-500/10 rounded-md px-3 py-1 text-[10px] font-black uppercase tracking-widest"
              >
                {job.status}
              </Badge>
            </div>
          </div>
        </Card>
      </motion.div>
    </Link>
  )
}
