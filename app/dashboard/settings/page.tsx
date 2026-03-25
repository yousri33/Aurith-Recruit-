'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { t, getStoredLanguage } from '@/lib/i18n'
import { getProfile, updateProfile, uploadAvatar, type Profile } from '@/lib/api'
import { Card } from '@/components/ui/card'
import { 
  User, Lock, Bell, Settings, ShieldCheck, Mail, Building2, 
  ChevronRight, Save, Loader2, CheckCircle2, AlertCircle, Camera 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
  const [language, setLanguage] = useState<'fr' | 'en'>('en')
  const [mounted, setMounted] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [editedProfile, setEditedProfile] = useState({
    full_name: '',
    organization: '',
    email_notifications: true
  })

  useEffect(() => {
    setLanguage(getStoredLanguage())
    loadProfile()
    setMounted(true)
  }, [])

  const loadProfile = async () => {
    const data = await getProfile()
    if (data) {
      setProfile(data)
      setEditedProfile({
        full_name: data.full_name || '',
        organization: data.organization || '',
        email_notifications: data.notification_preferences?.email ?? true
      })
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    const success = await updateProfile({
      full_name: editedProfile.full_name,
      organization: editedProfile.organization,
      notification_preferences: {
        ...profile?.notification_preferences,
        email: editedProfile.email_notifications
      }
    })

    if (success) {
      toast.success(language === 'fr' ? 'Profil mis à jour' : 'Profile updated')
      await loadProfile()
    } else {
      toast.error(language === 'fr' ? 'Erreur lors de la mise à jour' : 'Update failed')
    }
    setIsSaving(false)
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsSaving(true)
    const url = await uploadAvatar(file)
    if (url) {
      toast.success(language === 'fr' ? 'Photo mise à jour' : 'Avatar updated')
      await loadProfile()
    } else {
      toast.error(language === 'fr' ? 'Erreur lors de l\'envoi' : 'Upload failed')
    }
    setIsSaving(false)
  }

  if (!mounted || !profile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 relative">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-sm">
              <Settings className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-foreground uppercase italic leading-none">
              {t('nav.settings', language)}
            </h1>
          </div>
          <p className="text-xs font-bold text-muted-foreground/80 uppercase tracking-widest pl-1 leading-relaxed">
            {language === 'fr' ? 'Préférences de compte' : 'Account preferences'}
          </p>
        </div>

        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="h-11 px-8 rounded-xl gap-2 bg-primary text-primary-foreground font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          {language === 'fr' ? 'Enregistrer' : 'Save Changes'}
        </Button>
      </motion.div>

      {/* Profile Section */}
      <div className="grid grid-cols-1 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="overflow-hidden bg-white/60 dark:bg-neutral-900/40 backdrop-blur-xl border border-border/50 shadow-sm rounded-[1.5rem] p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-primary/10 rounded-xl border border-primary/20 text-primary">
                <User className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-black tracking-tight text-foreground uppercase italic">
                {t('settings.profile', language)}
              </h3>
            </div>

            <div className="flex flex-col md:flex-row gap-10 items-start md:items-center pb-10 mb-10 border-b border-border/10">
              <div className="relative group/avatar">
                <div className="h-28 w-28 rounded-[2rem] bg-primary/10 overflow-hidden border-2 border-primary/20 shadow-xl group-hover/avatar:border-primary/50 transition-all duration-500">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt={profile.full_name || ''} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-primary/40 font-black text-3xl italic">
                      {profile.full_name?.[0]?.toUpperCase() || profile.email?.[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
                <label className="absolute -bottom-2 -right-2 h-10 w-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 active:scale-95 transition-all border-2 border-background z-20">
                  <Camera className="h-4 w-4" />
                  <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                </label>
              </div>

              <div className="space-y-1">
                <h4 className="text-2xl font-black tracking-tight text-foreground uppercase italic">{profile.full_name || 'User'}</h4>
                <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">{profile.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-tight text-emerald-600/80">Active Session</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 opacity-60">
                  <User className="h-3 w-3" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{t('auth.name', language)}</span>
                </div>
                <Input 
                  value={editedProfile.full_name}
                  onChange={(e) => setEditedProfile({ ...editedProfile, full_name: e.target.value })}
                  placeholder="Your Name"
                  className="h-12 bg-white/40 dark:bg-white/5 border-border/40 focus:border-primary/50 transition-all font-medium rounded-xl"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 opacity-60">
                  <Mail className="h-3 w-3" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{t('auth.email', language)}</span>
                </div>
                <div className="h-12 flex items-center px-4 bg-muted/30 border border-border/40 rounded-xl text-sm font-medium text-muted-foreground cursor-not-allowed">
                  {profile.email}
                </div>
                <p className="text-[9px] font-bold text-muted-foreground/50 uppercase ml-1">
                  {language === 'fr' ? "L'email ne peut pas être modifié" : 'Email cannot be changed'}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 opacity-60">
                  <Building2 className="h-3 w-3" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{t('settings.organization', language)}</span>
                </div>
                <Input 
                  value={editedProfile.organization}
                  onChange={(e) => setEditedProfile({ ...editedProfile, organization: e.target.value })}
                  placeholder="Organization"
                  className="h-12 bg-white/40 dark:bg-white/5 border-border/40 focus:border-primary/50 transition-all font-medium rounded-xl"
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Notifications & Security */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full bg-white/60 dark:bg-neutral-900/40 backdrop-blur-xl border border-border/50 shadow-sm rounded-[1.5rem] p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-2.5 bg-primary/10 rounded-xl border border-primary/20 text-primary">
                  <Bell className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-black tracking-tight text-foreground uppercase italic">{t('settings.notifications', language)}</h3>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-primary/5 dark:bg-white/5 rounded-2xl border border-primary/10">
                <div className="space-y-1">
                  <p className="text-sm font-black tracking-tight text-foreground">{language === 'fr' ? 'Email' : 'Email Notifications'}</p>
                  <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                    {language === 'fr' ? 'Alertes de pipeline' : 'Pipeline alerts'}
                  </p>
                </div>
                <button 
                  onClick={() => setEditedProfile({ ...editedProfile, email_notifications: !editedProfile.email_notifications })}
                  className={cn(
                    "w-12 h-6 rounded-full transition-all duration-300 relative",
                    editedProfile.email_notifications ? "bg-primary" : "bg-neutral-300 dark:bg-neutral-700"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300",
                    editedProfile.email_notifications ? "left-7" : "left-1"
                  )} />
                </button>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full bg-white/60 dark:bg-neutral-900/40 backdrop-blur-xl border border-border/50 shadow-sm rounded-[1.5rem] p-6 flex flex-col justify-between">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-600">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-black tracking-tight text-foreground uppercase italic">{language === 'fr' ? 'Sécurité' : 'Security'}</h3>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/60">{language === 'fr' ? 'Protection active' : 'Active Protection'}</p>
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-black uppercase tracking-tight">RLS Verified</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="h-9 px-5 gap-2 rounded-xl border-border/50 hover:bg-primary hover:text-primary-foreground text-[10px] font-black uppercase tracking-widest transition-all">
                  {language === 'fr' ? 'Gérer' : 'Manage'}
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
