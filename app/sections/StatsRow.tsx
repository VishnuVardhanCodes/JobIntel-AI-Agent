'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { MdOutlineArticle, MdContentCopy, MdNewReleases, MdTableRows } from 'react-icons/md'

export interface StatsData {
  postsFetched: string
  duplicatesSkipped: string
  postsAnalyzed: string
  rowsWritten: string
}

interface StatsRowProps {
  stats: StatsData
}

const statConfig = [
  { key: 'postsFetched' as const, label: 'Posts Fetched', icon: MdOutlineArticle, color: 'hsl(220 80% 60%)' },
  { key: 'duplicatesSkipped' as const, label: 'Duplicates Skipped', icon: MdContentCopy, color: 'hsl(35 85% 55%)' },
  { key: 'postsAnalyzed' as const, label: 'Jobs Analyzed', icon: MdNewReleases, color: 'hsl(160 70% 50%)' },
  { key: 'rowsWritten' as const, label: 'Rows Written', icon: MdTableRows, color: 'hsl(280 60% 60%)' },
]

export default function StatsRow({ stats }: StatsRowProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {statConfig.map((s) => {
        const Icon = s.icon
        const value = stats[s.key] || '0'
        return (
          <Card key={s.key} className="border" style={{ background: 'hsl(220 22% 10%)', borderColor: 'hsl(220 18% 18%)' }}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded" style={{ background: s.color.replace(')', ' / 0.15)') }}>
                <Icon className="w-5 h-5" style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-2xl font-semibold leading-none" style={{ color: 'hsl(220 15% 85%)' }}>{value}</p>
                <p className="text-xs mt-1" style={{ color: 'hsl(220 12% 55%)' }}>{s.label}</p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
