'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { PageTransition } from '@/components/layout/PageTransition'
import { getStoredLanguage } from '@/lib/i18n'
import { Toaster } from '@/components/ui/sonner'
import { supabase } from '@/lib/supabase'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [language, setLanguage] = useState<'fr' | 'en'>('en')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/login')
        return
      }
      setLanguage(getStoredLanguage())
      setIsLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        router.push('/login')
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  const handleLanguageChange = (newLang: 'fr' | 'en') => {
    setLanguage(newLang)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-border border-t-primary" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background overflow-hidden relative w-full">
      <Sidebar language={language} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="" onLanguageChange={handleLanguageChange} />
        <main className="flex-1 overflow-auto pt-24 md:pt-10 pb-12 md:pb-32 px-4 md:px-8">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
      <Toaster />
    </div>
  )
}
