import type { ContactType, SocialType, ParsedLink } from '~/types/creator'

/**
 * Format number with K, M, B suffixes
 */
export function formatNumber(num: number | null): string {
  if (num === null) return 'N/A'

  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B'
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

/**
 * Get country flag emoji
 */
export function getCountryFlag(countryCode: string | null): string {
  if (!countryCode) return '🌐'

  const code = countryCode.toUpperCase()
  // Convert country code to flag emoji
  const codePoints = [...code].map(char => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}

/**
 * Get language name from code
 */
export function getLanguageName(languageCode: string | null): string {
  if (!languageCode) return 'Unknown'

  const languages: Record<string, string> = {
    pt: 'Português',
    en: 'English',
    es: 'Español',
    fr: 'Français',
    de: 'Deutsch',
    it: 'Italiano',
    ja: '日本語',
    ko: '한국어',
    zh: '中文',
    ru: 'Русский',
  }

  return languages[languageCode] || languageCode.toUpperCase()
}

/**
 * Parse and categorize a link
 */
export function parseLink(url: string): ParsedLink {
  const urlLower = url.toLowerCase()

  // Contact types
  if (urlLower.includes('mailto:') || urlLower.includes('@')) {
    const email = urlLower.replace('mailto:', '')
    return { url, type: 'email', label: email }
  }
  if (urlLower.includes('wa.me') || urlLower.includes('whatsapp')) {
    return { url, type: 'whatsapp', label: 'WhatsApp' }
  }
  if (urlLower.includes('discord')) {
    return { url, type: 'discord', label: 'Discord' }
  }
  if (urlLower.includes('t.me') || urlLower.includes('telegram')) {
    return { url, type: 'telegram', label: 'Telegram' }
  }

  // Social types
  if (urlLower.includes('twitter.com') || urlLower.includes('x.com')) {
    return { url, type: 'twitter', label: 'Twitter/X' }
  }
  if (urlLower.includes('instagram.com')) {
    return { url, type: 'instagram', label: 'Instagram' }
  }
  if (urlLower.includes('facebook.com')) {
    return { url, type: 'facebook', label: 'Facebook' }
  }
  if (urlLower.includes('linkedin.com')) {
    return { url, type: 'linkedin', label: 'LinkedIn' }
  }
  if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) {
    return { url, type: 'youtube', label: 'YouTube' }
  }
  if (urlLower.includes('twitch.tv')) {
    return { url, type: 'twitch', label: 'Twitch' }
  }
  if (urlLower.includes('tiktok.com')) {
    return { url, type: 'tiktok', label: 'TikTok' }
  }

  // Default
  try {
    const urlObj = new URL(url)
    return { url, type: 'other', label: urlObj.hostname }
  } catch {
    return { url, type: 'other', label: url }
  }
}

/**
 * Extract all unique links from creator accounts
 */
export function extractAllLinks(accounts: any[]): ParsedLink[] {
  const allLinks = new Set<string>()

  accounts.forEach(account => {
    // Add account URL
    allLinks.add(account.url)

    // Add bio links
    account.links?.forEach((link: string) => {
      allLinks.add(link)
    })
  })

  return Array.from(allLinks)
    .map(parseLink)
    .sort((a, b) => {
      // Sort: contacts first, then socials, then others
      const order: Record<string, number> = {
        email: 1,
        whatsapp: 2,
        discord: 3,
        telegram: 4,
        twitter: 5,
        instagram: 6,
        facebook: 7,
        linkedin: 8,
        youtube: 9,
        twitch: 10,
        tiktok: 11,
        other: 12,
      }
      return (order[a.type] || 99) - (order[b.type] || 99)
    })
}

/**
 * Export creators to CSV
 */
export function exportToCSV(creators: any[]): string {
  const headers = [
    'Name',
    'Country',
    'Language',
    'Platforms',
    'Game Tags',
    'Total Followers',
    'YouTube',
    'Twitch',
    'TikTok',
    'Email',
    'Links'
  ]

  const rows = creators.map(creator => {
    const platforms = creator.accounts.map((a: any) => a.platform).join(', ')
    const totalFollowers = creator.accounts.reduce((sum: number, a: any) => sum + (a.followers || 0), 0)

    const youtube = creator.accounts.find((a: any) => a.platform === 'youtube')
    const twitch = creator.accounts.find((a: any) => a.platform === 'twitch')
    const tiktok = creator.accounts.find((a: any) => a.platform === 'tiktok')

    const allLinks = extractAllLinks(creator.accounts)
    const email = allLinks.find(l => l.type === 'email')
    const otherLinks = allLinks.filter(l => l.type !== 'email').map(l => l.url).join('; ')

    return [
      creator.name,
      creator.country || '',
      creator.language || '',
      platforms,
      creator.gameTags.join(', '),
      totalFollowers,
      youtube?.url || '',
      twitch?.url || '',
      tiktok?.url || '',
      email?.url || '',
      otherLinks
    ]
  })

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')

  return csvContent
}

/**
 * Export creators to JSON
 */
export function exportToJSON(creators: any[]): string {
  return JSON.stringify(creators, null, 2)
}

/**
 * Download file helper
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
