export type CampaignStatus = 'active' | 'pending' | 'completed' | 'paused'

export interface Campaign {
  id: string
  title: string
  status: CampaignStatus
  briefing: string
  startDate: string
  endDate: string
  brand: string
  assetsUrl?: string
  deliverables: string[]
  budget?: string
  requirements?: string[]
  createdAt: string
  updatedAt: string
}
