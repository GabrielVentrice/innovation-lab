import { ref, computed } from 'vue'
import type { Creator, SearchFilters, SearchOptions, Platform } from '~/types/creator'
import { searchCreators } from '~/utils/creatorsSearch'
import { exportToCSV, exportToJSON, downloadFile } from '~/utils/formatters'

export const useCreators = () => {
  // State
  const creators = ref<Creator[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const hasSearched = ref(false)

  // Filters
  const filters = ref<SearchFilters>({
    game: '',
    language: undefined,
    region: undefined,
    viewMode: 'full',
  })

  // Computed
  const filteredCreators = computed(() => {
    let result = creators.value

    // Apply view mode filter
    if (filters.value.viewMode === 'short') {
      // In short mode, limit to top 10 by total followers
      result = result
        .map(creator => ({
          ...creator,
          totalFollowers: creator.accounts.reduce((sum, acc) => sum + (acc.followers || 0), 0)
        }))
        .sort((a, b) => b.totalFollowers - a.totalFollowers)
        .slice(0, 10)
    }

    return result
  })

  const resultsCount = computed(() => filteredCreators.value.length)

  const isEmpty = computed(() => hasSearched.value && resultsCount.value === 0)

  // Actions
  const search = async () => {
    if (!filters.value.game) {
      error.value = 'Game is required'
      return
    }

    loading.value = true
    error.value = null
    hasSearched.value = true

    try {
      const searchOptions: SearchOptions = {
        game: filters.value.game,
        language: filters.value.language,
        region: filters.value.region,
      }

      const results = await searchCreators(searchOptions)
      creators.value = results
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to search creators'
      creators.value = []
    } finally {
      loading.value = false
    }
  }

  const reset = () => {
    creators.value = []
    filters.value = {
      game: '',
      language: undefined,
      region: undefined,
      viewMode: 'full',
    }
    error.value = null
    hasSearched.value = false
  }

  const updateFilter = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    filters.value[key] = value
  }

  const exportCSV = () => {
    const csv = exportToCSV(filteredCreators.value)
    const filename = `creators-${filters.value.game}-${Date.now()}.csv`
    downloadFile(csv, filename, 'text/csv')
  }

  const exportJSON = () => {
    const json = exportToJSON(filteredCreators.value)
    const filename = `creators-${filters.value.game}-${Date.now()}.json`
    downloadFile(json, filename, 'application/json')
  }

  return {
    // State
    creators: filteredCreators,
    loading,
    error,
    hasSearched,
    filters,
    resultsCount,
    isEmpty,

    // Actions
    search,
    reset,
    updateFilter,
    exportCSV,
    exportJSON,
  }
}
