<template>
  <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
    <form @submit.prevent="handleSubmit" class="p-6">
      <div class="flex flex-col lg:flex-row gap-4 items-end">
        <!-- Game Input (Required) -->
        <div class="flex-1 min-w-[200px]">
          <label class="block text-sm font-medium text-gray-700 mb-1.5">
            Game *
          </label>
          <input
            v-model="localFilters.game"
            type="text"
            placeholder="e.g., Valorant, League of Legends, CS2"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            :class="{ 'border-red-500': errors.game }"
            required
          />
          <p v-if="errors.game" class="mt-1 text-sm text-red-600">{{ errors.game }}</p>
        </div>

        <!-- Language Input -->
        <div class="flex-1 min-w-[180px]">
          <label class="block text-sm font-medium text-gray-700 mb-1.5">
            Language
          </label>
          <input
            v-model="localFilters.language"
            type="text"
            placeholder="e.g., pt, en, es"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>

        <!-- Region Select -->
        <div class="flex-1 min-w-[180px]">
          <label class="block text-sm font-medium text-gray-700 mb-1.5">
            Region
          </label>
          <select
            v-model="localFilters.region"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white"
          >
            <option :value="undefined">All regions</option>
            <option v-for="option in regionOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>

        <!-- View Mode Toggle -->
        <div class="flex-shrink-0">
          <label class="block text-sm font-medium text-gray-700 mb-1.5">
            View Mode
          </label>
          <div class="flex gap-1 border border-gray-300 rounded-lg p-1 bg-gray-50">
            <button
              v-for="mode in viewModes"
              :key="mode.value"
              type="button"
              :class="viewModeButtonClasses(mode.value)"
              @click="localFilters.viewMode = mode.value"
            >
              {{ mode.label }}
            </button>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-2 flex-shrink-0">
          <button
            type="submit"
            :disabled="loading"
            class="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg v-if="!loading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Search
          </button>

          <button
            type="button"
            @click="handleReset"
            :disabled="loading"
            class="px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg border border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { SearchFilters, Platform } from '~/types/creator'

interface Props {
  filters: SearchFilters
  loading?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  search: []
  reset: []
  'update:filters': [filters: SearchFilters]
}>()

// Local state
const localFilters = ref<SearchFilters>({ ...props.filters })
const errors = ref<Record<string, string>>({})

// Watch for external filter changes
watch(() => props.filters, (newFilters) => {
  localFilters.value = { ...newFilters }
}, { deep: true })

// Options
const regionOptions = [
  { value: 'BR', label: 'Brazil' },
  { value: 'US', label: 'United States' },
  { value: 'UK', label: 'United Kingdom' },
  { value: 'EU', label: 'Europe' },
  { value: 'FR', label: 'France' },
  { value: 'DE', label: 'Germany' },
  { value: 'ES', label: 'Spain' },
  { value: 'JP', label: 'Japan' },
  { value: 'KR', label: 'South Korea' },
]

const viewModes = [
  { value: 'full' as const, label: 'Full Results' },
  { value: 'short' as const, label: 'Top 10' },
]

// Methods
const viewModeButtonClasses = (mode: 'full' | 'short') => {
  const isSelected = localFilters.value.viewMode === mode
  const base = 'px-4 py-1.5 rounded-md text-sm font-medium transition-all'

  if (isSelected) {
    return `${base} bg-white text-primary-700 shadow-sm`
  }
  return `${base} text-gray-600 hover:text-gray-900`
}

const handleSubmit = () => {
  errors.value = {}

  if (!localFilters.value.game || localFilters.value.game.trim() === '') {
    errors.value.game = 'Game is required'
    return
  }

  emit('update:filters', localFilters.value)
  emit('search')
}

const handleReset = () => {
  localFilters.value = {
    game: '',
    language: undefined,
    region: undefined,
    viewMode: 'full',
  }
  errors.value = {}
  emit('update:filters', localFilters.value)
  emit('reset')
}
</script>
