<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-[1400px] mx-auto px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              Creators Dashboard
            </h1>
            <p class="mt-0.5 text-sm text-gray-600">
              Find and connect with content creators
            </p>
          </div>
          <div class="flex items-center gap-3">
            <div class="text-xs text-gray-500">
              {{ resultsCount }} results
            </div>
            <div class="text-2xl">🎮</div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-[1400px] mx-auto px-6 lg:px-8 py-6">
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
      <div v-if="loading" class="flex items-center justify-center py-20 bg-white rounded-lg border border-gray-200">
        <div class="text-center">
          <svg class="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-gray-600 font-medium">Searching creators...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
          <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-red-900 mb-2">Error</h3>
        <p class="text-red-700 mb-4">{{ error }}</p>
        <button
          @click="handleSearch"
          class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>

      <!-- Initial State -->
      <div v-else-if="!hasSearched" class="text-center py-20 bg-white rounded-lg border border-gray-200">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-50 mb-4">
          <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h2 class="text-xl font-bold text-gray-900 mb-2">
          Start Your Search
        </h2>
        <p class="text-gray-600 mb-8 max-w-md mx-auto">
          Enter a game name and filters above to find content creators
        </p>
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-xl mx-auto text-left">
          <h3 class="text-sm font-semibold text-gray-900 mb-3">Popular Games:</h3>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="game in popularGames"
              :key="game"
              class="px-4 py-2 bg-white hover:bg-primary-50 hover:border-primary-300 text-gray-700 hover:text-primary-700 text-sm font-medium rounded-lg border border-gray-200 transition-all"
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
import { ref } from 'vue'
import type { Creator } from '~/types/creator'

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
</script>
