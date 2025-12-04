<template>
  <div class="min-h-screen bg-dark-bg">
    <!-- Header -->
    <header class="bg-black border-b border-gray-800">
      <div class="max-w-[1400px] mx-auto px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <img src="~/assets/images/exitlag-logo.svg" alt="ExitLag Logo" class="h-8 w-auto">
          <div class="flex items-center gap-6">
            <NuxtLink
              to="/creators"
              class="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Registered Creators
            </NuxtLink>
            <NuxtLink
              to="/register"
              class="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Register Creator
            </NuxtLink>
            <!-- <div class="text-xs text-gray-500">
              {{ resultsCount }} results
            </div> -->
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-[1400px] mx-auto px-6 lg:px-8 py-6">
      <!-- Title Section -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-white">
          Creators Dashboard
        </h1>
        <p class="mt-1 text-sm text-gray-500">
          Find and connect with content creators
        </p>
      </div>

      <!-- Games Journey Card -->
      <div class="mb-6 bg-black rounded-lg border border-gray-800 p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-white">GAMES JOURNEY</h2>
          <div class="flex items-center gap-2 text-xs text-gray-500">
            <span>Timeline by:</span>
            <div class="flex gap-1">
              <button class="px-3 py-1 rounded bg-gray-900 text-gray-400 hover:bg-gray-800 transition-colors">Day</button>
              <button class="px-3 py-1 rounded bg-brand-red text-white">Week</button>
              <button class="px-3 py-1 rounded bg-gray-900 text-gray-400 hover:bg-gray-800 transition-colors">Month</button>
            </div>
          </div>
        </div>
        
        <div class="text-xs text-gray-400 mb-4 uppercase tracking-wider">
          Daily Average Distinct Connected Users*: ExitLag vs Steam
        </div>

        <!-- Loading State -->
        <div v-if="loadingGamesData" class="flex items-center justify-center py-12">
          <div class="text-center">
            <svg class="w-8 h-8 animate-spin text-brand-red mx-auto mb-2" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-sm text-gray-400">Loading games data...</p>
          </div>
        </div>

        <!-- Games Table -->
        <div v-else class="overflow-x-auto">
          <div class="inline-block min-w-full align-middle">
            <!-- Single table with fixed header and footer -->
            <div class="border border-gray-800 rounded-lg overflow-hidden">
              <table class="min-w-full ">
                <!--  -->
                <thead class="border-b border-gray-800">
                  <tr class="text-xs text-gray-400 bg-gray-950">
                    <th colspan="2" class="px-4 py-3 text-center font-semibold uppercase tracking-wider border-r border-gray-800">Week</th>
                    <th colspan="2" v-for="week in weekHeaders" :key="week.date" class="px-4 py-2 text-center font-semibold uppercase tracking-wider border-l border-gray-800" >
                      {{ week.label }}
                    </th>
                  </tr>
                  <tr class="text-xs text-gray-400 bg-gray-950 border-t border-gray-800">
                    <th colspan="2" class="px-4 py-3 text-center font-semibold uppercase tracking-wider border-r border-gray-800 whitespace-nowrap">Top 100 Application</th>
                    <template v-for="week in weekHeaders" :key="'sub-' + week.date">
                      <th class="px-4 py-2 text-center font-medium uppercase tracking-wider border-l border-gray-800">
                        <span class="text-brand-red">Exitlag</span>
                      </th>
                      <th class="px-4 py-2 text-center font-medium uppercase tracking-wider">
                        <span class="text-blue-400">Steam</span>
                      </th>
                    </template>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-800 bg-black ">
                  <tr v-for="(game, index) in topGames" :key="game.name" class="hover:bg-gray-900/50 transition-colors w-full">
                    <td class=" left-0 bg-black hover:bg-gray-900/50 px-4 py-2.5 text-xs text-gray-400 border-r border-gray-800 z-10 text-center ">
                      {{ index + 1 }}
                    </td>
                    <td class=" left-16 bg-black hover:bg-gray-900/50 px-4 py-2.5 text-xs font-medium text-white border-r border-gray-800 z-10 text-center whitespace-nowrap">
                      {{ game.name }}
                    </td>
                    <template v-for="(week, weekIdx) in game.weeklyData" :key="'data-' + week.date">
                      <td :class="['px-4 py-2.5 text-xs text-center font-mono w-24', weekIdx === 0 ? 'border-l border-gray-800' : '']">
                        <span class="text-brand-red">{{ formatNumberAbbreviated(week.exitlag) }}</span>
                      </td>
                      <td class="px-4 py-2.5 text-xs text-center font-mono w-24">
                        <span class="text-blue-400">{{ formatNumberAbbreviated(week.steam) }}</span>
                      </td>
                    </template>
                  </tr>
                </tbody>
               
                <tfoot class="bg-gray-900 border-t-2 border-gray-700">
                  <tr class="font-bold">
                    <td colspan="2" class="bg-gray-900 px-4 py-3 text-xs text-white border-r border-gray-800 text-center" >
                      Total
                    </td>
                    <template v-for="(week, weekIdx) in weekTotals" :key="'total-' + week.date">
                      <td :class="['px-4 py-3 text-xs text-center font-mono', weekIdx === 0 ? 'border-l border-gray-800' : '']">
                        <span class="text-brand-red font-bold">{{ formatNumberAbbreviated(week.exitlag) }}</span>
                      </td>
                      <td class="px-4 py-3 text-xs text-center font-mono">
                        <span class="text-blue-400 font-bold">{{ formatNumberAbbreviated(week.steam) }}</span>
                      </td>
                    </template>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        <p class="text-xs text-gray-500 mt-4 italic">
          Important: For Exitlag, we consider the distinct number of users throughout the entire day. For Steam, we consider the peak concurrent users reached during the day.
        </p>
      </div>

      <!-- Search Bar -->
      <div class="mb-6">
        <CreatorsCreatorFilters
          :filters="filters"
          :loading="loading"
          @search="handleSearch"
          @reset="handleReset"
          @update:filters="(newFilters) => filters = newFilters"
        />
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-20 bg-black rounded-lg border border-gray-800">
        <div class="text-center">
          <svg class="w-12 h-12 animate-spin text-brand-red mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-white font-medium">Searching creators...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-black border border-red-900 rounded-lg p-8 text-center">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-900 mb-4">
          <svg class="w-6 h-6 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-white mb-2">Error</h3>
        <p class="text-gray-400 mb-4">{{ error }}</p>
        <button
          @click="handleSearch"
          class="px-4 py-2 bg-brand-red hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>

      <!-- Initial State -->
      <div v-else-if="!hasSearched" class="text-center py-20 bg-black rounded-lg border border-gray-800">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-900 mb-4">
          <svg class="w-8 h-8 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h2 class="text-xl font-bold text-white mb-2">
          Start Your Search
        </h2>
        <p class="text-gray-500 mb-8 max-w-md mx-auto">
          Enter a game name and filters above to find content creators
        </p>
        <div class="bg-gray-900 border border-gray-800 rounded-lg p-6 max-w-xl mx-auto text-left">
          <h3 class="text-sm font-semibold text-white mb-3">Popular Games:</h3>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="game in popularGames"
              :key="game"
              class="px-4 py-2 bg-black hover:bg-gray-900 hover:border-brand-red text-gray-300 hover:text-brand-red text-sm font-medium rounded-lg border border-gray-800 transition-all"
              @click="quickSearch(game)"
            >
              {{ game }}
            </button>
          </div>
        </div>
      </div>

      <!-- Results Table -->
      <div v-else>
        <CreatorsCreatorTable
          :creators="creators"
          :show-empty="isEmpty"
          @select-creator="openDetailModal"
          @export-csv="exportCSV"
          @export-json="exportJSON"
          @reset="handleReset"
        />
      </div>
    </main>

    <!-- Detail Modal -->
    <CreatorsCreatorDetailModal
      :is-open="isModalOpen"
      :creator="selectedCreator"
      @close="closeDetailModal"
      @mark-contacted="handleMarkContacted"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Creator } from '~/types/creator'

interface WeekData {
  date: string
  exitlag: number
  steam: number
}

interface GameData {
  name: string
  weeklyData: WeekData[]
  totalSteam: number
}

interface TrendData {
  app_name_greenball: string
  date: string
  STEAM_MAX_PLAYER_COUNT: number
  daily_connections: number
  EXITLAG_unique_users: number
}

// Meta tags
useHead({
  title: 'Creators Dashboard - Find Content Creators',
  meta: [
    {
      name: 'description',
      content: 'Internal marketing tool to find and connect with gaming content creators on YouTube, Twitch, and TikTok'
    }
  ]
})

// Composable
const {
  creators,
  loading,
  error,
  hasSearched,
  filters,
  isEmpty,
  resultsCount,
  search,
  reset,
  exportCSV,
  exportJSON,
} = useCreators()

// Local state
const isModalOpen = ref(false)
const selectedCreator = ref<Creator | null>(null)
const loadingGamesData = ref(false)
const topGames = ref<GameData[]>([])
const weekHeaders = ref<{ label: string, date: string }[]>([])

// Computed
const weekTotals = computed(() => {
  if (topGames.value.length === 0) return []
  
  const totals: WeekData[] = []
  const numWeeks = topGames.value[0]?.weeklyData.length || 0
  
  for (let i = 0; i < numWeeks; i++) {
    const weekTotal = {
      date: topGames.value[0].weeklyData[i].date,
      exitlag: 0,
      steam: 0
    }
    
    topGames.value.forEach(game => {
      weekTotal.exitlag += game.weeklyData[i].exitlag
      weekTotal.steam += game.weeklyData[i].steam
    })
    
    totals.push(weekTotal)
  }
  
  return totals
})

// Popular games for quick search
const popularGames = [
  'Valorant',
  'League of Legends',
  'CS2',
  'Fortnite',
  'Apex Legends',
  'Call of Duty',
]

// Methods
const handleSearch = () => {
  search()
}

const handleReset = () => {
  reset()
  closeDetailModal()
}

const quickSearch = (game: string) => {
  filters.value.game = game
  search()
}

const openDetailModal = (creator: Creator) => {
  selectedCreator.value = creator
  isModalOpen.value = true
}

const closeDetailModal = () => {
  isModalOpen.value = false
  selectedCreator.value = null
}

const handleMarkContacted = (creator: Creator) => {
  console.log('Marked as contacted:', creator.name)
  // In a real app, this would update a backend or local storage
}

// Format number helper with thousands separator
const formatNumber = (num: number): string => {
  return num.toLocaleString('en-US')
}

// Format number with abbreviations (K, M)
const formatNumberAbbreviated = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace('.0', '') + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1).replace('.0', '') + 'K'
  }
  return num.toString()
}

// Get week number from date
const getWeekNumber = (dateStr: string): number => {
  const date = new Date(dateStr)
  const startOfYear = new Date(date.getFullYear(), 0, 1)
  const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000))
  return Math.ceil((days + startOfYear.getDay() + 1) / 7)
}

// Load games data from CSV
const loadGamesData = async () => {
  try {
    loadingGamesData.value = true
    
    const response = await fetch('/data/trends.csv')
    if (!response.ok) throw new Error('Failed to load trends data')
    
    const csvText = await response.text()
    const lines = csvText.trim().split('\n')
    
    // Parse CSV
    const trendsData: TrendData[] = lines.slice(1).map(line => {
      const values: string[] = []
      let current = ''
      let inQuotes = false
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i]
        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === ',' && !inQuotes) {
          values.push(current)
          current = ''
        } else {
          current += char
        }
      }
      values.push(current)
      
      return {
        app_name_greenball: values[0],
        date: values[1],
        STEAM_MAX_PLAYER_COUNT: parseInt(values[2]) || 0,
        daily_connections: parseInt(values[3]) || 0,
        EXITLAG_unique_users: parseInt(values[4]) || 0,
      }
    })
    
    // Get last 7 days
    const uniqueDates = [...new Set(trendsData.map(d => d.date))].sort().reverse()
    const last7Days = uniqueDates.slice(0, 7).reverse()
    
    // Filter data for last 7 days
    const filteredData = trendsData.filter(d => last7Days.includes(d.date))
    
    // Group by game
    const gameMap = new Map<string, TrendData[]>()
    filteredData.forEach(item => {
      if (!gameMap.has(item.app_name_greenball)) {
        gameMap.set(item.app_name_greenball, [])
      }
      gameMap.get(item.app_name_greenball)!.push(item)
    })
    
    // Calculate total Steam players for each game and prepare data
    const gamesData: GameData[] = []
    gameMap.forEach((days, gameName) => {
      const weeklyData: WeekData[] = last7Days.map(date => {
        const dayData = days.find(d => d.date === date)
        return {
          date,
          exitlag: dayData?.EXITLAG_unique_users || 0,
          steam: dayData?.STEAM_MAX_PLAYER_COUNT || 0
        }
      })
      
      const totalSteam = weeklyData.reduce((sum, day) => sum + day.steam, 0)
      
      gamesData.push({
        name: gameName,
        weeklyData,
        totalSteam
      })
    })
    
    // Sort by total Steam players and get top 5
    gamesData.sort((a, b) => b.totalSteam - a.totalSteam)
    topGames.value = gamesData.slice(0, 5)
    
    // Set week headers with real week numbers
    weekHeaders.value = last7Days.map((date) => {
      const weekNum = getWeekNumber(date)
      return {
        label: `W${weekNum}`,
        date
      }
    })
    
  } catch (err) {
    console.error('Error loading games data:', err)
  } finally {
    loadingGamesData.value = false
  }
}

// Load data on mount
onMounted(() => {
  loadGamesData()
})
</script>
