<template>
  <div class="min-h-screen bg-dark-bg">
    <!-- Header -->
    <header class="bg-black border-b border-gray-800">
      <div class="max-w-[1400px] mx-auto px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <img src="~/assets/images/exitlag-logo.svg" alt="ExitLag Logo" class="h-8 w-auto">
          <div class="flex items-center gap-4">
            <span class="text-xs text-gray-500">{{ activeCampaignsCount }} Active Campaigns</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-[1400px] mx-auto px-6 lg:px-8 py-6">
      <!-- Title Section -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-white">
          My Campaigns
        </h1>
        <p class="mt-1 text-sm text-gray-500">
          View and manage your active campaign partnerships
        </p>
      </div>

      <!-- No Campaigns State -->
      <div v-if="campaigns.length === 0" class="text-center py-20 bg-black rounded-lg border border-gray-800">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-900 mb-4">
          <svg class="w-8 h-8 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h2 class="text-xl font-bold text-white mb-2">
          No Campaigns Yet
        </h2>
        <p class="text-gray-500 max-w-md mx-auto">
          You don't have any active campaigns at the moment. Check back later for new opportunities.
        </p>
      </div>

      <!-- Campaigns List -->
      <div v-else class="space-y-6">
        <div
          v-for="campaign in campaigns"
          :key="campaign.id"
          class="bg-black border border-gray-800 rounded-lg overflow-hidden hover:border-gray-700 transition-colors"
        >
          <!-- Campaign Header -->
          <div class="p-6 border-b border-gray-800">
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <h2 class="text-xl font-bold text-white">
                    {{ campaign.title }}
                  </h2>
                  <span :class="statusBadgeClass(campaign.status)">
                    {{ campaign.status }}
                  </span>
                </div>
                <div class="flex items-center gap-4 text-sm text-gray-500">
                  <span class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {{ campaign.brand }}
                  </span>
                  <span class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {{ formatDate(campaign.startDate) }} - {{ formatDate(campaign.endDate) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Campaign Content -->
          <div class="p-6 space-y-6">
            <!-- Briefing Section -->
            <div>
              <h3 class="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <svg class="w-4 h-4 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Campaign Briefing
              </h3>
              <div class="bg-gray-900 rounded-lg p-4">
                <p class="text-sm text-gray-300 whitespace-pre-line">{{ campaign.briefing }}</p>
              </div>
            </div>

            <!-- Deliverables Section -->
            <div v-if="campaign.deliverables && campaign.deliverables.length > 0">
              <h3 class="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <svg class="w-4 h-4 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Deliverables
              </h3>
              <div class="bg-gray-900 rounded-lg p-4">
                <ul class="space-y-2">
                  <li
                    v-for="(deliverable, index) in campaign.deliverables"
                    :key="index"
                    class="flex items-start gap-2 text-sm text-gray-300"
                  >
                    <svg class="w-4 h-4 text-brand-red mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ deliverable }}
                  </li>
                </ul>
              </div>
            </div>

            <!-- Requirements Section -->
            <div v-if="campaign.requirements && campaign.requirements.length > 0">
              <h3 class="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <svg class="w-4 h-4 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Requirements
              </h3>
              <div class="bg-gray-900 rounded-lg p-4">
                <ul class="space-y-2">
                  <li
                    v-for="(requirement, index) in campaign.requirements"
                    :key="index"
                    class="flex items-start gap-2 text-sm text-gray-300"
                  >
                    <svg class="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    {{ requirement }}
                  </li>
                </ul>
              </div>
            </div>

            <!-- Assets Section -->
            <div>
              <h3 class="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <svg class="w-4 h-4 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Assets URL
              </h3>

              <div v-if="!campaign.assetsUrl" class="bg-gray-900 rounded-lg p-8 text-center">
                <svg class="w-12 h-12 text-gray-700 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <p class="text-sm text-gray-500">No assets URL available yet</p>
              </div>

              <div v-else class="bg-gray-900 rounded-lg p-4">
                <div class="flex items-center gap-2">
                  <div class="flex-1 flex items-center gap-2 bg-black border border-gray-800 rounded-lg px-3 py-2.5">
                    <svg class="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <input
                      :value="campaign.assetsUrl"
                      readonly
                      class="flex-1 bg-transparent text-sm text-gray-400 outline-none"
                    >
                  </div>
                  <button
                    @click="copyToClipboard(campaign.assetsUrl, campaign.id)"
                    class="flex-shrink-0 px-4 py-2.5 bg-brand-red hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                  >
                    <svg v-if="copiedAssetId === campaign.id" class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    {{ copiedAssetId === campaign.id ? 'Copied!' : 'Copy URL' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Campaign } from '~/types/campaign'

const copiedAssetId = ref<string | null>(null)

// Mock data - Replace with actual API call
const campaigns = ref<Campaign[]>([
  {
    id: '1',
    title: 'ExitLag Gaming Performance Campaign Q4 2025',
    status: 'active',
    briefing: `Join us in promoting ExitLag's cutting-edge gaming optimization technology! 

This campaign focuses on showcasing how ExitLag reduces ping, eliminates lag, and enhances the overall gaming experience across multiple competitive titles.

Key Messages:
- Highlight the noticeable difference in gaming performance
- Demonstrate real-time ping reduction
- Share your authentic gaming experience with ExitLag
- Engage with your community about competitive gaming advantages

Content should be genuine, engaging, and show real gameplay improvements. We value authenticity and your unique voice in connecting with your audience.`,
    startDate: '2025-12-01',
    endDate: '2026-02-28',
    brand: 'ExitLag',
    deliverables: [
      '2 YouTube videos (10-15 minutes each) showcasing gameplay with ExitLag',
      '4 Instagram posts/reels highlighting key features',
      '2 TikTok videos demonstrating before/after performance',
      '1 Twitch stream integration (minimum 2 hours)',
    ],
    requirements: [
      'Must show authentic gameplay experience',
      'Include ExitLag branding and logo in content',
      'Use provided discount code for audience',
      'Tag @exitlag in all social media posts',
      'Submit content for approval 48 hours before publishing',
    ],
    assetsUrl: 'https://campaign.exitlag.com/q4-2025-gaming-performance/assets',
    createdAt: '2025-11-10',
    updatedAt: '2025-11-20',
  },
])

const activeCampaignsCount = computed(() => {
  return campaigns.value.filter(c => c.status === 'active').length
})

const statusBadgeClass = (status: string) => {
  const baseClass = 'px-2.5 py-1 text-xs font-medium rounded-full'
  
  switch (status) {
    case 'active':
      return `${baseClass} bg-green-900 text-green-400 border border-green-800`
    case 'pending':
      return `${baseClass} bg-yellow-900 text-yellow-400 border border-yellow-800`
    case 'completed':
      return `${baseClass} bg-gray-800 text-gray-400 border border-gray-700`
    case 'paused':
      return `${baseClass} bg-orange-900 text-orange-400 border border-orange-800`
    default:
      return `${baseClass} bg-gray-800 text-gray-400 border border-gray-700`
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const getAssetUrl = (campaignId: string, assetId: string) => {
  return `https://campaign.exitlag.com/${campaignId}/assets/${assetId}`
}

const copyToClipboard = async (text: string, id: string) => {
  try {
    await navigator.clipboard.writeText(text)
    copiedAssetId.value = id
    setTimeout(() => {
      copiedAssetId.value = null
    }, 2000)
  } catch (err) {
    console.error('Failed to copy text: ', err)
  }
}
</script>
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const copyToClipboard = async (text: string, id: string) => {