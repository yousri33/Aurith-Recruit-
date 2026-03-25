'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Folder as FolderType } from '@/lib/api'
import { Language, t } from '@/lib/i18n'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FolderOpen, Trash2, FileText, ChevronRight, MoreVertical, Minus } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface FolderCardProps {
  folder: FolderType
  language: Language
  onDelete?: (folderId: string) => void
}

export function FolderCard({ folder, language, onDelete }: FolderCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (window.confirm(t('library.delete_folder', language))) {
      setIsDeleting(true)
      try {
        onDelete?.(folder.id)
        toast.success(t('common.success', language))
      } catch (error) {
        toast.error(t('common.error', language))
      } finally {
        setIsDeleting(false)
      }
    }
  }

  // To match the new "Mesh Gradient" aesthetic
  const meshGradientSrc = "https://products.ls.graphics/mesh-gradients/images/03.-Snowy-Mint_1-p-130x130q80.jpeg"

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.015 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className="h-full"
    >
      <Card className={cn(
        "relative overflow-hidden flex flex-col p-5 md:p-7 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl rounded-[1.5rem] md:rounded-[2rem] group h-full min-h-[180px] md:min-h-[220px]",
        "bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md", // Glassmorphism
        "border border-border/50 hover:border-primary/40"
      )}>
        {/* Colorful Mesh Gradient layer on hover */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-[0.08] dark:group-hover:opacity-[0.15] transition-opacity duration-500 pointer-events-none bg-cover bg-center"
          style={{ backgroundImage: `url(${meshGradientSrc})` }}
        />
        
        {/* Content */}
        <div className="z-10 flex flex-col h-full justify-between gap-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 rounded-xl border border-primary/20 text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-md transition-all duration-300">
                <FolderOpen className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0 pr-2 md:pr-4">
                <h3 className="font-black text-[15px] md:text-[16px] tracking-tight text-foreground truncate">{folder.name}</h3>
                <p className="text-[11px] md:text-[12px] font-black uppercase tracking-widest text-muted-foreground/50 truncate">{folder.job_title}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete()
                }}
                className="h-8 w-8 rounded-lg bg-red-100 dark:bg-red-950/30 flex items-center justify-center border border-red-200 dark:border-red-900/50 hover:bg-red-500 hover:text-white transition-all shadow-sm group/delete"
              >
                <Minus className="w-4 h-4 text-red-600 group-hover/delete:text-white stroke-[4]" />
              </button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground -mr-2 rounded-full transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 border-border/50 shadow-lg rounded-xl dark:bg-neutral-800/90 backdrop-blur-md">
                  <DropdownMenuItem asChild className="rounded-md font-medium">
                    <Link href={`/dashboard/library/${folder.id}`} className="cursor-pointer text-[13px]">
                      {t('library.view_candidates', language)}
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="mt-auto pt-6 md:pt-8 flex items-end justify-between border-t border-border/10">
            <div className="flex items-center gap-12">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40">
                  {language === 'fr' ? 'Candidats' : 'Candidates'}
                </span>
                <span className="text-2xl md:text-[32px] font-black tracking-tighter tabular-nums leading-none text-foreground group-hover:text-primary transition-colors duration-300">
                  {folder.cv_count}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40">
                  {language === 'fr' ? 'Créé' : 'Created'}
                </span>
                <span className="text-[14px] md:text-[16px] font-black text-foreground/80 leading-none py-[2px] tracking-tight uppercase">
                  {new Date(folder.created_at).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
            
            <Link href={`/dashboard/library/${folder.id}`}>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-black/5 dark:bg-white/5 text-foreground hover:bg-primary hover:text-primary-foreground shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1">
                <ChevronRight className="w-4 h-4 ml-0.5" />
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
