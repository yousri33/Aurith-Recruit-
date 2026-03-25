'use client'

import { useState } from 'react'
import { Language, t } from '@/lib/i18n'
import { Folder } from '@/lib/mockData'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { motion, AnimatePresence, Variants } from 'framer-motion'

interface StepFormProps {
  folders: Folder[]
  language: Language
  onSubmit: (data: {
    folderId: string
    jobTitle: string
    jobDescription: string
    requiredSkills: string[]
    yearsExperience: number
    language: string
  }) => void
  isLoading?: boolean
}

export function StepForm({ folders, language, onSubmit, isLoading }: StepFormProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    folderId: '',
    jobTitle: '',
    jobDescription: '',
    requiredSkills: '',
    yearsExperience: 1,
    language: 'en',
  })

  // Vibrant mesh gradients for the steps
  const gradients = [
    "https://products.ls.graphics/mesh-gradients/images/03.-Snowy-Mint_1-p-130x130q80.jpeg",
    "https://products.ls.graphics/mesh-gradients/images/06.-Wisteria-p-130x130q80.jpeg",
    "https://products.ls.graphics/mesh-gradients/images/15.-Perfume_1-p-130x130q80.jpeg",
  ]
  const currentGradient = gradients[step - 1]

  const handleNext = () => {
    if (step === 1 && !formData.folderId) {
      return
    }
    if (step < 3) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.folderId || !formData.jobTitle.trim()) {
      return
    }

    onSubmit({
      folderId: formData.folderId,
      jobTitle: formData.jobTitle,
      jobDescription: formData.jobDescription,
      requiredSkills: formData.requiredSkills
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s),
      yearsExperience: formData.yearsExperience,
      language: formData.language,
    })
  }

  const slideVariants: Variants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2, ease: 'easeIn' } }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Step Indicator */}
      <div className="flex gap-3 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex-1">
            <div
              className={`h-1.5 rounded-full transition-all duration-500 bg-cover bg-center ${s <= step ? 'shadow-md brightness-110' : 'bg-muted opacity-30'}`}
              style={s <= step ? { backgroundImage: `url(${gradients[s-1]})` } : {}}
            />
            <p className={`text-[11px] uppercase tracking-wider font-bold mt-2 transition-colors ${s <= step ? 'text-primary' : 'text-muted-foreground'}`}>
              {s === 1 && t('pipeline.step1', language)}
              {s === 2 && t('pipeline.step2', language)}
              {s === 3 && t('pipeline.step3', language)}
            </p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Animated Steps Container */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step-1" variants={slideVariants} initial="hidden" animate="visible" exit="exit">
                <Card className="p-6 md:p-8 border border-border/50 shadow-sm rounded-2xl bg-white/60 dark:bg-neutral-900/40 backdrop-blur-xl relative overflow-hidden">
                  <div 
                    className="absolute inset-0 opacity-[0.05] dark:opacity-[0.1] pointer-events-none bg-cover bg-center rounded-2xl"
                    style={{ backgroundImage: `url(${currentGradient})` }}
                  />
                  <h3 className="text-lg font-bold tracking-tight text-foreground mb-6 relative z-10">
                    {t('pipeline.select_folder', language)}
                  </h3>
                  <div className="relative z-10">
                    <label className="block text-[13px] font-medium text-foreground mb-2">
                      {language === 'fr' ? 'Dossier' : 'Folder'}
                    </label>
                    <select
                      value={formData.folderId}
                      onChange={(e) => setFormData({ ...formData, folderId: e.target.value })}
                      className="flex h-10 w-full items-center justify-between rounded-xl border border-input/50 bg-background/50 backdrop-blur-sm px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all font-medium"
                    >
                      <option value="" disabled>
                        {language === 'fr' ? 'Sélectionnez un dossier...' : 'Select a folder...'}
                      </option>
                      {folders.map((folder) => (
                        <option key={folder.id} value={folder.id} className="font-medium bg-background text-foreground">
                          {folder.name} ({folder.cvCount} {language === 'fr' ? 'CV' : 'CVs'})
                        </option>
                      ))}
                    </select>
                    {folders.length === 0 && (
                      <p className="text-[13px] text-muted-foreground mt-2 flex items-center gap-2 font-medium">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                        {language === 'fr'
                          ? 'Vous devez d\'abord créer un dossier dans la CVthèque'
                          : 'You need to create a folder in the CV Library first'}
                      </p>
                    )}
                  </div>
                </Card>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step-2" variants={slideVariants} initial="hidden" animate="visible" exit="exit">
                <Card className="p-6 md:p-8 space-y-5 border border-border/50 shadow-sm rounded-2xl bg-white/60 dark:bg-neutral-900/40 backdrop-blur-xl relative overflow-hidden">
                  <div 
                    className="absolute inset-0 opacity-[0.05] dark:opacity-[0.1] pointer-events-none bg-cover bg-center rounded-2xl"
                    style={{ backgroundImage: `url(${currentGradient})` }}
                  />
                  <div className="relative z-10">
                    <label className="block text-[13px] font-bold text-foreground mb-2">
                      {t('pipeline.job_title', language)}
                    </label>
                    <input
                      type="text"
                      value={formData.jobTitle}
                      onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                      className="flex h-10 w-full rounded-xl border border-input/50 bg-background/50 backdrop-blur-sm px-3 py-1 text-sm shadow-sm transition-all placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 font-medium"
                      placeholder={language === 'fr' ? 'Ex. Senior Backend Engineer' : 'E.g. Senior Backend Engineer'}
                    />
                  </div>
                  <div className="relative z-10">
                    <label className="block text-[13px] font-bold text-foreground mb-2">
                      {t('pipeline.job_description', language)}
                    </label>
                    <textarea
                      value={formData.jobDescription}
                      onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                      className="flex min-h-[120px] w-full rounded-xl border border-input/50 bg-background/50 backdrop-blur-sm px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-all font-medium"
                      placeholder={language === 'fr'
                        ? 'Décrivez les responsabilités et attentes...'
                        : 'Describe the responsibilities and expectations...'}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
                    <div>
                      <label className="block text-[13px] font-bold text-foreground mb-2">
                        {t('pipeline.required_skills', language)}
                      </label>
                      <input
                        type="text"
                        value={formData.requiredSkills}
                        onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
                        className="flex h-10 w-full rounded-xl border border-input/50 bg-background/50 backdrop-blur-sm px-3 py-1 text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 font-medium placeholder:text-muted-foreground/50"
                        placeholder={language === 'fr'
                          ? 'Ex. React, Node.js, AWS'
                          : 'E.g. React, Node.js, AWS'}
                      />
                      <p className="text-[11px] text-muted-foreground mt-1.5 font-medium">
                        {language === 'fr'
                          ? 'Séparez les compétences par des virgules'
                          : 'Separate skills with commas'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-foreground mb-2">
                        {t('pipeline.years_experience', language)}
                      </label>
                      <input
                        type="number"
                        value={formData.yearsExperience}
                        onChange={(e) => setFormData({ ...formData, yearsExperience: parseInt(e.target.value) })}
                        className="flex h-10 w-full rounded-xl border border-input/50 bg-background/50 backdrop-blur-sm px-3 py-1 text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 font-medium"
                        min="0"
                        max="50"
                      />
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step-3" variants={slideVariants} initial="hidden" animate="visible" exit="exit">
                <Card className="p-6 md:p-8 border border-border/50 shadow-sm rounded-2xl bg-white/60 dark:bg-neutral-900/40 backdrop-blur-xl relative overflow-hidden">
                  <div 
                    className="absolute inset-0 opacity-[0.05] dark:opacity-[0.1] pointer-events-none bg-cover bg-center rounded-2xl"
                    style={{ backgroundImage: `url(${currentGradient})` }}
                  />
                  <h3 className="text-lg font-bold tracking-tight text-foreground mb-6 relative z-10">
                    {language === 'fr' ? 'Validation des paramètres' : 'Confirm Configuration'}
                  </h3>
                  <div className="space-y-4 text-[13px] relative z-10">
                    <div className="flex justify-between items-center py-3 border-b border-border/40">
                      <span className="text-muted-foreground font-medium">{language === 'fr' ? 'Dossier source' : 'Source Folder'}</span>
                      <span className="font-bold text-foreground px-2 py-1 bg-background/50 rounded-md">
                        {folders.find((f) => f.id === formData.folderId)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-border/40">
                      <span className="text-muted-foreground font-medium">{t('pipeline.job_title', language)}</span>
                      <span className="font-bold text-foreground px-2 py-1 bg-background/50 rounded-md">{formData.jobTitle}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-border/40">
                      <span className="text-muted-foreground font-medium">{t('pipeline.years_experience', language)}</span>
                      <span className="font-bold text-foreground px-2 py-1 bg-background/50 rounded-md">{formData.yearsExperience} {language === 'fr' ? 'ans' : 'years'}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-border/40">
                      <span className="text-muted-foreground font-medium">{t('pipeline.required_skills', language)}</span>
                      <span className="font-bold text-foreground truncate max-w-[50%] px-2 py-1 bg-background/50 rounded-md">{formData.requiredSkills || '—'}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex gap-4 pt-2 relative z-20">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
            className="flex-1 rounded-xl h-11 border-border/50 bg-background/50 backdrop-blur-md hover:bg-muted font-bold transition-all"
          >
            {language === 'fr' ? 'Précédent' : 'Previous'}
          </Button>
          {step < 3 ? (
            <Button
              type="button"
              onClick={handleNext}
              disabled={step === 1 && !formData.folderId}
              className="flex-1 rounded-xl h-11 font-bold shadow-md hover:shadow-lg transition-all"
            >
              {language === 'fr' ? 'Continuer' : 'Continue'}
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isLoading || !formData.folderId || !formData.jobTitle.trim()}
              className="flex-1 rounded-xl h-11 font-bold shadow-md hover:shadow-lg transition-all bg-primary hover:bg-primary/90"
            >
              {isLoading ? t('common.loading', language) : t('pipeline.run_analysis', language)}
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
