'use client'

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { MdOpenInNew, MdUnfoldMore, MdArrowUpward, MdArrowDownward, MdTableRows } from 'react-icons/md'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

export interface JobData {
  post_id?: string
  role?: string
  company?: string
  location?: string
  job_type?: string
  primary_skills?: string | string[]
  secondary_skills?: string | string[]
  must_have_skills?: string | string[]
  experience_level?: string
  years_of_experience?: string
  salary_range?: string
  is_internship?: string | boolean
  education?: string
  hiring_intent?: string
  contact_info?: string
  posted_date?: string
  post_url?: string
  company_size?: string
  industry?: string
  benefits?: string | string[]
  work_mode?: string
  application_method?: string
  summary?: string
}

interface ResultsTableProps {
  jobs: JobData[]
}

type SortKey = 'role' | 'company' | 'location' | 'hiring_intent' | 'work_mode'
type SortDir = 'asc' | 'desc'

const PAGE_SIZE = 10

function getHiringIntentBadge(intent?: string) {
  const val = (intent ?? '').toLowerCase()
  if (val.includes('high')) return <Badge className="text-xs px-1.5 py-0" style={{ background: 'hsl(160 70% 45% / 0.15)', color: 'hsl(160 70% 50%)', border: '1px solid hsl(160 70% 45% / 0.3)' }}>High</Badge>
  if (val.includes('medium') || val.includes('moderate')) return <Badge className="text-xs px-1.5 py-0" style={{ background: 'hsl(35 85% 55% / 0.15)', color: 'hsl(35 85% 60%)', border: '1px solid hsl(35 85% 55% / 0.3)' }}>Medium</Badge>
  if (val.includes('low')) return <Badge className="text-xs px-1.5 py-0" style={{ background: 'hsl(0 75% 55% / 0.15)', color: 'hsl(0 75% 60%)', border: '1px solid hsl(0 75% 55% / 0.3)' }}>Low</Badge>
  return <Badge variant="outline" className="text-xs px-1.5 py-0" style={{ borderColor: 'hsl(220 18% 18%)', color: 'hsl(220 12% 55%)' }}>{intent || '--'}</Badge>
}

function toArray(val: string | string[] | undefined): string[] {
  if (!val) return []
  if (Array.isArray(val)) return val
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val)
      if (Array.isArray(parsed)) return parsed
    } catch { /* ignore */ }
    return val.split(',').map(s => s.trim()).filter(Boolean)
  }
  return []
}

export default function ResultsTable({ jobs }: ResultsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('role')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [page, setPage] = useState(0)
  const [selectedJob, setSelectedJob] = useState<JobData | null>(null)

  const sorted = useMemo(() => {
    if (!Array.isArray(jobs)) return []
    const copy = [...jobs]
    copy.sort((a, b) => {
      const aVal = (a[sortKey] ?? '').toString().toLowerCase()
      const bVal = (b[sortKey] ?? '').toString().toLowerCase()
      return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    })
    return copy
  }, [jobs, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const pageJobs = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
    setPage(0)
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <MdUnfoldMore className="w-3.5 h-3.5 inline ml-0.5 opacity-40" />
    return sortDir === 'asc'
      ? <MdArrowUpward className="w-3.5 h-3.5 inline ml-0.5" style={{ color: 'hsl(220 80% 60%)' }} />
      : <MdArrowDownward className="w-3.5 h-3.5 inline ml-0.5" style={{ color: 'hsl(220 80% 60%)' }} />
  }

  if (!Array.isArray(jobs) || jobs.length === 0) {
    return (
      <Card className="border" style={{ background: 'hsl(220 22% 10%)', borderColor: 'hsl(220 18% 18%)' }}>
        <CardContent className="p-8 text-center">
          <MdTableRows className="w-10 h-10 mx-auto mb-3" style={{ color: 'hsl(220 12% 55%)' }} />
          <p className="text-sm" style={{ color: 'hsl(220 12% 55%)' }}>No job results yet. Enter a keyword and run the agent to analyze LinkedIn posts.</p>
        </CardContent>
      </Card>
    )
  }

  const thStyle: React.CSSProperties = { color: 'hsl(220 12% 55%)', borderColor: 'hsl(220 18% 18%)' }
  const tdStyle: React.CSSProperties = { color: 'hsl(220 15% 85%)', borderColor: 'hsl(220 18% 18%)' }

  return (
    <>
      <Card className="border" style={{ background: 'hsl(220 22% 10%)', borderColor: 'hsl(220 18% 18%)' }}>
        <CardHeader className="pb-2 px-4 pt-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold" style={{ color: 'hsl(220 15% 85%)' }}>Analyzed Jobs ({sorted.length})</CardTitle>
            <span className="text-xs" style={{ color: 'hsl(220 12% 55%)' }}>Page {page + 1} of {totalPages}</span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="w-full">
            <Table>
              <TableHeader>
                <TableRow style={{ borderColor: 'hsl(220 18% 18%)' }}>
                  <TableHead className="text-xs cursor-pointer select-none whitespace-nowrap" style={thStyle} onClick={() => handleSort('role')}>Role<SortIcon col="role" /></TableHead>
                  <TableHead className="text-xs cursor-pointer select-none whitespace-nowrap" style={thStyle} onClick={() => handleSort('company')}>Company<SortIcon col="company" /></TableHead>
                  <TableHead className="text-xs cursor-pointer select-none whitespace-nowrap" style={thStyle} onClick={() => handleSort('location')}>Location<SortIcon col="location" /></TableHead>
                  <TableHead className="text-xs whitespace-nowrap" style={thStyle}>Primary Skills</TableHead>
                  <TableHead className="text-xs cursor-pointer select-none whitespace-nowrap" style={thStyle} onClick={() => handleSort('hiring_intent')}>Intent<SortIcon col="hiring_intent" /></TableHead>
                  <TableHead className="text-xs cursor-pointer select-none whitespace-nowrap" style={thStyle} onClick={() => handleSort('work_mode')}>Work Mode<SortIcon col="work_mode" /></TableHead>
                  <TableHead className="text-xs whitespace-nowrap" style={thStyle}>Link</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageJobs.map((job, i) => {
                  const skills = toArray(job.primary_skills)
                  return (
                    <TableRow key={job.post_id || i} className="cursor-pointer hover:bg-white/5 transition-colors" style={{ borderColor: 'hsl(220 18% 18%)' }} onClick={() => setSelectedJob(job)}>
                      <TableCell className="text-xs font-medium max-w-[180px] truncate" style={tdStyle}>{job.role ?? '--'}</TableCell>
                      <TableCell className="text-xs max-w-[140px] truncate" style={tdStyle}>{job.company ?? '--'}</TableCell>
                      <TableCell className="text-xs max-w-[120px] truncate" style={tdStyle}>{job.location ?? '--'}</TableCell>
                      <TableCell className="text-xs max-w-[180px]" style={tdStyle}>
                        <div className="flex flex-wrap gap-1">
                          {skills.slice(0, 3).map((s, si) => (
                            <Badge key={si} variant="outline" className="text-[10px] px-1 py-0" style={{ borderColor: 'hsl(220 18% 18%)', color: 'hsl(220 80% 60%)' }}>{s}</Badge>
                          ))}
                          {skills.length > 3 && <span className="text-[10px]" style={{ color: 'hsl(220 12% 55%)' }}>+{skills.length - 3}</span>}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs" style={tdStyle}>{getHiringIntentBadge(job.hiring_intent)}</TableCell>
                      <TableCell className="text-xs" style={tdStyle}>{job.work_mode ?? '--'}</TableCell>
                      <TableCell className="text-xs" style={tdStyle}>
                        {job.post_url ? (
                          <a href={job.post_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-0.5 hover:underline" style={{ color: 'hsl(220 80% 60%)' }}>
                            <MdOpenInNew className="w-3.5 h-3.5" />
                          </a>
                        ) : '--'}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </ScrollArea>

          {totalPages > 1 && (
            <div className="flex items-center justify-end gap-2 p-3 border-t" style={{ borderColor: 'hsl(220 18% 18%)' }}>
              <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)} className="h-7 px-2 text-xs" style={{ borderColor: 'hsl(220 18% 18%)', color: 'hsl(220 15% 85%)', background: 'transparent' }}>
                <FiChevronLeft className="w-3.5 h-3.5 mr-1" />Prev
              </Button>
              <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)} className="h-7 px-2 text-xs" style={{ borderColor: 'hsl(220 18% 18%)', color: 'hsl(220 15% 85%)', background: 'transparent' }}>
                Next<FiChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={selectedJob !== null} onOpenChange={() => setSelectedJob(null)}>
        <DialogContent className="max-w-lg border" style={{ background: 'hsl(220 22% 10%)', borderColor: 'hsl(220 18% 18%)', color: 'hsl(220 15% 85%)' }}>
          {selectedJob && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base font-semibold" style={{ color: 'hsl(220 15% 85%)' }}>{selectedJob.role ?? 'Job Details'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <DetailRow label="Company" value={selectedJob.company} />
                <DetailRow label="Location" value={selectedJob.location} />
                <DetailRow label="Job Type" value={selectedJob.job_type} />
                <DetailRow label="Work Mode" value={selectedJob.work_mode} />
                <DetailRow label="Experience" value={selectedJob.experience_level} />
                <DetailRow label="Years Required" value={selectedJob.years_of_experience} />
                <DetailRow label="Salary Range" value={selectedJob.salary_range} />
                <DetailRow label="Education" value={selectedJob.education} />
                <DetailRow label="Hiring Intent" value={selectedJob.hiring_intent} badge />
                <DetailRow label="Industry" value={selectedJob.industry} />
                <DetailRow label="Company Size" value={selectedJob.company_size} />
                <DetailRow label="Application" value={selectedJob.application_method} />
                <DetailRow label="Contact" value={selectedJob.contact_info} />
                <DetailRow label="Posted" value={selectedJob.posted_date} />

                <div>
                  <span className="text-xs font-medium" style={{ color: 'hsl(220 12% 55%)' }}>Primary Skills</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {toArray(selectedJob.primary_skills).map((s, i) => (
                      <Badge key={i} variant="outline" className="text-[11px] px-1.5" style={{ borderColor: 'hsl(220 80% 55% / 0.3)', color: 'hsl(220 80% 60%)' }}>{s}</Badge>
                    ))}
                    {toArray(selectedJob.primary_skills).length === 0 && <span style={{ color: 'hsl(220 12% 55%)' }}>--</span>}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-medium" style={{ color: 'hsl(220 12% 55%)' }}>Must-Have Skills</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {toArray(selectedJob.must_have_skills).map((s, i) => (
                      <Badge key={i} variant="outline" className="text-[11px] px-1.5" style={{ borderColor: 'hsl(160 70% 45% / 0.3)', color: 'hsl(160 70% 50%)' }}>{s}</Badge>
                    ))}
                    {toArray(selectedJob.must_have_skills).length === 0 && <span style={{ color: 'hsl(220 12% 55%)' }}>--</span>}
                  </div>
                </div>

                {selectedJob.summary && (
                  <div>
                    <span className="text-xs font-medium" style={{ color: 'hsl(220 12% 55%)' }}>Summary</span>
                    <p className="text-xs mt-1 leading-relaxed" style={{ color: 'hsl(220 15% 85%)' }}>{selectedJob.summary}</p>
                  </div>
                )}

                {selectedJob.post_url && (
                  <a href={selectedJob.post_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-medium mt-2" style={{ color: 'hsl(220 80% 60%)' }}>
                    <MdOpenInNew className="w-3.5 h-3.5" />View Original Post
                  </a>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

function DetailRow({ label, value, badge }: { label: string; value?: string; badge?: boolean }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-2">
      <span className="text-xs font-medium shrink-0 w-28" style={{ color: 'hsl(220 12% 55%)' }}>{label}</span>
      {badge ? getHiringIntentBadge(value) : <span className="text-xs" style={{ color: 'hsl(220 15% 85%)' }}>{value}</span>}
    </div>
  )
}
