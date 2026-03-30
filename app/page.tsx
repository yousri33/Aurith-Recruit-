'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { t, getStoredLanguage, setStoredLanguage } from '@/lib/i18n'
import { supabase } from '@/lib/supabase'
import { Header } from '@/components/ui/header-2'
import { Button } from '@/components/ui/button'
import { DollarSign, TrendingUp, BarChart3, ArrowRight, Instagram, Linkedin, ExternalLink, Check } from 'lucide-react'
import { NoiseBackground } from '@/components/ui/noise-background'
import { LoaderThree } from '@/components/ui/loader'
import { BeamsBackground } from '@/components/ui/beams-background'
import { PricingInteraction } from '@/components/ui/pricing-interaction'

export default function LandingPage() {
  const router = useRouter()
  const [language, setLanguage] = useState<'fr' | 'en'>('en')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const savedLang = getStoredLanguage()
    setLanguage(savedLang)

    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session)
      setMounted(true)
    })
  }, [])

  const handleLanguageChange = (lang: 'fr' | 'en') => {
    setLanguage(lang)
    setStoredLanguage(lang)
  }


  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background">
      <Header 
        language={language} 
        isLoggedIn={isLoggedIn} 
        setLanguage={(lang) => {
          setLanguage(lang);
          setStoredLanguage(lang);
        }} 
      />
      {/* Hero Section */}
      <BeamsBackground 
        title={t('landing.hero_title', language) || 'Aurith Recruit'}
        subtitle={t('landing.hero_subtitle', language) || ''}
      >
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-10">
          {isLoggedIn ? (
              <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
              >
                <NoiseBackground
                  containerClassName="w-fit p-1 rounded-full"
                  gradientColors={["rgb(168, 85, 247)", "rgb(236, 72, 153)", "rgb(59, 130, 246)"]}
                >
                  <Link href="/dashboard">
                    <button className="h-14 min-w-[180px] px-10 rounded-full bg-gradient-to-r from-neutral-50 via-neutral-100 to-white text-black font-black uppercase text-[10px] tracking-[0.25em] shadow-[0px_2px_5px_0px_rgba(255,255,255,0.8)_inset,0px_5px_15px_0px_rgba(0,0,0,0.3)] flex items-center justify-center gap-2 group hover:shadow-[0px_0px_25px_rgba(168,85,247,0.4)]">
                      {language === 'fr' ? 'Accéder à l\'application' : 'Access App'}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                </NoiseBackground>
              </motion.div>
          ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
              >
                <NoiseBackground
                  containerClassName="w-fit p-1 rounded-full"
                  gradientColors={["rgb(168, 85, 247)", "rgb(236, 72, 153)", "rgb(59, 130, 246)"]}
                >
                  <Link href="/login">
                    <button className="h-14 min-w-[180px] px-10 rounded-full bg-gradient-to-r from-neutral-50 via-neutral-100 to-white text-black font-black uppercase text-[10px] tracking-[0.25em] shadow-[0px_2px_5px_0px_rgba(255,255,255,0.8)_inset,0px_5px_15px_0px_rgba(0,0,0,0.3)] flex items-center justify-center gap-2 group hover:shadow-[0px_0px_25px_rgba(168,85,247,0.4)]">
                      {t('landing.cta_button', language)}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                </NoiseBackground>
              </motion.div>
          )}
        </div>
      </BeamsBackground>

      {/* Features Section */}
      <section id="features" className="relative py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl font-black text-foreground tracking-tighter sm:text-5xl">
              {language === 'fr' ? 'Pourquoi Aurith Recruit?' : 'Why Aurith Recruit?'}
            </h2>
            <div className="w-20 h-1.5 bg-primary mx-auto mt-6 rounded-full" />
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="group relative p-8 rounded-[2rem] bg-white/[0.03] dark:bg-white/[0.02] border border-white/10 backdrop-blur-xl transition-all hover:bg-white/[0.06] hover:border-primary/30 hover:-translate-y-2"
            >
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-10 rounded-[2rem] blur-2xl transition-opacity" />
              <div className="relative">
                <div className="mb-6">
                  <DollarSign className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-black text-foreground mb-3 tracking-tight">
                  {t('landing.feature1_title', language)}
                </h3>
                <p className="text-muted-foreground/80 text-sm leading-relaxed">
                  {t('landing.feature1_desc', language)}
                </p>
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="group relative p-8 rounded-[2rem] bg-white/[0.03] dark:bg-white/[0.02] border border-white/10 backdrop-blur-xl transition-all hover:bg-white/[0.06] hover:border-primary/30 hover:-translate-y-2"
            >
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-10 rounded-[2rem] blur-2xl transition-opacity" />
              <div className="relative">
                <div className="mb-6">
                  <TrendingUp className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-black text-foreground mb-3 tracking-tight">
                  {t('landing.feature2_title', language)}
                </h3>
                <p className="text-muted-foreground/80 text-sm leading-relaxed">
                  {t('landing.feature2_desc', language)}
                </p>
              </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="group relative p-8 rounded-[2rem] bg-white/[0.03] dark:bg-white/[0.02] border border-white/10 backdrop-blur-xl transition-all hover:bg-white/[0.06] hover:border-primary/30 hover:-translate-y-2"
            >
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-10 rounded-[2rem] blur-2xl transition-opacity" />
              <div className="relative">
                <div className="mb-6">
                  <BarChart3 className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-black text-foreground mb-3 tracking-tight">
                  {t('landing.feature3_title', language)}
                </h3>
                <p className="text-muted-foreground/80 text-sm leading-relaxed">
                  {t('landing.feature3_desc', language)}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-40 px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.01 }}
            viewport={{ once: true }}
            className="group relative p-12 sm:p-24 rounded-[4rem] bg-white/[0.03] dark:bg-white/[0.02] border border-white/10 backdrop-blur-[100px] overflow-hidden transition-all duration-700 hover:bg-white/[0.05] hover:border-primary/40 shadow-2xl shadow-black/40"
          >
            {/* Dynamic Interactive Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            
            {/* Multi-layered animated light orbs */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 blur-[120px] rounded-full animate-pulse transition-transform duration-1000 group-hover:scale-150" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/10 blur-[120px] rounded-full animate-pulse delay-700 transition-transform duration-1000 group-hover:scale-150" />

            <div className="max-w-3xl mx-auto text-center relative z-10 px-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              >
                <h3 className="text-5xl sm:text-7xl font-black text-foreground mb-10 tracking-tighter leading-[1.05] filter drop-shadow-sm">
                  {language === 'fr'
                    ? 'Prêt à transformer votre recrutement?'
                    : 'Ready to transform your hiring?'}
                </h3>
              </motion.div>
              
              <p className="text-xl sm:text-2xl text-muted-foreground/80 mb-14 font-medium max-w-2xl mx-auto leading-relaxed tracking-tight">
                {language === 'fr'
                  ? 'Rejoignez les équipes qui utilisent l\'IA pour embaucher plus vite et plus intelligemment.'
                  : 'Join teams using AI to hire faster, smarter, and with complete confidence.'}
              </p>

              {/* Forcing visibility for verification */}
              <div className="flex justify-center mt-12">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <NoiseBackground
                      containerClassName="w-fit p-1 rounded-full mx-auto"
                      gradientColors={[
                        "rgb(168, 85, 247)",
                        "rgb(236, 72, 153)",
                        "rgb(59, 130, 246)",
                      ]}
                    >
                      <Link href="/login" className="w-full">
                        <button className="h-14 min-w-[200px] w-full cursor-pointer rounded-full bg-gradient-to-r from-neutral-50 via-neutral-100 to-white px-10 py-2 text-black shadow-[0px_2px_5px_0px_rgba(255,255,255,0.8)_inset,0px_5px_15px_0px_rgba(0,0,0,0.3)] transition-all duration-300 active:scale-95 dark:from-white dark:via-neutral-200 dark:to-neutral-400 dark:text-black font-black uppercase text-[10px] tracking-[0.25em] hover:shadow-[0px_0px_25px_rgba(168,85,247,0.4)] flex items-center justify-center">
                          {t('landing.cta_button', language)} &rarr;
                        </button>
                      </Link>
                    </NoiseBackground>
                  </motion.div>
                </div>
            </div>

            {/* Subtle Gradient Border Overlay */}
            <div className="absolute inset-0 border border-white/5 rounded-[4rem] pointer-events-none" />
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-8 relative overflow-hidden bg-neutral-50/50 dark:bg-black/20">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-16">
            <div className="text-center">
                <h2 className="text-4xl sm:text-7xl font-black text-neutral-900 dark:text-white mb-6 tracking-tighter uppercase"> Pricing <span className="text-primary">& Plans</span></h2>
                <p className="text-xl text-neutral-500 max-w-2xl mx-auto leading-relaxed font-medium">
                    Choose the perfect path for your recruitment team. Start for free or get a custom-built system tailored to your specific needs.
                </p>
            </div>
            
            <PricingInteraction />
        </div>
      </section>

      {/* Footer */}
      <footer className="footer sm:footer-horizontal bg-background text-neutral-900 dark:text-neutral-200 p-16 md:p-24 border-t border-neutral-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-24">
          <aside className="space-y-6">
            <svg
              width="50"
              height="50"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              fillRule="evenodd"
              clipRule="evenodd"
              className="fill-primary drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]">
              <path
                d="M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z"></path>
            </svg>
            <div className="space-y-2">
              <p className="text-2xl font-black tracking-tighter text-foreground uppercase italic">
                {language === 'fr' ? 'Aurith Recruit' : 'Aurith Recruit'}
              </p>
              <p className="text-sm font-bold text-muted-foreground/60 uppercase tracking-widest leading-relaxed">
                {language === 'fr' 
                  ? 'Recrutement IA haute performance\nPropulsé par des agents autonomes' 
                  : 'High-performance AI Recruitment\nPowered by autonomous agents'}
                <br />
                © 2026 Aurith Recruit
              </p>
              <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-white/5">
                <a 
                  href="https://aurith-dz.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 hover:text-primary transition-all"
                >
                  Built by Aurith AI
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
                <p className="text-[9px] font-bold text-muted-foreground/30 mt-1 uppercase tracking-widest">Autonomous Systems for Innovative Clients</p>
              </div>
            </div>
          </aside>
          
          <nav className="flex flex-col gap-4">
            <h6 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Links</h6>
            <div className="flex flex-col gap-3">
              <Link href="#features" className="text-muted-foreground hover:text-primary transition-colors font-bold uppercase text-[11px] tracking-widest">{language === 'fr' ? 'Fonctionnalités' : 'Features'}</Link>
              <Link href="/login" className="text-muted-foreground hover:text-primary transition-colors font-bold uppercase text-[11px] tracking-widest">{t('auth.login', language)}</Link>
              <Link href="/register" className="text-muted-foreground hover:text-primary transition-colors font-bold uppercase text-[11px] tracking-widest">{t('auth.sign_up', language)}</Link>
            </div>
          </nav>

          <nav className="flex flex-col gap-6">
            <h6 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Connectivity</h6>
            <div className="flex items-center gap-6">
              <a href="#" className="text-muted-foreground hover:text-primary transition-all hover:scale-110 cursor-pointer">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-all hover:scale-110 cursor-pointer">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-all hover:scale-110 cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  className="fill-current">
                  <path
                    d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                </svg>
              </a>
            </div>
          </nav>
        </div>
      </footer>
    </div>
  )
}
