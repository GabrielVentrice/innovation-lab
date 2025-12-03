import type { Creator, SearchOptions, CreatorAccount } from '~/types/creator'

// -------------------------------------------------------------
// 0. CONFIGURAÇÕES DE AUTENTICAÇÃO
// -------------------------------------------------------------
const YOUTUBE_API_KEY = "AIzaSyCqNPgSafjt7dVwB7F0BhhZEREAZjlwjHs"
const TWITCH_CLIENT_ID = 'lk2fxmv06r22w5ko03pt18i92i6g6j'
const TWITCH_APP_TOKEN = '28lrwi54tznbx7boforv08qojclv80'
const TIKTOK_ACCESS_TOKEN = "" // deixe vazio se ainda não tiver

// -------------------------------------------------------------
// 1. CONFIGURAÇÃO GLOBAL DE FONTES ATIVAS
// -------------------------------------------------------------
const CREATOR_SOURCES_CONFIG = {
  youtube: true,
  twitch: true,
  tiktok: false, // desativado por padrão
}

// -------------------------------------------------------------
// 2. HELPERS DE TEXTO, LINKS E MATCH
// -------------------------------------------------------------

function extractLinksFromText(text = ""): string[] {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const matches: string[] = []
  let match
  while ((match = urlRegex.exec(text)) !== null) {
    matches.push(match[1])
  }
  return matches
}

function extractEmailsFromText(text = ""): string[] {
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g
  const emails: string[] = []
  let match
  while ((match = emailRegex.exec(text)) !== null) {
    emails.push(match[1])
  }
  return emails
}

function normalizeString(str: string): string {
  return (str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "")
}

function usernamesLookSimilar(a: string, b: string): boolean {
  const na = normalizeString(a)
  const nb = normalizeString(b)
  if (!na || !nb) return false
  if (na === nb) return true
  if (na.includes(nb) || nb.includes(na)) return true
  return false
}

function haveCommonGameTag(a: CreatorAccount, b: CreatorAccount): boolean {
  if (!a.gameTags || !b.gameTags) return false
  return a.gameTags.some(tagA =>
    b.gameTags.some(tagB => normalizeString(tagA) === normalizeString(tagB))
  )
}

function arePossiblySameCreator(a: CreatorAccount, b: CreatorAccount): boolean {
  const linksA = (a.links || []).join(" ").toLowerCase()
  const linksB = (b.links || []).join(" ").toLowerCase()
  const urlA = (a.url || "").toLowerCase()
  const urlB = (b.url || "").toLowerCase()

  if (linksA.includes(urlB) || linksB.includes(urlA)) {
    return true
  }

  if (usernamesLookSimilar(a.username, b.username) && haveCommonGameTag(a, b)) {
    return true
  }

  if (usernamesLookSimilar(a.displayName, b.displayName) && haveCommonGameTag(a, b)) {
    return true
  }

  return false
}

// -------------------------------------------------------------
// 3. YOUTUBE: SEARCH POR JOGO E POR NOME
// -------------------------------------------------------------

async function searchYouTubeByGame({ game, language, region, maxResults = 5 }: { game: string, language?: string, region?: string, maxResults?: number }): Promise<CreatorAccount[]> {
  if (!YOUTUBE_API_KEY) return []

  const query = `${game} ${language || ""}`.trim()

  const searchUrl = new URL("https://www.googleapis.com/youtube/v3/search")
  searchUrl.searchParams.set("part", "snippet")
  searchUrl.searchParams.set("type", "channel")
  searchUrl.searchParams.set("q", query)
  searchUrl.searchParams.set("maxResults", String(maxResults))
  searchUrl.searchParams.set("key", YOUTUBE_API_KEY)
  
  if (region) searchUrl.searchParams.set("regionCode", region)

  const searchRes = await fetch(searchUrl.toString())
  if (!searchRes.ok) {
    console.error("[YouTube search] Erro:", searchRes.status, await searchRes.text())
    return []
  }
  const searchData = await searchRes.json()

  console.log('searchYoutubeByGame', searchData)

  const channelIds =
    (searchData.items || [])
      .map((item: any) => item.snippet && item.snippet.channelId)
      .filter(Boolean) || []
  if (!channelIds.length) return []

  return fetchYouTubeChannelsByIds(channelIds, { game, language })
}

async function searchYouTubeByName(name: string, { game, language, region, maxResults = 5 }: { game: string, language?: string, region?: string, maxResults?: number }): Promise<CreatorAccount[]> {
  if (!YOUTUBE_API_KEY) return []

  const q = name.trim()
  if (!q) return []

  const searchUrl = new URL("https://www.googleapis.com/youtube/v3/search")
  searchUrl.searchParams.set("part", "snippet")
  searchUrl.searchParams.set("type", "channel")
  searchUrl.searchParams.set("q", q)
  searchUrl.searchParams.set("maxResults", String(maxResults))
  searchUrl.searchParams.set("order", "viewCount")
  searchUrl.searchParams.set("key", YOUTUBE_API_KEY)
  if (region) searchUrl.searchParams.set("regionCode", region)

  const res = await fetch(searchUrl.toString())
  if (!res.ok) {
    console.error("[YouTube searchByName] Erro:", res.status, await res.text())
    return []
  }
  const data = await res.json()

  console.log('searchYoutubeByName', data)
  const channelIds =
    (data.items || [])
      .map((item: any) => item.snippet && item.snippet.channelId)
      .filter(Boolean) || []
  if (!channelIds.length) return []

  return fetchYouTubeChannelsByIds(channelIds, { game, language })
}

async function fetchYouTubeChannelsByIds(ids: string[], { game, language }: { game: string, language?: string }): Promise<CreatorAccount[]> {
  const channelsUrl = new URL("https://www.googleapis.com/youtube/v3/channels")
  channelsUrl.searchParams.set("part", "brandingSettings,snippet,statistics,status")
  channelsUrl.searchParams.set("id", ids.join(","))
  channelsUrl.searchParams.set("key", YOUTUBE_API_KEY)

  const channelsRes = await fetch(channelsUrl.toString())
  if (!channelsRes.ok) {
    console.error("[YouTube channels] Erro:", channelsRes.status, await channelsRes.text())
    return []
  }
  const channelsData = await channelsRes.json()

  console.log('fetchYouTubeChannelsByIds', channelsData)
  return (channelsData.items || []).map((ch: any) => {
    const snippet = ch.snippet || {}
    const stats = ch.statistics || {}
    const brandingSettings = ch.brandingSettings || {}
    const channel = brandingSettings.channel || {}
    
    const username =
      (snippet.customUrl || "").replace(/^@/, "") ||
      normalizeString(snippet.title || "") ||
      ch.id

    const bio = snippet.description || ""
    const links = extractLinksFromText(bio)
    const emails = extractEmailsFromText(bio)
    
    // Extract links from brandingSettings
    const brandingLinks: string[] = []
    
    // Get unsubscribed trailer (can contain links)
    if (channel.unsubscribedTrailer) {
      brandingLinks.push(`https://www.youtube.com/watch?v=${channel.unsubscribedTrailer}`)
    }
    
    // Get links from channel keywords/tags
    if (channel.keywords) {
      const keywordLinks = extractLinksFromText(channel.keywords)
      brandingLinks.push(...keywordLinks)
    }
    
    // Get contact links from channel
    if (channel.contactLink) {
      brandingLinks.push(channel.contactLink)
    }
    
    // Check for social links in brandingSettings
    const image = brandingSettings.image || {}
    if (image.bannerExternalUrl) {
      const bannerLinks = extractLinksFromText(image.bannerExternalUrl)
      brandingLinks.push(...bannerLinks)
    }
    
    // Add emails as mailto: links
    const emailLinks = emails.map(email => `mailto:${email}`)
    
    // Combine all links and remove duplicates
    const allLinks = Array.from(new Set([...links, ...brandingLinks, ...emailLinks]))

    return {
      platform: "youtube" as const,
      externalId: ch.id,
      displayName: snippet.title || username,
      username,
      url: `https://www.youtube.com/channel/${ch.id}`,
      country: snippet.country || null,
      language: language || null,
      followers: stats.subscriberCount ? Number(stats.subscriberCount) : null,
      avgViews: null,
      gameTags: [game].filter(Boolean),
      avatarUrl: snippet.thumbnails?.default?.url || null,
      bio,
      links: allLinks
    }
  })
}

// -------------------------------------------------------------
// 4. TWITCH: SEARCH POR JOGO E POR NOME
// -------------------------------------------------------------

async function searchTwitchByGame({ game, language, maxResults = 5 }: { game: string, language?: string, maxResults?: number }): Promise<CreatorAccount[]> {
  if (!TWITCH_CLIENT_ID || !TWITCH_APP_TOKEN) return []

  const url = new URL("https://api.twitch.tv/helix/search/channels")
  url.searchParams.set("query", game)
  url.searchParams.set("first", String(maxResults))

  const res = await fetch(url.toString(), {
    headers: {
      "Client-ID": TWITCH_CLIENT_ID,
      "Authorization": `Bearer ${TWITCH_APP_TOKEN}`
    }
  })

  if (!res.ok) {
    console.error("[Twitch searchByGame] Erro:", res.status, await res.text())
    return []
  }

  const data = await res.json()
  const channels = data.data || []

  const normalized = channels
    .filter((ch: any) => {
      if (language && ch.broadcaster_language) {
        return ch.broadcaster_language.toLowerCase().startsWith(language.toLowerCase())
      }
      return true
    })
    .map((ch: any) => ({
      platform: "twitch" as const,
      externalId: ch.id,
      displayName: ch.display_name,
      username: ch.broadcaster_login,
      url: `https://twitch.tv/${ch.broadcaster_login}`,
      country: null,
      language: ch.broadcaster_language || null,
      followers: null,
      avgViews: null,
      gameTags: ch.game_name ? [ch.game_name] : [],
      avatarUrl: ch.thumbnail_url || null,
      bio: "",
      links: []
    }))

  normalized.forEach((acc: CreatorAccount) => {
    if (!acc.gameTags.length && game) {
      acc.gameTags = [game]
    }
  })

  return normalized
}

async function searchTwitchByName(name: string, { game, language, maxResults = 5 }: { game: string, language?: string, maxResults?: number }): Promise<CreatorAccount[]> {
  if (!TWITCH_CLIENT_ID || !TWITCH_APP_TOKEN) return []

  const q = name.trim()
  if (!q) return []

  const url = new URL("https://api.twitch.tv/helix/search/channels")
  url.searchParams.set("query", q)
  url.searchParams.set("first", String(maxResults))

  const res = await fetch(url.toString(), {
    headers: {
      "Client-ID": TWITCH_CLIENT_ID,
      "Authorization": `Bearer ${TWITCH_APP_TOKEN}`
    }
  })

  if (!res.ok) {
    console.error("[Twitch searchByName] Erro:", res.status, await res.text())
    return []
  }

  const data = await res.json()
  const channels = data.data || []

  const normalized = channels
    .filter((ch: any) => {
      if (language && ch.broadcaster_language) {
        return ch.broadcaster_language.toLowerCase().startsWith(language.toLowerCase())
      }
      return true
    })
    .map((ch: any) => ({
      platform: "twitch" as const,
      externalId: ch.id,
      displayName: ch.display_name,
      username: ch.broadcaster_login,
      url: `https://twitch.tv/${ch.broadcaster_login}`,
      country: null,
      language: ch.broadcaster_language || null,
      followers: null,
      avgViews: null,
      gameTags: ch.game_name ? [ch.game_name] : [game].filter(Boolean),
      avatarUrl: ch.thumbnail_url || null,
      bio: "",
      links: []
    }))

  return normalized
}

// -------------------------------------------------------------
// 5. TIKTOK: SEARCH POR JOGO E POR NOME (PLACEHOLDER)
// -------------------------------------------------------------

async function searchTikTokByGame({ game, language, region, maxResults = 5 }: { game: string, language?: string, region?: string, maxResults?: number }): Promise<CreatorAccount[]> {
  if (!TIKTOK_ACCESS_TOKEN) return []

  const tag = game.replace(/\s+/g, "")
  const url = new URL("https://open.tiktokapis.com/v2/placeholder/search")
  url.searchParams.set("query", "#" + tag)
  url.searchParams.set("limit", String(maxResults))

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${TIKTOK_ACCESS_TOKEN}`
    }
  })

  if (!res.ok) {
    console.error("[TikTok searchByGame] Erro (ajuste endpoint real):", res.status, await res.text())
    return []
  }

  const data = await res.json()
  return normalizeTikTokVideos(data.videos || [], { game, language, region })
}

async function searchTikTokByName(name: string, { game, language, region, maxResults = 5 }: { game: string, language?: string, region?: string, maxResults?: number }): Promise<CreatorAccount[]> {
  if (!TIKTOK_ACCESS_TOKEN) return []

  const q = name.trim()
  if (!q) return []

  const url = new URL("https://open.tiktokapis.com/v2/placeholder/searchUser")
  url.searchParams.set("query", q)
  url.searchParams.set("limit", String(maxResults))

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${TIKTOK_ACCESS_TOKEN}`
    }
  })

  if (!res.ok) {
    console.error("[TikTok searchByName] Erro (ajuste endpoint real):", res.status, await res.text())
    return []
  }

  const data = await res.json()
  const videos = data.videos || []
  return normalizeTikTokVideos(videos, { game, language, region })
}

function normalizeTikTokVideos(videos: any[], { game, language, region }: { game: string, language?: string, region?: string }): CreatorAccount[] {
  const byUser = new Map()

  for (const vid of videos) {
    const author = vid.author || {}
    const id = author.id || author.sec_uid
    if (!id) continue

    if (region && author.region && author.region !== region) {
      continue
    }

    const existing = byUser.get(id)
    const followers = author.follower_count || null
    const views = vid.play_count || null

    if (!existing) {
      byUser.set(id, {
        platform: "tiktok" as const,
        externalId: id,
        displayName: author.nickname || author.unique_id || "",
        username: author.unique_id || "",
        url: `https://www.tiktok.com/@${author.unique_id}`,
        country: author.region || null,
        language: language || null,
        followers,
        avgViews: views,
        gameTags: [game].filter(Boolean),
        avatarUrl: author.avatar_url || null,
        bio: author.signature || "",
        links: extractLinksFromText(author.signature || "")
      })
    } else {
      if (views != null) {
        if (existing.avgViews == null) {
          existing.avgViews = views
        } else {
          existing.avgViews = (existing.avgViews + views) / 2
        }
      }
      if (game && !existing.gameTags.includes(game)) {
        existing.gameTags.push(game)
      }
    }
  }

  return Array.from(byUser.values())
}

// -------------------------------------------------------------
// 6. ENRIQUECER COM TWITCH A PARTIR DOS LINKS DAS BIOS
// -------------------------------------------------------------

async function fetchTwitchUsersByLogins(logins: string[]): Promise<any[]> {
  if (!TWITCH_CLIENT_ID || !TWITCH_APP_TOKEN) return []

  const chunks = []
  const uniqueLogins = Array.from(new Set(logins.map(l => l.toLowerCase())))
  const size = 50
  for (let i = 0; i < uniqueLogins.length; i += size) {
    chunks.push(uniqueLogins.slice(i, i + size))
  }

  const results = []

  for (const chunk of chunks) {
    const url = new URL("https://api.twitch.tv/helix/users")
    chunk.forEach(login => url.searchParams.append("login", login))

    const res = await fetch(url.toString(), {
      headers: {
        "Client-ID": TWITCH_CLIENT_ID,
        "Authorization": `Bearer ${TWITCH_APP_TOKEN}`
      }
    })

    if (!res.ok) {
      console.error("[Twitch users] Erro:", res.status, await res.text())
      continue
    }

    const data = await res.json()
    if (data.data) {
      results.push(...data.data)
    }
  }

  return results
}

async function enrichWithTwitchFromLinks(accounts: CreatorAccount[], { language }: { language?: string }): Promise<CreatorAccount[]> {
  if (!TWITCH_CLIENT_ID || !TWITCH_APP_TOKEN) return []

  const twitchRegex = /twitch\.tv\/([A-Za-z0-9_]+)/i

  const loginToGameTags = new Map<string, Set<string>>()

  for (const acc of accounts) {
    const links = acc.links || []
    for (const link of links) {
      const m = link.match(twitchRegex)
      if (m && m[1]) {
        const login = m[1].toLowerCase()
        if (!loginToGameTags.has(login)) {
          loginToGameTags.set(login, new Set())
        }
        const set = loginToGameTags.get(login)!
        ;(acc.gameTags || []).forEach(tag => set.add(tag))
      }
    }
  }

  if (!loginToGameTags.size) return []

  const logins = Array.from(loginToGameTags.keys())
  const twitchUsers = await fetchTwitchUsersByLogins(logins)

  const accountsFromLinks = twitchUsers.map(user => {
    const login = user.login.toLowerCase()
    const gameTagsSet = loginToGameTags.get(login) || new Set()
    const gameTags = Array.from(gameTagsSet)

    return {
      platform: "twitch" as const,
      externalId: user.id,
      displayName: user.display_name || user.login,
      username: user.login,
      url: `https://twitch.tv/${user.login}`,
      country: null,
      language: language || null,
      followers: null,
      avgViews: null,
      gameTags,
      avatarUrl: user.profile_image_url || null,
      bio: user.description || "",
      links: []
    }
  })

  return accountsFromLinks
}

// -------------------------------------------------------------
// 7. CROSS-SEARCH ENTRE PLATAFORMAS
// -------------------------------------------------------------

async function crossSearchAllPlatforms(primaryAccounts: CreatorAccount[], { game, language, region, sources }: { game: string, language?: string, region?: string, sources: any }): Promise<CreatorAccount[]> {
  const seedsForYouTube = new Set<string>()
  const seedsForTwitch = new Set<string>()
  const seedsForTikTok = new Set<string>()

  for (const acc of primaryAccounts) {
    const nameCandidates = [
      acc.displayName,
      acc.username
    ].filter(Boolean)

    const limited = nameCandidates.slice(0, 2)

    if (acc.platform !== "youtube") {
      limited.forEach(n => seedsForYouTube.add(n))
    }
    if (acc.platform !== "twitch") {
      limited.forEach(n => seedsForTwitch.add(n))
    }
    if (acc.platform !== "tiktok") {
      limited.forEach(n => seedsForTikTok.add(n))
    }
  }

  const results: CreatorAccount[] = []

  if (sources.youtube && YOUTUBE_API_KEY) {
    const seedArray = Array.from(seedsForYouTube).slice(0, 20)
    for (const name of seedArray) {
      const res = await searchYouTubeByName(name, { game, language, region, maxResults: 3 })
      results.push(...res)
    }
  }

  if (sources.twitch && TWITCH_CLIENT_ID && TWITCH_APP_TOKEN) {
    const seedArray = Array.from(seedsForTwitch).slice(0, 20)
    for (const name of seedArray) {
      const res = await searchTwitchByName(name, { game, language, maxResults: 3 })
      results.push(...res)
    }
  }

  if (sources.tiktok && TIKTOK_ACCESS_TOKEN) {
    const seedArray = Array.from(seedsForTikTok).slice(0, 20)
    for (const name of seedArray) {
      const res = await searchTikTokByName(name, { game, language, region, maxResults: 3 })
      results.push(...res)
    }
  }

  const map = new Map()
  for (const acc of results) {
    const key = `${acc.platform}:${acc.externalId}`
    if (!map.has(key)) {
      map.set(key, acc)
    }
  }

  return Array.from(map.values())
}

// -------------------------------------------------------------
// 8. MERGE DE CONTAS EM CRIADORES
// -------------------------------------------------------------

function mergeAccountsIntoCreators(accounts: CreatorAccount[]): Creator[] {
  const creators: Creator[] = []

  for (const acc of accounts) {
    let matchedCreator: Creator | null = null

    for (const creator of creators) {
      const hasMatch = creator.accounts.some(existingAcc =>
        arePossiblySameCreator(existingAcc, acc)
      )
      if (hasMatch) {
        matchedCreator = creator
        break
      }
    }

    if (matchedCreator) {
      matchedCreator.accounts.push(acc)

      if (!matchedCreator.language && acc.language) {
        matchedCreator.language = acc.language
      }
      if (!matchedCreator.country && acc.country) {
        matchedCreator.country = acc.country
      }

      const allTags = new Set([
        ...(matchedCreator.gameTags || []),
        ...(acc.gameTags || [])
      ])
      matchedCreator.gameTags = Array.from(allTags)
    } else {
      creators.push({
        id: `creator_${creators.length + 1}`,
        name: acc.displayName || acc.username,
        language: acc.language || null,
        country: acc.country || null,
        gameTags: [...(acc.gameTags || [])],
        accounts: [acc]
      })
    }
  }

  return creators
}

// -------------------------------------------------------------
// 9. VIEW "SHORT" PARA MARKETING
// -------------------------------------------------------------

function buildShortView(creators: Creator[]): any[] {
  return creators.map(creator => {
    const platforms = Array.from(
      new Set(creator.accounts.map(acc => acc.platform))
    )

    const allLinksSet = new Set<string>()
    for (const acc of creator.accounts) {
      if (acc.url) allLinksSet.add(acc.url)
      ;(acc.links || []).forEach(l => allLinksSet.add(l))
    }
    const allLinks = Array.from(allLinksSet)

    const socialDomains = [
      "youtube.com", "youtu.be",
      "twitch.tv",
      "tiktok.com",
      "instagram.com", "instagram.co",
      "facebook.com",
      "kick.com",
      "x.com", "twitter.com",
      "trovo.live"
    ]

    const contactPatterns = [
      "mailto:",
      "wa.me/",
      "api.whatsapp.com",
      "web.whatsapp.com",
      "discord.gg/",
      "discord.com/invite",
      "t.me/"
    ]

    const socialLinks: string[] = []
    const contactLinks: string[] = []

    for (const link of allLinks) {
      let urlHost = ""
      try {
        const u = new URL(link)
        urlHost = u.hostname.toLowerCase()
      } catch {
        // ignore parse error
      }

      const isSocial = socialDomains.some(d => urlHost.includes(d))
      const isContact =
        contactPatterns.some(p => link.toLowerCase().includes(p)) ||
        link.toLowerCase().includes("mailto:")

      if (isContact) {
        contactLinks.push(link)
      } else if (isSocial) {
        socialLinks.push(link)
      }
    }

    return {
      id: creator.id,
      name: creator.name,
      platforms,
      gameTags: creator.gameTags,
      country: creator.country,
      language: creator.language,
      socialLinks,
      contactLinks
    }
  })
}

// -------------------------------------------------------------
// 10. FUNÇÃO PRINCIPAL
// -------------------------------------------------------------

/**
 * Search for content creators across platforms
 *
 * @param options - Search filters
 * @returns Promise resolving to an array of creators
 */
export async function searchCreators(options: SearchOptions): Promise<Creator[]> {
  const {
    game,
    language,
    region
  } = options || {}

  if (!game) {
    throw new Error("Parâmetro 'game' é obrigatório.")
  }

  // Define quais fontes usar - todas as plataformas ativas
  const sources = {
    youtube: CREATOR_SOURCES_CONFIG.youtube,
    twitch: CREATOR_SOURCES_CONFIG.twitch,
    tiktok: CREATOR_SOURCES_CONFIG.tiktok
  }

  // 1) BUSCA PRIMÁRIA APENAS NO YOUTUBE
  let primaryAccounts: CreatorAccount[] = []
  
  if (sources.youtube) {
    primaryAccounts = await searchYouTubeByGame({ game, language, region, maxResults: 5 })
  }

  // Se não tiver YouTube ativo ou não encontrou nada, retorna vazio
  if (!primaryAccounts.length) {
    return []
  }

  // 2) CROSS-SEARCH: USA OS RESULTADOS DO YOUTUBE PARA BUSCAR NAS OUTRAS PLATAFORMAS
  const crossAccounts = await crossSearchAllPlatforms(primaryAccounts, {
    game,
    language,
    region,
    sources
  })

  let allAccounts = [...primaryAccounts, ...crossAccounts]

  // 3) ENRIQUECER COM TWITCH USANDO LINKS NAS BIOS
  if (sources.twitch) {
    const twitchFromLinks = await enrichWithTwitchFromLinks(allAccounts, { language })
    allAccounts = [...allAccounts, ...twitchFromLinks]
  }

  // 4) TIRAR DUPLICADOS POR (platform+externalId)
  const dedupMap = new Map()
  for (const acc of allAccounts) {
    const key = `${acc.platform}:${acc.externalId}`
    if (!dedupMap.has(key)) {
      dedupMap.set(key, acc)
    }
  }
  const dedupAccounts = Array.from(dedupMap.values())

  // 5) MERGE EM CRIADORES
  const creators = mergeAccountsIntoCreators(dedupAccounts)

  return creators
}
