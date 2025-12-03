<template>
  <div class="bg-white rounded-xl shadow-soft border border-gray-200 p-6">
    <h2 class="text-lg font-semibold text-gray-900 mb-6">Search Filters</h2>

    <form @submit.prevent="handleSubmit" class="space-y-5">
      <!-- Game Input (Required) -->
      <div>
        <UiInput
          v-model="localFilters.game"
          label="Game"
          placeholder="e.g., Valorant, League of Legends, CS2"
          required
          :error="errors.game"
        />
      </div>

      <!-- Region Select -->
      <div>
        <UiSelect
          v-model="localFilters.region"
          label="Region"
          placeholder="All regions"
          :options="regionOptions"
        />
      </div>

      <!-- View Mode Toggle -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          View Mode
        </label>
        <div class="flex gap-2">
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
      <div class="flex gap-3 pt-2">
        <UiButton
          type="submit"
          variant="primary"
          size="lg"
          :loading="loading"
          full-width
        >
          Search Creators
        </UiButton>

        <UiButton
          type="button"
          variant="ghost"
          size="lg"
          @click="handleReset"
          :disabled="loading"
        >
          Reset
        </UiButton>
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
  const base = 'flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border'

  if (isSelected) {
    return `${base} bg-primary-50 text-primary-700 border-primary-200`
  }
  return `${base} bg-white text-gray-700 border-gray-200 hover:bg-gray-50`
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
    region: undefined,
    viewMode: 'full',
  }
  errors.value = {}
  emit('update:filters', localFilters.value)
  emit('reset')
}
</script>
