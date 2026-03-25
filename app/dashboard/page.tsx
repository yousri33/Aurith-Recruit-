'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { t, getStoredLanguage } from '@/lib/i18n'
import { getDashboardMetrics, getRecentActivity, getFolders, type ActivityItem } from '@/lib/api'
import { MetricCard } from '@/components/hr/MetricCard'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import {
  FolderOpen,
  Users,
  TrendingUp,
  Zap,
  ArrowRight,
  CheckCircle2,
  Upload,
  FolderPlus,
} from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const [language, setLanguage] = useState<'fr' | 'en'>('en')
  const [mounted, setMounted] = useState(false)
  const [metrics, setMetrics] = useState({ totalFolders: 0, totalCandidates: 0, averageScore: 0, completedPipelines: 0 })
  const [activityList, setActivityList] = useState<ActivityItem[]>([])
  const [userName, setUserName] = useState('User')

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/login'); return }
      const lang = getStoredLanguage()
      setLanguage(lang)

      supabase.from('profiles').select('full_name').eq('id', user.id).single().then(({ data }) => {
        if (data?.full_name) setUserName(data.full_name.split(' ')[0])
      })

      Promise.all([getDashboardMetrics(), getRecentActivity(5)]).then(([m, activity]) => {
        setMetrics(m)
        setActivityList(activity)
        setMounted(true)
      })
    })
  }, [router])

  if (!mounted) return null

  const getActivityIcon = (type: string) => {
    if (type === 'pipeline_completed') return <CheckCircle2 className="h-4 w-4 text-emerald-500" />
    if (type === 'cv_uploaded') return <Upload className="h-4 w-4 text-blue-500" />
    return <FolderPlus className="h-4 w-4 text-primary" />
  }

  const getActivityLabel = (item: ActivityItem) => {
    if (item.type === 'pipeline_completed') return language === 'fr' ? `Analyse terminée • ${item.folder_name}` : `Analysis completed • ${item.folder_name}`
    if (item.type === 'cv_uploaded') return language === 'fr' ? `${item.count ?? ''} CV ajoutés • ${item.folder_name}` : `${item.count ?? ''} CVs uploaded • ${item.folder_name}`
    if (item.type === 'folder_deleted') return language === 'fr' ? `Dossier supprimé • ${item.folder_name}` : `Folder deleted • ${item.folder_name}`
    return language === 'fr' ? `Nouveau dossier créé • ${item.folder_name}` : `New folder created • ${item.folder_name}`
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { month: 'short', day: 'numeric' })

  return (
    <div className="p-4 md:p-10 max-w-6xl mx-auto space-y-8 md:space-y-12 relative">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end md:justify-between items-center text-center md:text-left gap-6 md:gap-6"
      >
        <div className="space-y-3 flex flex-col items-center md:items-start">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-sm transition-transform hover:rotate-6">
              <TrendingUp className="h-7 w-7" />
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-foreground uppercase italic leading-none">
              {t('dashboard.welcome', language, { name: userName })}
            </h1>
          </div>
          <p className="text-xs md:text-sm font-bold text-muted-foreground/60 uppercase tracking-[0.2em] pl-1 leading-relaxed">
            {language === 'fr' ? 'Gérez vos candidats et lancez des analyses IA' : 'Manage your candidates and run AI analysis'}
          </p>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
        {[
          { title: t('dashboard.folders', language), value: metrics.totalFolders, icon: <FolderOpen className="h-6 w-6" />, desc: language === 'fr' ? 'Campagnes' : 'Campaigns', trend: undefined },
          { title: t('dashboard.candidates', language), value: metrics.totalCandidates, icon: <Users className="h-6 w-6" />, desc: language === 'fr' ? 'Tous dossiers' : 'All folders', trend: undefined },
          { title: t('dashboard.avg_score', language), value: metrics.averageScore, icon: <TrendingUp className="h-6 w-6" />, desc: language === 'fr' ? 'Score IA' : 'AI Score', trend: undefined, total: 100 },
          { title: t('dashboard.pipelines', language), value: metrics.completedPipelines, icon: <Zap className="h-6 w-6" />, desc: language === 'fr' ? 'Analyses' : 'Analyses', trend: undefined },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <MetricCard title={stat.title} value={stat.value} icon={stat.icon} description={stat.desc} total={stat.total} />
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 lg:gap-5 lg:grid-cols-2">
        {[{
          title: language === 'fr' ? 'Gérer vos CV' : 'Manage Your CVs',
          desc: language === 'fr' ? 'Organisez vos candidats en dossiers par campagne' : 'Organize your candidates into folders',
          icon: <FolderOpen className="h-6 w-6" />,
          href: "/dashboard/library",
          btn: t('library.title', language),
          gradient: "url(https://products.ls.graphics/mesh-gradients/images/03.-Snowy-Mint_1-p-130x130q80.jpeg)"
        }, {
          title: language === 'fr' ? 'Lancer une analyse' : 'Run Analysis',
          desc: language === 'fr' ? "Analyse et classement automatique par l'IA" : 'AI-powered automatic candidate ranking',
          icon: <Zap className="h-6 w-6" />,
          href: "/dashboard/pipeline",
          btn: t('pipeline.title', language),
          gradient: "url(https://products.ls.graphics/mesh-gradients/images/15.-Perfume_1-p-130x130q80.jpeg)"
        }].map((action, i) => (
          <motion.div key={i} whileHover={{ y: -4, scale: 1.01 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }} initial={{ opacity: 0, x: i === 0 ? -20 : 20 }} animate={{ opacity: 1, x: 0 }}>
            <Card className="group overflow-hidden bg-white/60 dark:bg-neutral-900/40 backdrop-blur-xl border border-border/50 hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-xl rounded-[1.5rem] p-4 md:p-6 relative flex items-center min-h-[110px] md:h-[140px]">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.08] transition-opacity duration-500 pointer-events-none bg-cover bg-center rounded-[1.5rem]" style={{ backgroundImage: action.gradient }} />
              <div className="flex items-center gap-4 md:gap-5 relative z-10 w-full">
                <div className="p-2 md:p-3 bg-primary/10 rounded-xl border border-primary/20 text-primary group-hover:text-primary-foreground group-hover:bg-primary transition-all duration-300 shadow-sm flex-shrink-0">
                  {action.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-sm md:text-lg tracking-tight text-foreground truncate">{action.title}</h3>
                  <p className="mb-2 md:mb-4 mt-1 text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest truncate">{action.desc}</p>
                  <Link href={action.href}>
                    <Button variant="outline" size="sm" className="h-8 md:h-9 px-4 md:px-5 gap-2 rounded-xl bg-background/50 backdrop-blur-md border-border/50 hover:bg-primary hover:text-primary-foreground text-[9px] md:text-[11px] font-black uppercase tracking-widest shadow-sm transition-all">
                      {action.btn}
                      <ArrowRight className="h-3 w-3 opacity-70 group-hover:translate-x-0.5 transition-all" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card className="overflow-hidden bg-white/60 dark:bg-neutral-900/40 backdrop-blur-xl border border-border/50 shadow-sm rounded-[1.5rem] relative">
          <div className="border-b border-border/40 px-4 md:px-6 py-4 flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/10">
              <Users className="h-4 w-4" />
            </div>
            <h3 className="font-black text-[13px] text-foreground uppercase tracking-widest">{t('dashboard.recent_activity', language)}</h3>
          </div>
          <div className="divide-y divide-border/40">
            {activityList.length === 0 ? (
              <div className="px-6 py-10 text-center text-muted-foreground text-sm font-medium">
                {language === 'fr' ? 'Aucune activité récente' : 'No recent activity yet'}
              </div>
            ) : activityList.map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.05 }} className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.02] group cursor-default">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-background ring-4 ring-transparent group-hover:ring-primary/5 shadow-sm border border-border/50 text-muted-foreground group-hover:border-primary/40 group-hover:shadow-md transition-all duration-300">
                  {getActivityIcon(item.type)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black text-foreground/90 group-hover:text-primary transition-colors tracking-tight">{getActivityLabel(item)}</p>
                  {item.type === 'pipeline_completed' && item.score !== null ? (
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{language === 'fr' ? 'Meilleur score' : 'Top score'}</span>
                      <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/10">{item.score} / 100</span>
                    </div>
                  ) : (
                    <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 italic">{language === 'fr' ? 'Enregistré avec succès' : 'Successfully recorded'}</p>
                  )}
                </div>
                <div className="flex-shrink-0 flex flex-col items-end gap-1">
                  <span className="text-[10px] font-black text-muted-foreground/80 bg-background/50 px-2 py-1 rounded-lg border border-border/50 shadow-sm uppercase tracking-tighter">{formatDate(item.created_at)}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
