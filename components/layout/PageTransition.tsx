'use client'

import { usePathname } from 'next/navigation'
import { motion, type Variants } from 'framer-motion'

const variants: Variants = {
  hidden:  { opacity: 0, y: 10, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.3, ease: 'easeOut' },
  },
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <motion.div
      key={pathname}
      initial="hidden"
      animate="visible"
      variants={variants}
      className="flex flex-col flex-1 h-full"
    >
      {children}
    </motion.div>
  )
}

