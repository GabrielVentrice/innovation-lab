<template>
  <div>
    <!-- Header with count and actions -->
    <div v-if="creators.length > 0" class="flex items-center justify-between mb-6">
      <div class="text-sm text-gray-600">
        <span class="font-semibold text-gray-900">{{ creators.length }}</span>
        {{ creators.length === 1 ? 'creator' : 'creators' }} found
      </div>

      <div class="flex gap-2">
        <UiButton
          variant="secondary"
          size="sm"
          @click="$emit('export-csv')"
        >
          📥 Export CSV
        </UiButton>
        <UiButton
          variant="secondary"
          size="sm"
          @click="$emit('export-json')"
        >
          📥 Export JSON
        </UiButton>
      </div>
    </div>

    <!-- Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <CreatorsCreatorCard
        v-for="creator in creators"
        :key="creator.id"
        :creator="creator"
        @click="$emit('select-creator', creator)"
      />
    </div>

    <!-- Empty State -->
    <div v-if="showEmpty" class="text-center py-16">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
        <span class="text-3xl">🔍</span>
      </div>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">
        No creators found
      </h3>
      <p class="text-gray-600 mb-6">
        Try adjusting your filters or search for a different game
      </p>
      <UiButton variant="primary" @click="$emit('reset')">
        Reset Filters
      </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Creator } from '~/types/creator'

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
</script>
