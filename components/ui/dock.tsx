"use client"

import * as React from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

const DockContext = React.createContext<{
  mouseX: any;
  hoveredIndex: number | null;
  setHoveredIndex: (index: number | null) => void;
} | null>(null)

export function Dock({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const mouseX = useMotionValue(Infinity)
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)

  return (
    <DockContext.Provider value={{ mouseX, hoveredIndex, setHoveredIndex }}>
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => {
          mouseX.set(Infinity)
          setHoveredIndex(null)
        }}
        className={cn(
          "mx-auto flex h-[58px] items-end gap-2 rounded-2xl bg-black/10 dark:bg-white/10 p-2 pb-2 backdrop-blur-md ring-1 ring-white/10",
          className
        )}
      >
        {children}
      </motion.div>
    </DockContext.Provider>
  )
}

export function DockCard({
  children,
  id,
  onClick,
}: {
  children: React.ReactNode
  id: string
  onClick?: () => void
}) {
  const dock = React.useContext(DockContext)
  const ref = React.useRef<HTMLDivElement>(null)

  const distance = useTransform(dock!.mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return val - bounds.x - bounds.width / 2
  })

  // Width is 40px normally, 80px at max zoom
  const widthSync = useTransform(distance, [-150, 0, 150], [40, 80, 40])
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 })

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      onClick={onClick}
      onMouseEnter={() => dock!.setHoveredIndex(Number(id))}
      onMouseLeave={() => dock!.setHoveredIndex(null)}
      className="flex aspect-square cursor-pointer items-end justify-center rounded-xl"
    >
      {children}
    </motion.div>
  )
}

export function DockCardInner({
  children,
  src,
  id,
}: {
  children: React.ReactNode
  src?: string
  id?: string
}) {
  return (
    <motion.div
      className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5 dark:bg-neutral-800 dark:ring-white/10 transition-shadow duration-200"
    >
      {src && (
        <img
          src={src}
          alt={`dock-icon`}
          className="absolute inset-0 h-full w-full object-cover opacity-90 transition-opacity hover:opacity-100"
        />
      )}
      <div className="z-10">{children}</div>
    </motion.div>
  )
}

export function DockDivider() {
  return (
    <div className="mx-1 h-3/4 w-[1px] rounded-full bg-neutral-300 dark:bg-neutral-700/50 self-center" />
  )
}
