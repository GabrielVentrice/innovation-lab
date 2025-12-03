export type Platform = 'youtube' | 'twitch' | 'tiktok'

export interface CreatorAccount {
  platform: Platform
  externalId: string
  displayName: string
  username: string
  url: string
  country: string | null
  language: string | null
  followers: number | null
  avgViews: number | null
  gameTags: string[]
  avatarUrl: string | null
  bio: string
  links: string[]
}

export interface Creator {
  id: string
  name: string
  language: string | null
  country: string | null
  gameTags: string[]
  accounts: CreatorAccount[]
}

export interface SearchFilters {
  game: string
  language?: string
  region?: string
  viewMode?: 'full' | 'short'
}

export interface SearchOptions {
  game: string
  language?: string
  region?: string
}

export type ContactType = 'email' | 'whatsapp' | 'discord' | 'telegram'
export type SocialType = 'twitter' | 'instagram' | 'facebook' | 'linkedin' | 'youtube' | 'twitch' | 'tiktok'

export interface ParsedLink {
  url: string
  type: ContactType | SocialType | 'other'
  label: string
}
