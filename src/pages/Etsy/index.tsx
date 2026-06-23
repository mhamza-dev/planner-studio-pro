import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, Copy, RefreshCw, DollarSign, Tag, FileText, CheckCircle, Star, Clock } from 'lucide-react'
import { TopBar } from '@/components/layout/index'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card'
import { Select } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Input'
import { Tabs, TabList, Tab, TabPanel } from '@/components/ui/index'
import { usePlannerStore } from '@/store/plannerStore'
import { useUIStore } from '@/store/uiStore'
import { PLANNER_TYPE_LABELS } from '@/lib/defaults'
import type { PlannerType } from '@/types'
import { cn } from '@/utils/cn'

const ETSY_FEE_RATE = 0.065 // 6.5% transaction fee
const LISTING_FEE = 0.20
const PAYMENT_PROCESSING = 0.03

function generateTitle(name: string, type: PlannerType, pageCount: number): string {
  const label = PLANNER_TYPE_LABELS[type] ?? type
  const variants = [
    `Printable ${label} PDF | ${name} | ${pageCount} Pages | Instant Download`,
    `${name} | Printable ${label} | PDF Download | A4 & US Letter`,
    `Digital ${label} Printable | ${name} | ${pageCount} Page PDF | Instant Download`,
  ]
  return variants[Math.floor(Math.random() * variants.length)]
}

function generateDescription(name: string, type: PlannerType, pageCount: number): string {
  const label = PLANNER_TYPE_LABELS[type] ?? type
  return `✨ INSTANT DIGITAL DOWNLOAD — No physical item will be shipped.

📋 ABOUT THIS PLANNER
${name} is a professionally designed ${label.toLowerCase()} printable, perfect for staying organized and productive. This clean, minimal design is printer-friendly and works on any home printer.

📐 WHAT'S INCLUDED
• ${pageCount} beautifully designed PDF pages
• A4 (210×297mm) and US Letter (8.5×11in) sizes included
• Print-ready at 300 DPI for crisp, professional results
• Instant download after purchase — no waiting!

🖨️ HOW TO USE
1. Purchase and download your PDF instantly
2. Open in Adobe Reader, Preview, or any PDF viewer
3. Print at home or at a local print shop
4. Enjoy your new ${label.toLowerCase()}!

💡 TIPS FOR BEST RESULTS
• Print on bright white paper for best color accuracy
• Use cardstock (110 lb) for a premium feel
• Laminate for durability

📌 PLEASE NOTE
• This is a DIGITAL item — no physical product will be mailed
• Due to the digital nature of this product, refunds are not available
• Personal use only — not for resale or redistribution

Questions? Send me a message and I'll get back to you within 24 hours! 💌`
}

function generateTags(type: PlannerType): string[] {
  const base = ['printable planner', 'digital download', 'pdf planner', 'instant download', 'printable pdf']
  const typeMap: Partial<Record<PlannerType, string[]>> = {
    daily: ['daily planner', 'daily schedule', 'daily organizer', 'productivity planner', 'time management', 'daily routine', 'planner printable', 'agenda printable'],
    weekly: ['weekly planner', 'weekly schedule', 'weekly organizer', 'meal planner', 'week at a glance', 'weekly spread', 'weekly agenda'],
    monthly: ['monthly planner', 'monthly calendar', 'monthly organizer', 'calendar printable', 'month planner'],
    habit: ['habit tracker', 'habit log', 'daily habits', 'streak tracker', 'wellness tracker', 'self improvement', 'goal tracker'],
    budget: ['budget planner', 'finance tracker', 'money organizer', 'expense tracker', 'savings planner', 'budget worksheet'],
    wellness: ['wellness journal', 'self care planner', 'mental health', 'mindfulness journal', 'mood tracker'],
    fitness: ['workout log', 'fitness tracker', 'exercise planner', 'gym log', 'weight lifting log'],
    student: ['student planner', 'school planner', 'study planner', 'academic planner', 'homework planner'],
    business: ['business planner', 'entrepreneur planner', 'work planner', 'productivity planner', 'project planner'],
    journal: ['journal printable', 'daily journal', 'gratitude journal', 'writing journal', 'diary printable'],
  }
  return [...base, ...(typeMap[type]?.slice(0, 8) ?? [])].slice(0, 13)
}

export default function EtsyPage() {
  const { planners } = usePlannerStore()
  const { toast } = useUIStore()
  const [selectedId, setSelectedId] = useState(planners[0]?.id ?? '')
  const [licenseType, setLicenseType] = useState<'personal'|'commercial'>('personal')
  const [price, setPrice] = useState(4)
  const [hoursSpent, setHoursSpent] = useState(2)
  const [tab, setTab] = useState('listing')

  const planner = planners.find(p => p.id === selectedId)
  const pageCount = planner?.pages.length ?? 1
  const type = (planner?.type ?? 'daily') as PlannerType

  const listing = useMemo(() => ({
    title: planner ? generateTitle(planner.name, type, pageCount) : '',
    description: planner ? generateDescription(planner.name, type, pageCount) : '',
    tags: generateTags(type),
  }), [planner, type, pageCount])

  const [displayListing, setDisplayListing] = useState(listing)
  const refreshListing = () => setDisplayListing({
    title: planner ? generateTitle(planner.name, type, pageCount) : '',
    description: planner ? generateDescription(planner.name, type, pageCount) : '',
    tags: generateTags(type),
  })

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast(`${label} copied to clipboard`, 'success')
  }

  // Pricing calc
  const etsyFee = price * ETSY_FEE_RATE
  const paymentFee = price * PAYMENT_PROCESSING
  const net = price - etsyFee - paymentFee - LISTING_FEE
  const hourlyRate = hoursSpent > 0 ? net / hoursSpent : 0

  if (planners.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <TopBar title="Etsy Tools" subtitle="List and sell your planners on Etsy"/>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <ShoppingBag size={32} className="text-ink-faint mx-auto mb-3"/>
            <p className="text-sm font-semibold text-primary">No planners to list yet</p>
            <p className="text-xs text-ink-muted mt-1">Create a planner first, then come back to generate your Etsy listing.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Etsy Tools" subtitle="Generate listings, calculate pricing, and preview mockups"/>

      <div className="flex-1 overflow-auto p-6 max-w-4xl space-y-5">
        {/* Planner selector */}
        <Card padding="sm">
          <div className="flex items-center gap-4">
            <Select label="Select planner" value={selectedId}
              onChange={e => setSelectedId(e.target.value)}
              options={planners.map(p => ({ value: p.id, label: p.name }))}
              className="flex-1"/>
            <Select label="License type" value={licenseType}
              onChange={e => setLicenseType(e.target.value as any)}
              options={[{value:'personal',label:'Personal Use Only'},{value:'commercial',label:'Commercial Use License'}]}
              className="flex-1"/>
          </div>
        </Card>

        <Tabs value={tab} onChange={setTab}>
          <TabList variant="segment">
            <Tab value="listing" variant="segment"><FileText size={12}/> Listing</Tab>
            <Tab value="pricing" variant="segment"><DollarSign size={12}/> Pricing</Tab>
            <Tab value="mockup" variant="segment"><Star size={12}/> Mockup</Tab>
          </TabList>

          {/* ── Listing tab ── */}
          <TabPanel value="listing" className="pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-ink-muted">Auto-generated Etsy listing — click to regenerate or copy</p>
              <Button variant="ghost" size="sm" onClick={refreshListing}><RefreshCw size={13}/> Regenerate</Button>
            </div>

            {/* Title */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-primary">Listing Title</label>
                <div className="flex items-center gap-2">
                  <span className={cn('text-[10px]', displayListing.title.length > 140 ? 'text-red-500' : 'text-ink-faint')}>
                    {displayListing.title.length}/140
                  </span>
                  <Button variant="ghost" size="xs" onClick={() => copyToClipboard(displayListing.title, 'Title')}>
                    <Copy size={11}/> Copy
                  </Button>
                </div>
              </div>
              <textarea value={displayListing.title} onChange={e => setDisplayListing(d=>({...d,title:e.target.value}))} rows={2}
                className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-paper focus:outline-none focus:ring-2 focus:ring-accent/30 text-primary resize-none"/>
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-primary">Description</label>
                <Button variant="ghost" size="xs" onClick={() => copyToClipboard(displayListing.description, 'Description')}>
                  <Copy size={11}/> Copy
                </Button>
              </div>
              <textarea value={displayListing.description} onChange={e => setDisplayListing(d=>({...d,description:e.target.value}))} rows={12}
                className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-paper focus:outline-none focus:ring-2 focus:ring-accent/30 text-primary resize-none font-mono leading-relaxed"/>
            </div>

            {/* Tags */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-primary">Tags <span className="text-ink-faint font-normal">({displayListing.tags.length}/13)</span></label>
                <Button variant="ghost" size="xs" onClick={() => copyToClipboard(displayListing.tags.join(', '), 'Tags')}>
                  <Copy size={11}/> Copy all
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {displayListing.tags.map((tag,i) => (
                  <span key={i} className="flex items-center gap-1 text-xs bg-accent/10 text-accent px-2.5 py-1 rounded-full border border-accent/20">
                    <Tag size={9}/> {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* License block */}
            <div className="bg-surface-sunken rounded-xl p-4 border border-border">
              <p className="text-xs font-semibold text-primary mb-1">License Notice</p>
              <p className="text-xs text-ink-muted leading-relaxed">
                {licenseType === 'personal'
                  ? '⚠️ This item is for PERSONAL USE ONLY. You may not resell, redistribute, or use this file for commercial purposes.'
                  : '✅ This item includes a COMMERCIAL USE LICENSE. You may use this for client work, commercial printing, and business use. You may NOT resell the digital file itself.'}
              </p>
            </div>
          </TabPanel>

          {/* ── Pricing tab ── */}
          <TabPanel value="pricing" className="pt-5">
            <div className="grid md:grid-cols-2 gap-5">
              <Card padding="md">
                <h3 className="text-sm font-semibold text-primary mb-4">Set Your Price</h3>
                <div className="space-y-4">
                  <Spinner label="Listing price ($)" value={price} onChange={setPrice} min={1} max={99} suffix=" USD"/>
                  <Spinner label="Hours spent creating" value={hoursSpent} onChange={setHoursSpent} min={1} max={40}/>
                </div>
              </Card>

              <Card padding="md">
                <h3 className="text-sm font-semibold text-primary mb-4">Fee Breakdown</h3>
                <div className="space-y-3">
                  {[
                    { label:'Listing price', value:`$${price.toFixed(2)}`, positive:true },
                    { label:'Etsy transaction (6.5%)', value:`-$${etsyFee.toFixed(2)}` },
                    { label:'Payment processing (3%)', value:`-$${paymentFee.toFixed(2)}` },
                    { label:'Listing fee', value:`-$${LISTING_FEE.toFixed(2)}` },
                  ].map(row => (
                    <div key={row.label} className="flex items-center justify-between text-sm">
                      <span className="text-ink-muted">{row.label}</span>
                      <span className={cn('font-semibold', row.positive ? 'text-emerald-600' : 'text-primary')}>{row.value}</span>
                    </div>
                  ))}
                  <div className="border-t border-border pt-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-primary">Net profit</span>
                    <span className="text-lg font-bold text-emerald-600">${net.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-ink-muted">
                    <span>Hourly rate</span>
                    <span className="font-medium text-primary">${hourlyRate.toFixed(2)}/hr</span>
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-xl border border-border bg-surface-sunken">
                  <p className="text-[10px] text-ink-muted leading-relaxed">
                    <strong className="text-primary">Pricing tip:</strong> Digital planners on Etsy typically sell for $3–$12. Well-designed bundles (5+ planners) can command $15–$25. Price based on perceived value, not time spent.
                  </p>
                </div>
              </Card>
            </div>
          </TabPanel>

          {/* ── Mockup tab ── */}
          <TabPanel value="mockup" className="pt-5">
            <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl p-8 flex items-center justify-center min-h-[360px]">
              <div className="relative">
                {/* Desk surface */}
                <div className="absolute inset-0 bg-gradient-to-b from-stone-100 to-stone-200 rounded-2xl" style={{transform:'perspective(600px) rotateX(8deg) translateY(60px)',opacity:0.6}}/>

                {/* Main planner */}
                <div className="relative bg-white rounded-2xl shadow-xl border border-gray-200 w-56 h-72 p-5 flex flex-col"
                  style={{transform:'perspective(600px) rotateY(-8deg) rotateX(2deg)'}}>
                  <div className="h-1 w-20 rounded-full mb-4" style={{backgroundColor:planner?.config.accentColor??'#E2E8F0'}}/>
                  <h3 className="text-lg font-bold font-serif text-primary mb-1" style={{color:planner?.config.primaryColor??'#0F172A'}}>
                    {planner?.name ?? 'My Planner'}
                  </h3>
                  <p className="text-xs text-ink-muted">{new Date().getFullYear()}</p>
                  <div className="mt-4 space-y-2">
                    {[80,100,60,90,70,50].map((w,i) => (
                      <div key={i} className="h-1 rounded-full" style={{width:`${w}%`,backgroundColor:`${planner?.config.primaryColor??'#0F172A'}20`}}/>
                    ))}
                  </div>
                  <div className="mt-auto text-[9px] text-ink-faint text-center">Planner Studio Pro</div>
                </div>

                {/* Shadow planner */}
                <div className="absolute top-2 -right-4 bg-white rounded-2xl shadow-md border border-gray-200 w-56 h-72"
                  style={{transform:'perspective(600px) rotateY(-4deg) rotateX(2deg)',opacity:0.5,zIndex:-1}}/>
              </div>
            </div>
            <p className="text-xs text-ink-muted text-center mt-3">CSS-rendered mockup preview. Use your exported PDF in a real mockup tool for Etsy listings.</p>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  )
}
