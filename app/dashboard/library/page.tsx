'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { t, getStoredLanguage } from '@/lib/i18n'
import { getFolders, createFolder, deleteFolder, type Folder } from '@/lib/api'
import { FolderCard } from '@/components/hr/FolderCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, FolderOpen, X } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LibraryPage() {
  const router = useRouter()
  const [language, setLanguage] = useState<'fr' | 'en'>('en')
  const [mounted, setMounted] = useState(false)
  const [folders, setFolders] = useState<Folder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newJobTitle, setNewJobTitle] = useState('')
  const [creating, setCreating] = useState(false)

  const loadFolders = useCallback(async () => {
    setIsLoading(true)
    const data = await getFolders()
    setFolders(data)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/login'); return }
      setLanguage(getStoredLanguage())
      setMounted(true)
      loadFolders()
    })
  }, [router, loadFolders])

  if (!mounted) return null

  const handleDelete = async (id: string) => {
    const ok = await deleteFolder(id)
    if (ok) {
      setFolders((prev) => prev.filter((f) => f.id !== id))
      toast.success(language === 'fr' ? 'Dossier supprimé' : 'Folder deleted')
    } else {
      toast.error(language === 'fr' ? 'Erreur lors de la suppression' : 'Failed to delete')
    }
  }

  const handleCreate = async () => {
    if (!newName.trim() || !newJobTitle.trim()) {
      toast.error(t('common.error', language))
      return
    }
    setCreating(true)
    const folder = await createFolder(newName.trim(), newJobTitle.trim())
    if (folder) {
      setFolders((prev) => [folder, ...prev])
      toast.success(language === 'fr' ? 'Dossier créé !' : 'Folder created!')
      setNewName('')
      setNewJobTitle('')
      setShowCreate(false)
    } else {
      toast.error(t('common.error', language))
    }
    setCreating(false)
  }

  return (
    <div className="py-6 md:p-10 max-w-6xl mx-auto space-y-8 md:space-y-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-sm transition-transform hover:rotate-6">
              <FolderOpen className="h-7 w-7" />
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-foreground uppercase italic leading-none">
              {t('library.title', language)}
            </h1>
          </div>
          <p className="text-xs md:text-sm font-bold text-muted-foreground/60 uppercase tracking-[0.2em] pl-1 leading-relaxed">
            {language === 'fr' ? 'Organisez vos CV en dossiers par campagne' : 'Organize your CVs into folders by campaign'}
          </p>
        </div>
        <Button
          className="gap-2 rounded-xl px-6 h-11 shadow-sm transition-all hover:shadow-xl hover:scale-[1.02] bg-primary text-primary-foreground border-none"
          onClick={() => setShowCreate(true)}
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span className="font-black uppercase tracking-widest text-[11px]">{t('library.create_folder', language)}</span>
        </Button>
      </motion.div>

      {/* Create Folder Modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setShowCreate(false) }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white dark:bg-neutral-900 rounded-[1.5rem] p-8 w-full max-w-md shadow-2xl border border-border/50"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black uppercase tracking-tight text-foreground">
                  {language === 'fr' ? 'Nouveau dossier' : 'New Folder'}
                </h2>
                <button onClick={() => setShowCreate(false)} className="h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-destructive hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 block">
                    {language === 'fr' ? 'Nom du dossier' : 'Folder Name'}
                  </label>
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder={language === 'fr' ? 'Ex: Ingénieurs Backend' : 'Ex: Backend Engineers'}
                    className="h-11 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 block">
                    {language === 'fr' ? 'Titre du poste' : 'Job Title'}
                  </label>
                  <Input
                    value={newJobTitle}
                    onChange={(e) => setNewJobTitle(e.target.value)}
                    placeholder={language === 'fr' ? 'Ex: Senior Backend Engineer' : 'Ex: Senior Backend Engineer'}
                    className="h-11 rounded-xl"
                    onKeyDown={(e) => { if (e.key === 'Enter') handleCreate() }}
                  />
                </div>
                <Button onClick={handleCreate} disabled={creating} className="w-full h-11 rounded-xl font-black uppercase tracking-widest text-[11px] bg-primary">
                  {creating ? (language === 'fr' ? 'Création...' : 'Creating...') : (language === 'fr' ? 'Créer le dossier' : 'Create Folder')}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Folders Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-border border-t-primary" />
        </div>
      ) : folders.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 space-y-4">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary">
            <FolderOpen className="h-8 w-8" />
          </div>
          <p className="text-lg font-black text-foreground/60 uppercase tracking-widest">
            {language === 'fr' ? 'Aucun dossier' : 'No folders yet'}
          </p>
          <p className="text-sm text-muted-foreground">
            {language === 'fr' ? 'Créez votre premier dossier pour commencer' : 'Create your first folder to get started'}
          </p>
          <Button className="gap-2 rounded-xl px-6 h-11 bg-primary mt-4" onClick={() => setShowCreate(true)}>
            <Plus className="w-4 h-4" />
            {language === 'fr' ? 'Créer un dossier' : 'Create a folder'}
          </Button>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
          {folders.map((folder, index) => (
            <motion.div key={folder.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.05 }}>
              <FolderCard folder={folder} language={language} onDelete={handleDelete} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
