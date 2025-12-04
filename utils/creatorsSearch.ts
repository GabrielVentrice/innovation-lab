import type { Creator, SearchOptions, CreatorAccount } from '~/types/creator'

// -------------------------------------------------------------
// 0. CONFIGURAÇÕES DE AUTENTICAÇÃO
// -------------------------------------------------------------
const YOUTUBE_API_KEY = "AIzaSyAquf8u5MQJh4DpARpSemmtMczvC9Hw-1A"
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

async function fetchYouTubeRecentVideosAvgViews(channelId: string): Promise<number | null> {
  if (!YOUTUBE_API_KEY) return null

  try {
    // Search for recent videos from this channel (no date restriction)
    const searchUrl = new URL("https://www.googleapis.com/youtube/v3/search")
    searchUrl.searchParams.set("part", "id")
    searchUrl.searchParams.set("channelId", channelId)
    searchUrl.searchParams.set("type", "video")
    searchUrl.searchParams.set("order", "date")
    searchUrl.searchParams.set("maxResults", "10")
    searchUrl.searchParams.set("key", YOUTUBE_API_KEY)

    const searchRes = await fetch(searchUrl.toString())
    if (!searchRes.ok) {
      console.error("[YouTube video search] Erro:", searchRes.status, await searchRes.text())
      return null
    }
    const searchData = await searchRes.json()

    const videoIds = (searchData.items || [])
      .map((item: any) => item.id && item.id.videoId)
      .filter(Boolean)

    if (!videoIds.length) return null

    // Get video statistics
    const videosUrl = new URL("https://www.googleapis.com/youtube/v3/videos")
    videosUrl.searchParams.set("part", "statistics")
    videosUrl.searchParams.set("id", videoIds.join(","))
    videosUrl.searchParams.set("key", YOUTUBE_API_KEY)

    const videosRes = await fetch(videosUrl.toString())
    if (!videosRes.ok) {
      console.error("[YouTube videos] Erro:", videosRes.status, await videosRes.text())
      return null
    }
    const videosData = await videosRes.json()

    // Calculate average views
    const videos = videosData.items || []
    if (!videos.length) return null

    const totalViews = videos.reduce((sum: number, video: any) => {
      const viewCount = video.statistics?.viewCount ? Number(video.statistics.viewCount) : 0
      return sum + viewCount
    }, 0)

    const avgViews = Math.round(totalViews / videos.length)
    return avgViews
  } catch (err) {
    console.error("[YouTube avgViews] Erro:", err)
    return null
  }
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
  
  // Process channels and fetch avg views in parallel
  const channelPromises = (channelsData.items || []).map(async (ch: any) => {
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

    // Fetch average views from recent videos (last 30 days)
    const avgViews = await fetchYouTubeRecentVideosAvgViews(ch.id)

    return {
      platform: "youtube" as const,
      externalId: ch.id,
      displayName: snippet.title || username,
      username,
      url: `https://www.youtube.com/channel/${ch.id}`,
      country: snippet.country || null,
      language: language || null,
      followers: stats.subscriberCount ? Number(stats.subscriberCount) : null,
      avgViews,
      gameTags: [game].filter(Boolean),
      avatarUrl: snippet.thumbnails?.default?.url || null,
      bio,
      links: allLinks
    }
  })

  return Promise.all(channelPromises)
}

// -------------------------------------------------------------
// 4. TWITCH: SEARCH POR JOGO E POR NOME
// -------------------------------------------------------------

async function enrichTwitchChannelData(channelIds: string[]): Promise<Map<string, { followers: number, avgViews: number }>> {
  if (!TWITCH_CLIENT_ID || !TWITCH_APP_TOKEN || !channelIds.length) return new Map()

  // Get user info (includes follower count)
  const usersUrl = new URL("https://api.twitch.tv/helix/users")
  channelIds.forEach(id => usersUrl.searchParams.append("id", id))

  const usersRes = await fetch(usersUrl.toString(), {
    headers: {
      "Client-ID": TWITCH_CLIENT_ID,
      "Authorization": `Bearer ${TWITCH_APP_TOKEN}`
    }
  })

  if (!usersRes.ok) {
    console.error("[Twitch enrichment - users] Erro:", usersRes.status, await usersRes.text())
    return new Map()
  }

  const usersData = await usersRes.json()
  const enrichmentMap = new Map<string, { followers: number, avgViews: number }>()

  // Get follower count and view count for each channel
  for (const user of usersData.data || []) {
    const followersUrl = new URL("https://api.twitch.tv/helix/channels/followers")
    followersUrl.searchParams.set("broadcaster_id", user.id)

    const followersRes = await fetch(followersUrl.toString(), {
      headers: {
        "Client-ID": TWITCH_CLIENT_ID,
        "Authorization": `Bearer ${TWITCH_APP_TOKEN}`
      }
    })

    let followers = 0
    if (followersRes.ok) {
      const followersData = await followersRes.json()
      followers = followersData.total || 0
    }

    enrichmentMap.set(user.id, {
      followers,
      avgViews: user.view_count || 0
    })
  }

  return enrichmentMap
}

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

  const filtered = channels.filter((ch: any) => {
    if (language && ch.broadcaster_language) {
      return ch.broadcaster_language.toLowerCase().startsWith(language.toLowerCase())
    }
    return true
  })

  // Enrich with follower and view data
  const channelIds = filtered.map((ch: any) => ch.id)
  const enrichmentData = await enrichTwitchChannelData(channelIds)

  const normalized = filtered.map((ch: any) => {
    const enrichment = enrichmentData.get(ch.id) || { followers: 0, avgViews: 0 }
    return {
      platform: "twitch" as const,
      externalId: ch.id,
      displayName: ch.display_name,
      username: ch.broadcaster_login,
      url: `https://twitch.tv/${ch.broadcaster_login}`,
      country: null,
      language: ch.broadcaster_language || null,
      followers: enrichment.followers,
      avgViews: enrichment.avgViews,
      gameTags: ch.game_name ? [ch.game_name] : [],
      avatarUrl: ch.thumbnail_url || null,
      bio: "",
      links: []
    }
  })

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

  const filtered = channels.filter((ch: any) => {
    if (language && ch.broadcaster_language) {
      return ch.broadcaster_language.toLowerCase().startsWith(language.toLowerCase())
    }
    return true
  })

  // Enrich with follower and view data
  const channelIds = filtered.map((ch: any) => ch.id)
  const enrichmentData = await enrichTwitchChannelData(channelIds)

  const normalized = filtered.map((ch: any) => {
    const enrichment = enrichmentData.get(ch.id) || { followers: 0, avgViews: 0 }
    return {
      platform: "twitch" as const,
      externalId: ch.id,
      displayName: ch.display_name,
      username: ch.broadcaster_login,
      url: `https://twitch.tv/${ch.broadcaster_login}`,
      country: null,
      language: ch.broadcaster_language || null,
      followers: enrichment.followers,
      avgViews: enrichment.avgViews,
      gameTags: ch.game_name ? [ch.game_name] : [game].filter(Boolean),
      avatarUrl: ch.thumbnail_url || null,
      bio: "",
      links: []
    }
  })

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

  if (!region) {
    throw new Error("Parâmetro 'region' é obrigatório.")
  }

  // 1) BUSCA PRIMÁRIA APENAS NO YOUTUBE COM FILTRO DE REGIÃO OBRIGATÓRIO
  const youtubeAccounts = await searchYouTubeByGame({ 
    game, 
    language, 
    region, 
    maxResults: 50 
  })

  // Se não encontrou nada no YouTube, retorna vazio
  if (!youtubeAccounts.length) {
    return []
  }

  // 2) FILTRAR: GARANTIR QUE APENAS CANAIS DA REGIÃO SOLICITADA SEJAM RETORNADOS
  const filteredYoutubeAccounts = youtubeAccounts.filter(acc => {
    // Se o canal tem country definido, deve ser da região solicitada
    if (acc.country) {
      return acc.country.toUpperCase() === region.toUpperCase()
    }
    // Se não tem country, mantém (a API do YouTube já filtrou)
    return true
  })

  if (!filteredYoutubeAccounts.length) {
    return []
  }

  // 3) PARA CADA CANAL DO YOUTUBE, VERIFICAR SE TEM TWITCH
  const youtubeToTwitchMap = new Map<string, CreatorAccount>() // youtubeChannelId -> twitchAccount
  
  if (TWITCH_CLIENT_ID && TWITCH_APP_TOKEN) {
    const twitchRegex = /twitch\.tv\/([A-Za-z0-9_]+)/i
    const twitchLoginsFromLinks = new Map<string, string[]>() // login -> [youtubeChannelId]
    const youtubeAccountsWithoutTwitch: CreatorAccount[] = []

    // Primeira passagem: buscar links de Twitch nas bios
    for (const ytAcc of filteredYoutubeAccounts) {
      const links = ytAcc.links || []
      let foundTwitchLink = false
      
      for (const link of links) {
        const m = link.match(twitchRegex)
        if (m && m[1]) {
          const login = m[1].toLowerCase()
          if (!twitchLoginsFromLinks.has(login)) {
            twitchLoginsFromLinks.set(login, [])
          }
          twitchLoginsFromLinks.get(login)!.push(ytAcc.externalId)
          foundTwitchLink = true
        }
      }
      
      // Se não encontrou link, adiciona para busca por nome
      if (!foundTwitchLink) {
        youtubeAccountsWithoutTwitch.push(ytAcc)
      }
    }

    // Buscar contas Twitch que têm links nas bios
    if (twitchLoginsFromLinks.size > 0) {
      const logins = Array.from(twitchLoginsFromLinks.keys())
      const twitchUsers = await fetchTwitchUsersByLogins(logins)

      // Enriquecer dados dos usuários Twitch encontrados
      const twitchUserIds = twitchUsers.map(u => u.id)
      const enrichmentData = await enrichTwitchChannelData(twitchUserIds)

      for (const user of twitchUsers) {
        const login = user.login.toLowerCase()
        const youtubeChannelIds = twitchLoginsFromLinks.get(login) || []
        const enrichment = enrichmentData.get(user.id) || { followers: 0, avgViews: 0 }
        
        for (const ytId of youtubeChannelIds) {
          const ytAcc = filteredYoutubeAccounts.find(a => a.externalId === ytId)
          if (ytAcc) {
            youtubeToTwitchMap.set(ytId, {
              platform: "twitch" as const,
              externalId: user.id,
              displayName: user.display_name || user.login,
              username: user.login,
              url: `https://twitch.tv/${user.login}`,
              country: null,
              language: language || null,
              followers: enrichment.followers,
              avgViews: enrichment.avgViews,
              gameTags: [...(ytAcc.gameTags || [])],
              avatarUrl: user.profile_image_url || null,
              bio: user.description || "",
              links: []
            })
          }
        }
      }
    }

    // Segunda passagem: para canais sem link, buscar por nome no Twitch
    for (const ytAcc of youtubeAccountsWithoutTwitch) {
      const searchNames = [
        ytAcc.username,
        ytAcc.displayName,
        normalizeString(ytAcc.username),
        normalizeString(ytAcc.displayName)
      ].filter(Boolean)

      // Tentar cada variação do nome
      for (const searchName of searchNames) {
        if (!searchName || youtubeToTwitchMap.has(ytAcc.externalId)) break

        const twitchResults = await searchTwitchByName(searchName, { 
          game, 
          language, 
          maxResults: 3 
        })

        // Verificar se algum resultado parece ser o mesmo usuário
        for (const twitchAcc of twitchResults) {
          const isSimilar = 
            usernamesLookSimilar(ytAcc.username, twitchAcc.username) ||
            usernamesLookSimilar(ytAcc.displayName, twitchAcc.displayName) ||
            usernamesLookSimilar(ytAcc.username, twitchAcc.displayName) ||
            usernamesLookSimilar(ytAcc.displayName, twitchAcc.username)

          if (isSimilar) {
            // Atualizar gameTags do Twitch com as do YouTube
            twitchAcc.gameTags = [...(ytAcc.gameTags || [])]
            // Os dados já vêm enriquecidos da função searchTwitchByName
            youtubeToTwitchMap.set(ytAcc.externalId, twitchAcc)
            break
          }
        }

        // Se encontrou, não precisa tentar outras variações
        if (youtubeToTwitchMap.has(ytAcc.externalId)) break
      }
    }
  }

  // 4) CRIAR UM CREATOR PARA CADA CANAL DO YOUTUBE (SEM MERGE)
  const creators: Creator[] = filteredYoutubeAccounts.map((ytAcc, index) => {
    const accounts: CreatorAccount[] = [ytAcc]

    // Verificar se tem Twitch associado
    const twitchAcc = youtubeToTwitchMap.get(ytAcc.externalId)
    if (twitchAcc) {
      accounts.push(twitchAcc)
    }

    return {
      id: `creator_${index + 1}`,
      name: ytAcc.displayName || ytAcc.username,
      language: ytAcc.language || null,
      country: ytAcc.country || null,
      gameTags: [...(ytAcc.gameTags || [])],
      accounts
    }
  })

  return creators
}
