'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { MdSearch, MdSettings, MdPlayArrow, MdCheckCircle, MdError, MdInfo, MdHourglassEmpty } from 'react-icons/md'
import { FiLoader, FiChevronDown } from 'react-icons/fi'

export interface LogEntry {
  id: string
  timestamp: string
  message: string
  type: 'info' | 'success' | 'error' | 'processing'
}

export type StatusState = 'idle' | 'processing' | 'complete' | 'error'

interface SidebarProps {
  keyword: string
  setKeyword: (v: string) => void
  sheetId: string
  setSheetId: (v: string) => void
  isProcessing: boolean
  statusState: StatusState
  activityLog: LogEntry[]
  onRunAgent: () => void
}

function StatusIcon({ type }: { type: LogEntry['type'] }) {
  switch (type) {
    case 'success':
      return <MdCheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
    case 'error':
      return <MdError className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
    case 'processing':
      return <FiLoader className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5 animate-spin" />
    default:
      return <MdInfo className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
  }
}

function getStatusBadge(status: StatusState) {
  switch (status) {
    case 'idle':
      return <Badge variant="outline" className="text-xs border-[hsl(220,12%,55%)] text-[hsl(220,12%,55%)]"><MdHourglassEmpty className="w-3 h-3 mr-1" />Idle</Badge>
    case 'processing':
      return <Badge variant="outline" className="text-xs border-amber-500 text-amber-400"><FiLoader className="w-3 h-3 mr-1 animate-spin" />Processing</Badge>
    case 'complete':
      return <Badge variant="outline" className="text-xs border-emerald-500 text-emerald-400"><MdCheckCircle className="w-3 h-3 mr-1" />Complete</Badge>
    case 'error':
      return <Badge variant="outline" className="text-xs border-red-500 text-red-400"><MdError className="w-3 h-3 mr-1" />Error</Badge>
  }
}

export default function Sidebar({
  keyword,
  setKeyword,
  sheetId,
  setSheetId,
  isProcessing,
  statusState,
  activityLog,
  onRunAgent,
}: SidebarProps) {
  const [settingsOpen, setSettingsOpen] = React.useState(false)
  const canRun = keyword.trim().length >= 2 && !isProcessing

  return (
    <aside className="w-[300px] shrink-0 h-full border-r flex flex-col" style={{ borderColor: 'hsl(220 18% 15%)', background: 'hsl(220 24% 8%)' }}>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-wide uppercase" style={{ color: 'hsl(220 12% 55%)' }}>Search</h2>
          {getStatusBadge(statusState)}
        </div>

        <div className="space-y-2">
          <Label htmlFor="keyword" className="text-xs font-medium" style={{ color: 'hsl(220 15% 85%)' }}>Keyword</Label>
          <div className="relative">
            <MdSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'hsl(220 12% 55%)' }} />
            <Input
              id="keyword"
              placeholder="e.g., AI Developer Remote"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="pl-8 h-9 text-sm border"
              style={{ background: 'hsl(220 15% 24%)', borderColor: 'hsl(220 18% 18%)', color: 'hsl(220 15% 85%)' }}
            />
          </div>
          {keyword.length > 0 && keyword.length < 2 && (
            <p className="text-xs" style={{ color: 'hsl(0 75% 55%)' }}>Min 2 characters required</p>
          )}
        </div>

        <Collapsible open={settingsOpen} onOpenChange={setSettingsOpen}>
          <CollapsibleTrigger className="flex items-center gap-1.5 text-xs font-medium w-full" style={{ color: 'hsl(220 12% 55%)' }}>
            <MdSettings className="w-3.5 h-3.5" />
            <span>Settings</span>
            <FiChevronDown className={`w-3 h-3 ml-auto transition-transform ${settingsOpen ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 space-y-2">
            <Label htmlFor="sheetId" className="text-xs font-medium" style={{ color: 'hsl(220 15% 85%)' }}>Google Sheet ID</Label>
            <Input
              id="sheetId"
              placeholder="Sheet ID (optional)"
              value={sheetId}
              onChange={(e) => setSheetId(e.target.value)}
              className="h-9 text-sm border"
              style={{ background: 'hsl(220 15% 24%)', borderColor: 'hsl(220 18% 18%)', color: 'hsl(220 15% 85%)' }}
            />
          </CollapsibleContent>
        </Collapsible>

        <Button
          onClick={onRunAgent}
          disabled={!canRun}
          className="w-full h-9 text-sm font-medium"
          style={{ background: canRun ? 'hsl(220 80% 55%)' : 'hsl(220 15% 20%)', color: canRun ? 'hsl(0 0% 100%)' : 'hsl(220 12% 55%)' }}
        >
          {isProcessing ? (
            <><FiLoader className="w-4 h-4 mr-2 animate-spin" />Processing...</>
          ) : (
            <><MdPlayArrow className="w-4 h-4 mr-1" />Run Agent</>
          )}
        </Button>
      </div>

      <Separator style={{ background: 'hsl(220 18% 15%)' }} />

      <div className="flex-1 flex flex-col min-h-0 p-4 pt-3">
        <h3 className="text-xs font-semibold tracking-wide uppercase mb-2" style={{ color: 'hsl(220 12% 55%)' }}>Activity Log</h3>
        <ScrollArea className="flex-1">
          {activityLog.length === 0 ? (
            <p className="text-xs italic" style={{ color: 'hsl(220 12% 55%)' }}>No activity yet. Run the agent to begin.</p>
          ) : (
            <div className="space-y-2 pr-2">
              {activityLog.map((entry) => (
                <div key={entry.id} className="flex gap-2 text-xs">
                  <StatusIcon type={entry.type} />
                  <div className="min-w-0">
                    <span style={{ color: 'hsl(220 12% 55%)' }}>{entry.timestamp}</span>
                    <p className="leading-snug" style={{ color: 'hsl(220 15% 85%)' }}>{entry.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </aside>
  )
}
