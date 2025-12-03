<template>
  <div>
    <!-- Header with count and actions -->
    <div v-if="creators.length > 0" class="flex items-center justify-between mb-4">
      <div class="text-sm text-gray-500">
        <span class="font-semibold text-white">{{ creators.length }}</span>
        {{ creators.length === 1 ? 'creator' : 'creators' }} found
      </div>

      <div class="flex gap-2">
        <button
          @click="$emit('export-csv')"
          class="px-4 py-2 text-sm font-medium text-white bg-gray-900 border border-gray-800 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export CSV
        </button>
        <button
          @click="$emit('export-json')"
          class="px-4 py-2 text-sm font-medium text-white bg-gray-900 border border-gray-800 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export JSON
        </button>
      </div>
    </div>

    <!-- Table -->
    <div v-if="creators.length > 0" class="bg-black rounded-lg border border-gray-800 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-900 border-b border-gray-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                Creator
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                Platforms
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                Games
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                Location
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-200 uppercase tracking-wider">
                Followers
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-200 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="creator in creators"
              :key="creator.id"
              @click="$emit('select-creator', creator)"
              class="hover:bg-gray-900 cursor-pointer transition-colors border-b border-gray-800 last:border-0"
            >
              <!-- Creator Info -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <img
                      v-if="getCreatorAvatar(creator)"
                      :src="getCreatorAvatar(creator)"
                      :alt="creator.name"
                      class="h-10 w-10 rounded-full object-cover"
                    />
                    <div v-else class="h-10 w-10 rounded-full bg-primary-50 flex items-center justify-center">
                      <span class="text-brand-red font-semibold text-sm">
                        {{ creator.name.charAt(0).toUpperCase() }}
                      </span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-white">
                      {{ creator.name }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ creator.accounts.length }} {{ creator.accounts.length === 1 ? 'account' : 'accounts' }}
                    </div>
                  </div>
                </div>
              </td>

              <!-- Platforms -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex gap-2">
                  <span
                    v-for="platform in getUniquePlatforms(creator)"
                    :key="platform"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="getPlatformBadgeClass(platform)"
                  >
                    {{ platform }}
                  </span>
                </div>
              </td>

              <!-- Games -->
              <td class="px-6 py-4">
                <div class="flex flex-wrap gap-1 max-w-xs">
                  <span
                    v-for="(game, index) in creator.gameTags.slice(0, 3)"
                    :key="index"
                    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700"
                  >
                    {{ game }}
                  </span>
                  <span
                    v-if="creator.gameTags.length > 3"
                    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500"
                  >
                    +{{ creator.gameTags.length - 3 }}
                  </span>
                </div>
              </td>

              <!-- Location -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-white">
                  {{ creator.country || '-' }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ creator.language || '-' }}
                </div>
              </td>

              <!-- Followers -->
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <div class="text-sm font-medium text-white">
                  {{ formatFollowers(getTotalFollowers(creator)) }}
                </div>
                <div class="text-xs text-gray-500">
                  total followers
                </div>
              </td>

              <!-- Actions -->
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click.stop="$emit('select-creator', creator)"
                  class="text-brand-red hover:text-primary-700 font-medium transition-colors"
                >
                  View Details
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="showEmpty" class="text-center py-16 bg-black rounded-lg border border-gray-800">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-900 mb-4">
        <svg class="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-white mb-2">
        No creators found
      </h3>
      <p class="text-gray-500 mb-6">
        Try adjusting your filters or search for a different game
      </p>
      <button
        @click="$emit('reset')"
        class="px-4 py-2 bg-brand-red hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
      >
        Reset Filters
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Creator, Platform } from '~/types/creator'

interface Props {
  creators: Creator[]
  showEmpty?: boolean
}

defineProps<Props>()

defineEmits<{
  'select-creator': [creator: Creator]
  'export-csv': []
  'export-json': []
  reset: []
}>()

// Helper functions
const getCreatorAvatar = (creator: Creator): string | undefined => {
  const accountWithAvatar = creator.accounts.find(acc => acc.avatarUrl)
  return accountWithAvatar?.avatarUrl || undefined
}

const getUniquePlatforms = (creator: Creator): Platform[] => {
  const platforms = new Set(creator.accounts.map(acc => acc.platform))
  return Array.from(platforms)
}

const getPlatformBadgeClass = (platform: Platform): string => {
  const classes = {
    youtube: 'bg-red-100 text-red-800',
    twitch: 'bg-purple-100 text-purple-800',
    tiktok: 'bg-pink-100 text-pink-800',
  }
  return classes[platform] || 'bg-gray-100 text-gray-800'
}

const getTotalFollowers = (creator: Creator): number => {
  return creator.accounts.reduce((sum, acc) => sum + (acc.followers || 0), 0)
}

const formatFollowers = (count: number): string => {
  if (count === 0) return '-'
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  }
  return count.toString()
}
</script>
