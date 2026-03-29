'use client'

import React, { useState, useCallback } from 'react'
import { callAIAgent } from '@/lib/aiAgent'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MdWork, MdOpenInNew } from 'react-icons/md'
import Sidebar, { type LogEntry, type StatusState } from './Sidebar'
import StatsRow, { type StatsData } from './StatsRow'
import ResultsTable, { type JobData } from './ResultsTable'

const AGENT_ID = '69c8cba8a264454f5f5ab4b3'

const SAMPLE_JOBS: JobData[] = [
  { post_id: 'p001', role: 'Senior AI Engineer', company: 'TechCorp', location: 'San Francisco, CA (Remote)', job_type: 'Full-time', primary_skills: ['Python', 'PyTorch', 'LLMs'], secondary_skills: ['Docker', 'AWS'], must_have_skills: ['Python', 'ML'], experience_level: 'Senior', years_of_experience: '5+', salary_range: '$180k-$220k', is_internship: 'No', education: 'MS Computer Science', hiring_intent: 'High', contact_info: 'recruiter@techcorp.com', posted_date: '2026-03-25', post_url: 'https://linkedin.com/jobs/1', company_size: '500-1000', industry: 'Technology', benefits: 'Health, 401k, Equity', work_mode: 'Remote', application_method: 'Apply on LinkedIn', summary: 'Leading AI team building next-gen LLM products.' },
  { post_id: 'p002', role: 'ML Platform Engineer', company: 'DataScale Inc', location: 'New York, NY', job_type: 'Full-time', primary_skills: ['Kubernetes', 'Python', 'MLOps'], secondary_skills: ['Terraform', 'GCP'], must_have_skills: ['Kubernetes', 'Python'], experience_level: 'Mid-Senior', years_of_experience: '3-5', salary_range: '$150k-$190k', is_internship: 'No', education: 'BS Engineering', hiring_intent: 'High', contact_info: 'hr@datascale.io', posted_date: '2026-03-26', post_url: 'https://linkedin.com/jobs/2', company_size: '200-500', industry: 'Data Infrastructure', benefits: 'Health, Remote Flex', work_mode: 'Hybrid', application_method: 'Company website', summary: 'Build scalable ML infrastructure for production models.' },
  { post_id: 'p003', role: 'AI Research Intern', company: 'DeepMind Lab', location: 'London, UK', job_type: 'Internship', primary_skills: ['Python', 'Research', 'NLP'], secondary_skills: ['JAX'], must_have_skills: ['Python'], experience_level: 'Entry', years_of_experience: '0-1', salary_range: 'Stipend', is_internship: 'Yes', education: 'PhD Candidate', hiring_intent: 'Medium', contact_info: 'internships@deepmindlab.com', posted_date: '2026-03-24', post_url: 'https://linkedin.com/jobs/3', company_size: '1000+', industry: 'AI Research', benefits: 'Mentorship, Housing', work_mode: 'On-site', application_method: 'Apply on LinkedIn', summary: 'Research internship focusing on NLP and language models.' },
  { post_id: 'p004', role: 'Data Scientist', company: 'FinServe Analytics', location: 'Chicago, IL', job_type: 'Full-time', primary_skills: ['SQL', 'Python', 'Statistics'], secondary_skills: ['Tableau', 'R'], must_have_skills: ['SQL', 'Python'], experience_level: 'Mid', years_of_experience: '2-4', salary_range: '$120k-$145k', is_internship: 'No', education: 'BS/MS Analytics', hiring_intent: 'Low', contact_info: 'careers@finserve.com', posted_date: '2026-03-20', post_url: 'https://linkedin.com/jobs/4', company_size: '100-200', industry: 'Finance', benefits: 'Health, Bonus', work_mode: 'On-site', application_method: 'Email resume', summary: 'Analyzing financial datasets and building predictive models.' },
]

const SAMPLE_STATS: StatsData = { postsFetched: '12', duplicatesSkipped: '3', postsAnalyzed: '9', rowsWritten: '9' }

function now() {
  const d = new Date()
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export default function Dashboard() {
  const [keyword, setKeyword] = useState('')
  const [sheetId, setSheetId] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [statusState, setStatusState] = useState<StatusState>('idle')
  const [activityLog, setActivityLog] = useState<LogEntry[]>([])
  const [stats, setStats] = useState<StatsData>({ postsFetched: '0', duplicatesSkipped: '0', postsAnalyzed: '0', rowsWritten: '0' })
  const [jobs, setJobs] = useState<JobData[]>([])
  const [useSample, setUseSample] = useState(false)
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null)
  const [processingSummary, setProcessingSummary] = useState('')

  const addLog = useCallback((message: string, type: LogEntry['type'] = 'info') => {
    setActivityLog(prev => [{ id: `${Date.now()}-${Math.random()}`, timestamp: now(), message, type }, ...prev])
  }, [])

  const handleRunAgent = useCallback(async () => {
    if (keyword.trim().length < 2) return

    setIsProcessing(true)
    setStatusState('processing')
    setJobs([])
    setProcessingSummary('')
    setStats({ postsFetched: '0', duplicatesSkipped: '0', postsAnalyzed: '0', rowsWritten: '0' })
    addLog(`Starting analysis for keyword: "${keyword}"`, 'info')
    addLog('Sending keyword to coordinator agent...', 'processing')

    try {
      setActiveAgentId(AGENT_ID)
      const message = sheetId.trim()
        ? `Analyze LinkedIn job posts for keyword "${keyword}". Google Sheet ID: ${sheetId.trim()}`
        : `Analyze LinkedIn job posts for keyword "${keyword}".`

      addLog('Coordinator delegating to sub-agents...', 'processing')

      const result = await callAIAgent(message, AGENT_ID)
      setActiveAgentId(null)

      if (result?.success) {
        const data = result?.response?.result ?? result?.response ?? {}
        addLog('Agent responded successfully', 'success')

        setStats({
          postsFetched: data?.total_posts_received ?? '0',
          duplicatesSkipped: data?.duplicates_skipped ?? '0',
          postsAnalyzed: data?.posts_analyzed ?? '0',
          rowsWritten: data?.rows_written ?? '0',
        })

        if (data?.processing_summary) {
          setProcessingSummary(data.processing_summary)
        }

        let parsedJobs: JobData[] = []
        if (data?.analyzed_jobs && typeof data.analyzed_jobs === 'string') {
          try {
            const parsed = JSON.parse(data.analyzed_jobs)
            parsedJobs = Array.isArray(parsed) ? parsed : []
          } catch {
            addLog('Warning: Could not parse analyzed_jobs field', 'error')
          }
        } else if (Array.isArray(data?.analyzed_jobs)) {
          parsedJobs = data.analyzed_jobs
        }

        setJobs(parsedJobs)
        addLog(`Analysis complete: ${parsedJobs.length} jobs processed`, 'success')

        if (data?.errors && data.errors !== '0' && data.errors !== 'None' && data.errors !== '') {
          addLog(`Errors reported: ${data.errors}`, 'error')
        }

        setStatusState('complete')
      } else {
        const errMsg = result?.error ?? 'Unknown error occurred'
        addLog(`Agent error: ${errMsg}`, 'error')
        setStatusState('error')
      }
    } catch (err: unknown) {
      setActiveAgentId(null)
      const msg = err instanceof Error ? err.message : 'Unexpected error'
      addLog(`Error: ${msg}`, 'error')
      setStatusState('error')
    } finally {
      setIsProcessing(false)
    }
  }, [keyword, sheetId, addLog])

  const displayJobs = useSample ? SAMPLE_JOBS : jobs
  const displayStats = useSample ? SAMPLE_STATS : stats

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ background: 'hsl(220 25% 7%)', color: 'hsl(220 15% 85%)' }}>
      {/* Header */}
      <header className="h-12 shrink-0 flex items-center justify-between px-4 border-b" style={{ background: 'hsl(220 24% 8%)', borderColor: 'hsl(220 18% 15%)' }}>
        <div className="flex items-center gap-2">
          <MdWork className="w-5 h-5" style={{ color: 'hsl(220 80% 60%)' }} />
          <h1 className="text-sm font-semibold tracking-tight" style={{ color: 'hsl(220 15% 85%)' }}>JobIntel AI</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${statusState === 'processing' ? 'bg-amber-400 animate-pulse' : statusState === 'error' ? 'bg-red-400' : 'bg-emerald-400'}`} />
            <span className="text-xs" style={{ color: 'hsl(220 12% 55%)' }}>
              {statusState === 'processing' ? 'Processing' : statusState === 'error' ? 'Error' : statusState === 'complete' ? 'Complete' : 'Ready'}
            </span>
          </div>

          <button
            onClick={() => setUseSample(p => !p)}
            className="flex items-center gap-1.5 text-xs px-2 py-1 rounded"
            style={{ background: useSample ? 'hsl(220 80% 55%)' : 'hsl(220 15% 20%)', color: useSample ? 'white' : 'hsl(220 12% 55%)' }}
          >
            Sample Data
          </button>

          {sheetId.trim() && (
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1" style={{ borderColor: 'hsl(220 18% 18%)', color: 'hsl(220 15% 85%)', background: 'transparent' }} onClick={() => window.open(`https://docs.google.com/spreadsheets/d/${sheetId.trim()}`, '_blank')}>
              <MdOpenInNew className="w-3.5 h-3.5" />View Sheet
            </Button>
          )}
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 min-h-0">
        <Sidebar
          keyword={keyword}
          setKeyword={setKeyword}
          sheetId={sheetId}
          setSheetId={setSheetId}
          isProcessing={isProcessing}
          statusState={statusState}
          activityLog={activityLog}
          onRunAgent={handleRunAgent}
        />

        <main className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
          <StatsRow stats={displayStats} />

          {processingSummary && !useSample && (
            <Card className="border" style={{ background: 'hsl(220 22% 10%)', borderColor: 'hsl(220 18% 18%)' }}>
              <CardContent className="p-3">
                <p className="text-xs" style={{ color: 'hsl(220 12% 55%)' }}>Processing Summary</p>
                <p className="text-sm mt-1" style={{ color: 'hsl(220 15% 85%)' }}>{processingSummary}</p>
              </CardContent>
            </Card>
          )}

          <ResultsTable jobs={displayJobs} />

          {/* Agent Info */}
          <Card className="border" style={{ background: 'hsl(220 22% 10%)', borderColor: 'hsl(220 18% 18%)' }}>
            <CardContent className="p-3">
              <p className="text-xs font-semibold mb-2" style={{ color: 'hsl(220 12% 55%)' }}>Agent Pipeline</p>
              <div className="flex flex-wrap gap-3">
                {[
                  { id: AGENT_ID, name: 'Job Intelligence Coordinator', desc: 'Orchestrates analysis pipeline' },
                  { id: 'sub-analysis', name: 'Job Analysis Agent', desc: 'Extracts structured data from posts' },
                  { id: 'sub-sheets', name: 'Sheets Writer Agent', desc: 'Writes results to Google Sheets' },
                ].map((agent) => (
                  <div key={agent.id} className="flex items-center gap-2 text-xs">
                    <div className={`w-1.5 h-1.5 rounded-full ${activeAgentId === agent.id ? 'bg-amber-400 animate-pulse' : statusState === 'complete' ? 'bg-emerald-400' : 'bg-gray-500'}`} />
                    <span style={{ color: 'hsl(220 15% 85%)' }}>{agent.name}</span>
                    <span style={{ color: 'hsl(220 12% 55%)' }}> -- {agent.desc}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
