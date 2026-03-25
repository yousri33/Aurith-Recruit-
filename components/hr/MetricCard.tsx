'use client'

import { ReactNode } from 'react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  icon: ReactNode
  trend?: { value: number; direction: 'up' | 'down' }
  className?: string
  total?: number
  description?: string
}

import { motion } from 'framer-motion'

export function MetricCard({ title, value, icon, trend, className, total, description }: MetricCardProps) {
  const percentage =
    total !== undefined ? Math.min(100, Math.round((Number(value) / total) * 100)) : null

  // Mesh gradient for the rich aesthetic
  const meshGradientSrc = "https://products.ls.graphics/mesh-gradients/images/09.-Light-Sky-Blue-p-130x130q80.jpeg"

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.015 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
    >
      <Card
        className={cn(
          'relative overflow-hidden p-4 transition-all duration-300 group cursor-pointer shadow-sm hover:shadow-xl rounded-2xl',
          'bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md border border-border/50 hover:border-primary/40',
          className,
        )}
      >
        {/* Colorful Mesh Gradient hover background */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-[0.08] dark:group-hover:opacity-[0.15] transition-opacity duration-500 pointer-events-none bg-cover bg-center"
          style={{ backgroundImage: `url(${meshGradientSrc})`, mixBlendMode: 'overlay' }}
        />

        <div className="z-10 relative flex flex-col h-full justify-between">
          <div className="flex items-center gap-3 mb-2 md:mb-6">
            <span className="p-1.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm border border-primary/10">
              {icon}
            </span>
            <p className="text-[11px] md:text-[13px] font-bold text-muted-foreground uppercase tracking-wider">{title}</p>
          </div>

          <div className="flex justify-between items-end gap-2 md:gap-4 min-h-[60px] md:min-h-[80px]">
            <div className="flex flex-col gap-1.5 flex-1">
              <p className="text-2xl md:text-4xl font-black tracking-tighter tabular-nums text-foreground group-hover:text-primary transition-colors duration-300">
                {value}
              </p>
              {description && (
                <p className="text-[10px] md:text-xs font-medium text-muted-foreground/70 leading-tight">
                  {description}
                </p>
              )}
              <div className="mt-1.5 h-6 flex items-end">
                {trend && (
                  <div
                    className={cn(
                      'flex items-center gap-1.5 rounded-lg font-bold text-[11px] px-2.5 py-1 w-fit shadow-sm border',
                      trend.direction === 'up'
                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/10 dark:bg-emerald-500/20 dark:text-emerald-400'
                        : 'bg-red-500/10 text-red-600 border-red-500/10 dark:bg-red-500/20 dark:text-red-400',
                    )}
                  >
                    {trend.direction === 'up' ? (
                      <TrendingUp className="h-3.5 w-3.5" />
                    ) : (
                      <TrendingDown className="h-3.5 w-3.5" />
                    )}
                    <span>{trend.value}%</span>
                  </div>
                )}
              </div>
            </div>

            {/* Radial chart when total is provided */}
            {percentage !== null && (
              <div className="relative h-14 w-14 md:h-18 md:w-18 flex-shrink-0 animate-in fade-in zoom-in duration-500">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="65%"
                    outerRadius="100%"
                    barSize={6}
                    data={[{ value: percentage }]}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                    <RadialBar
                      angleAxisId={0}
                      dataKey="value"
                      cornerRadius={999}
                      fill="currentColor"
                      className="fill-primary/80 group-hover:fill-primary transition-colors duration-500"
                      background={{ fill: 'currentColor', className: 'fill-muted' }}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-[11px] md:text-[13px] font-black text-foreground tracking-tighter group-hover:text-primary transition-colors leading-none">
                    {percentage}%
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
