<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">
              Creators Dashboard
            </h1>
            <p class="mt-1 text-sm text-gray-600">
              Find and connect with content creators across YouTube, Twitch, and TikTok
            </p>
          </div>
          <div class="text-right">
            <div class="text-2xl">🎮</div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Sidebar - Filters -->
        <aside class="lg:col-span-1">
          <div class="sticky top-8">
            <CreatorsCreatorFilters
              :filters="filters"
              :loading="loading"
              @search="handleSearch"
              @reset="handleReset"
              @update:filters="(newFilters) => filters = newFilters"
            />
          </div>
        </aside>

        <!-- Main Content Area -->
        <div class="lg:col-span-3">
          <!-- Loading State -->
          <div v-if="loading" class="flex items-center justify-center py-16">
            <UiLoading
              variant="spinner"
              size="lg"
              text="Searching creators..."
              centered
            />
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <div class="text-red-600 text-lg font-semibold mb-2">
              ⚠️ Error
            </div>
            <p class="text-red-700 mb-4">{{ error }}</p>
            <UiButton variant="danger" @click="handleSearch">
              Try Again
            </UiButton>
          </div>

          <!-- Initial State -->
          <div v-else-if="!hasSearched" class="text-center py-16">
            <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-50 mb-6">
              <span class="text-4xl">🔍</span>
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-3">
              Start Your Search
            </h2>
            <p class="text-gray-600 mb-8 max-w-md mx-auto">
              Use the filters on the left to search for content creators by game, language, region, and platform.
            </p>
            <div class="bg-white border border-gray-200 rounded-xl p-6 max-w-md mx-auto text-left">
              <h3 class="font-semibold text-gray-900 mb-3">Popular Games:</h3>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="game in popularGames"
                  :key="game"
                  class="px-3 py-1.5 bg-gray-100 hover:bg-primary-50 hover:text-primary-700 text-gray-700 text-sm rounded-lg transition-colors"
                  @click="quickSearch(game)"
                >
                  {{ game }}
                </button>
              </div>
            </div>
          </div>

          <!-- Results -->
          <div v-else>
            <CreatorsCreatorGrid
              :creators="creators"
              :show-empty="isEmpty"
              @select-creator="openDetailModal"
              @export-csv="exportCSV"
              @export-json="exportJSON"
              @reset="handleReset"
            />
          </div>
        </div>
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
