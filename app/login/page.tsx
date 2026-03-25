'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { t, setStoredLanguage, getStoredLanguage } from '@/lib/i18n'
import { loginUser, registerUser } from '@/lib/api'
import { toast } from 'sonner'
import { IconBrandGoogle } from '@tabler/icons-react'
import { Eye, EyeOff } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { BeamsBackground } from '@/components/ui/beams-background'

// ─── Reusable sub-components ─────────────────────────────
const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
  </>
)

const FieldLabel = ({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) => (
  <label htmlFor={htmlFor} className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
    {children}
  </label>
)

const AuthInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'h-10 w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800/50 px-4 text-sm font-medium text-neutral-900 dark:text-white shadow-sm placeholder:text-neutral-400 outline-none transition-all duration-300',
        'focus:border-primary focus:ring-4 focus:ring-primary/10',
        className
      )}
      {...props}
    />
  )
)
AuthInput.displayName = 'AuthInput'

// ─── Main Page ────────────────────────────────────────────
export default function AuthPage() {
  const router = useRouter()
  const [language, setLanguage] = useState<'fr' | 'en'>(getStoredLanguage())
  const [tab, setTab] = useState<'signin' | 'signup'>('signin')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Sign in state
  const [signIn, setSignIn] = useState({ email: '', password: '' })

  // Sign up state
  const [signUp, setSignUp] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
  })

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!signIn.email || !signIn.password) { toast.error(t('common.error', language)); return }
    setIsLoading(true)
    const result = await loginUser(signIn.email, signIn.password)
    if (result.success) {
      setStoredLanguage(language)
      toast.success(t('common.success', language))
      router.push('/dashboard')
    } else {
      toast.error(result.error || t('common.error', language))
    }
    setIsLoading(false)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!signUp.firstName || !signUp.email || !signUp.password) { toast.error(t('common.error', language)); return }
    if (signUp.password !== signUp.confirmPassword) {
      toast.error(language === 'fr' ? 'Les mots de passe ne correspondent pas' : 'Passwords do not match')
      return
    }
    setIsLoading(true)
    const fullName = `${signUp.firstName} ${signUp.lastName}`.trim()
    const result = await registerUser(fullName, signUp.email, signUp.password)
    if (result.success) {
      setStoredLanguage(language)
      if (result.needsConfirmation) {
        // Email confirmation required
        toast.success(
          language === 'fr'
            ? '✅ Compte créé ! Vérifiez votre email pour confirmer.'
            : '✅ Account created! Check your email to confirm.',
          { duration: 6000 }
        )
        setTab('signin')
        setSignIn({ email: signUp.email, password: '' })
      } else {
        toast.success(language === 'fr' ? 'Compte créé !' : 'Account created!')
        router.push('/dashboard')
      }
    } else {
      toast.error(result.error || t('common.error', language))
    }
    setIsLoading(false)
  }

  const handleOAuth = async (provider: 'google') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
        queryParams: provider === 'google' ? { prompt: 'select_account' } : undefined,
      },
    })
  }

  return (
    <BeamsBackground className="h-[100dvh] overflow-hidden bg-white py-10">

      {/* Back Button */}
      <Link 
        href="/" 
        className="fixed top-6 left-6 z-50 flex items-center gap-2 group/back px-4 py-2 rounded-full border border-neutral-200/50 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-xl shadow-sm transition-all hover:bg-white hover:shadow-md active:scale-95"
      >
        <motion.div
          animate={{ x: [0, -2, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        >
          <svg className="h-3.5 w-3.5 text-neutral-600 dark:text-neutral-400 group-hover/back:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.div>
        <span className="text-[10px] font-black uppercase tracking-widest text-neutral-600 dark:text-neutral-400 group-hover/back:text-primary transition-colors">
          {language === 'fr' ? 'Retour' : 'Home'}
        </span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md -mt-16 md:-mt-32"
      >
        {/* Logo */}
        <div className="mb-10 flex justify-center">
          <Link href="/" className="flex items-center gap-3 group transition-all">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-primary group-hover:drop-shadow-[0_0_12px_rgba(var(--primary-rgb),0.6)] transition-all">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <div className="flex items-baseline gap-1.5">
              <span className="font-black text-xl tracking-[0.2em] uppercase text-neutral-900 dark:text-white transition-opacity">Aurith</span>
              <span className="font-light text-sm tracking-[0.1em] uppercase text-neutral-500 dark:text-white/40 transition-opacity">Recruit</span>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-3xl bg-white/70 dark:bg-neutral-900/70 backdrop-blur-2xl border border-white/50 dark:border-neutral-800 p-5 md:p-7 shadow-2xl shadow-neutral-200/40 dark:shadow-black/20 ring-1 ring-black/5 dark:ring-white/5">

          {/* Tab toggle */}
          <div className="flex items-center gap-1 bg-neutral-100/50 dark:bg-neutral-800/50 p-1.5 rounded-2xl mb-4 relative">
            {(['signin', 'signup'] as const).map((t_) => (
              <button
                key={t_}
                onClick={() => { setTab(t_); setShowPassword(false) }}
                className={cn(
                  'flex-1 relative z-20 h-10 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300',
                  tab === t_
                    ? 'text-primary'
                    : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200'
                )}
              >
                {t_ === 'signin'
                  ? (language === 'fr' ? 'Connexion' : 'Sign In')
                  : (language === 'fr' ? 'Inscription' : 'Sign Up')}
                {tab === t_ && (
                  <motion.div
                    layoutId="auth-tab"
                    className="absolute inset-0 bg-white dark:bg-neutral-700 rounded-xl shadow-sm z-[-1] border border-neutral-200 dark:border-neutral-600"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {tab === 'signin' ? (
              <motion.div key="signin" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }}>
                <h2 className="text-2xl font-black text-neutral-900 tracking-tight mb-1">
                  {language === 'fr' ? 'Bon retour 👋' : 'Welcome back 👋'}
                </h2>
                <p className="text-sm text-neutral-500 mb-7">
                  {language === 'fr' ? 'Accédez à vos campagnes de recrutement' : 'Access your recruitment campaigns'}
                </p>

                <form className="space-y-3" onSubmit={handleSignIn}>
                  <div className="flex flex-col space-y-1.5">
                    <FieldLabel htmlFor="si-email">{t('auth.email', language)}</FieldLabel>
                    <AuthInput id="si-email" type="email" placeholder="you@company.com" value={signIn.email} onChange={(e) => setSignIn({ ...signIn, email: e.target.value })} required />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <FieldLabel htmlFor="si-password">{t('auth.password', language)}</FieldLabel>
                    <div className="relative">
                      <AuthInput id="si-password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={signIn.password} onChange={(e) => setSignIn({ ...signIn, password: e.target.value })} className="pr-11" required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <button type="submit" disabled={isLoading} className="group/btn relative mt-2 flex h-12 w-full items-center justify-center rounded-2xl bg-primary font-black text-[11px] uppercase tracking-widest text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60">
                    {isLoading ? <span className="flex items-center gap-2"><span className="h-4 w-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />{language === 'fr' ? 'Connexion...' : 'Signing in...'}</span> : <>{language === 'fr' ? 'Se connecter' : 'Sign in'} →</>}
                    <BottomGradient />
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div key="signup" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                <h2 className="text-2xl font-black text-neutral-900 tracking-tight mb-1">
                  {language === 'fr' ? 'Créez votre compte' : 'Create your account'}
                </h2>
                <p className="text-sm text-neutral-500 mb-7">
                  {language === 'fr' ? 'Démarrez votre recrutement IA gratuitement' : 'Start AI-powered recruiting for free'}
                </p>

                <form className="space-y-3" onSubmit={handleSignUp}>
                  <div className="flex gap-3">
                    <div className="flex flex-col space-y-1.5 flex-1">
                      <FieldLabel htmlFor="su-first">{language === 'fr' ? 'Prénom' : 'First name'}</FieldLabel>
                      <AuthInput id="su-first" type="text" placeholder={language === 'fr' ? 'Marie' : 'John'} value={signUp.firstName} onChange={(e) => setSignUp({ ...signUp, firstName: e.target.value })} required />
                    </div>
                    <div className="flex flex-col space-y-1.5 flex-1">
                      <FieldLabel htmlFor="su-last">{language === 'fr' ? 'Nom' : 'Last name'}</FieldLabel>
                      <AuthInput id="su-last" type="text" placeholder={language === 'fr' ? 'Dupont' : 'Doe'} value={signUp.lastName} onChange={(e) => setSignUp({ ...signUp, lastName: e.target.value })} />
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <FieldLabel htmlFor="su-email">{t('auth.email', language)}</FieldLabel>
                    <AuthInput id="su-email" type="email" placeholder="you@company.com" value={signUp.email} onChange={(e) => setSignUp({ ...signUp, email: e.target.value })} required />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <FieldLabel htmlFor="su-password">{t('auth.password', language)}</FieldLabel>
                    <div className="relative">
                      <AuthInput id="su-password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={signUp.password} onChange={(e) => setSignUp({ ...signUp, password: e.target.value })} className="pr-11" required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <FieldLabel htmlFor="su-confirm">{t('auth.confirm_password', language)}</FieldLabel>
                    <AuthInput id="su-confirm" type="password" placeholder="••••••••" value={signUp.confirmPassword} onChange={(e) => setSignUp({ ...signUp, confirmPassword: e.target.value })} required />
                  </div>
                  <button type="submit" disabled={isLoading} className="group/btn relative mt-2 flex h-12 w-full items-center justify-center rounded-2xl bg-primary font-black text-[11px] uppercase tracking-widest text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60">
                    {isLoading ? <span className="flex items-center gap-2"><span className="h-4 w-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />{language === 'fr' ? 'Création...' : 'Creating...'}</span> : <>{language === 'fr' ? 'Créer mon compte' : 'Create account'} →</>}
                    <BottomGradient />
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Divider */}
          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-neutral-200/50 dark:border-neutral-800/50"></div>
            <span className="flex-shrink mx-4 text-[9px] font-black uppercase tracking-[0.25em] text-neutral-400">
              {language === 'fr' ? 'ou' : 'or'}
            </span>
            <div className="flex-grow border-t border-neutral-200/50 dark:border-neutral-800/50"></div>
          </div>

          <div className="flex gap-2.5">
            {[
              { icon: <IconBrandGoogle className="h-3.5 w-3.5" />, label: 'Google', provider: 'google' as const },
            ].map(({ icon, label, provider }) => (
              <button
                key={provider}
                type="button"
                onClick={() => handleOAuth(provider)}
                className="group/btn relative flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/30 px-3 text-[9px] font-black uppercase tracking-widest text-neutral-600 dark:text-neutral-400 transition-all hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white hover:border-neutral-300 dark:hover:border-neutral-700 active:scale-95"
              >
                <span className="text-neutral-500 group-hover/btn:text-neutral-900 dark:group-hover/btn:text-white transition-colors">{icon}</span>
                <span>{label}</span>
                <BottomGradient />
              </button>
            ))}
          </div>
        </div>

        {/* Language toggle */}
        <div className="mt-5 flex justify-center gap-2">
          {(['en', 'fr'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => { setLanguage(lang); setStoredLanguage(lang) }}
              className={cn(
                'h-7 w-10 rounded-md text-[10px] font-black uppercase tracking-widest transition-all',
                language === lang
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'bg-neutral-100 text-neutral-400 hover:bg-neutral-200 hover:text-neutral-700'
              )}
            >
              {lang}
            </button>
          ))}
        </div>
      </motion.div>
    </BeamsBackground>
  )
}
