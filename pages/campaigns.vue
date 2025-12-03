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
          ExitLab Creators HUB
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
          <div class="p-6 cursor-pointer" @click="toggleCampaign(campaign.id)">
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-3">
                  <button
                    @click.stop="toggleCampaign(campaign.id)"
                    class="flex-shrink-0 w-5 h-5 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                  >
                    <svg
                      v-if="isExpanded(campaign.id)"
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                    <svg
                      v-else
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <h2 class="text-xl font-bold text-white">
                    {{ campaign.title }}
                  </h2>
                  <span :class="statusBadgeClass(campaign.status)">
                    {{ campaign.status }}
                  </span>
                </div>
                <!-- URL Section - Always visible -->
                <div v-if="campaign.assetsUrl" class="ml-8 mb-3">
                  <div class="flex items-center gap-2">
                    <div class="flex-1 flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-lg px-3 py-2">
                      <svg class="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <input
                        :value="campaign.assetsUrl"
                        readonly
                        class="flex-1 bg-transparent text-sm text-gray-400 outline-none"
                        @click.stop
                      >
                    </div>
                    <button
                      @click.stop="copyToClipboard(campaign.assetsUrl, campaign.id)"
                      class="flex-shrink-0 px-4 py-2 bg-brand-red hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
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
                <div v-else class="ml-8 mb-3">
                  <p class="text-sm text-gray-500">No assets URL available yet</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Campaign Content - Collapsible -->
          <div v-if="isExpanded(campaign.id)" class="p-6 space-y-6 border-t border-gray-800">
            <!-- Briefing and Preview Sections -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              <!-- Campaign Briefing Section -->
              <div class="flex flex-col">
                <h3 class="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <svg class="w-4 h-4 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Campaign Briefing
                </h3>
                <div class="bg-gray-900 rounded-lg p-4 flex-1">
                  <p class="text-sm text-gray-300 whitespace-pre-line">{{ campaign.briefing }}</p>
                </div>
              </div>

              <!-- Preview Section -->
              <div class="flex flex-col">
                <h3 class="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <svg class="w-4 h-4 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Preview
                </h3>
                <div class="bg-gray-900 rounded-lg p-4 flex-1 flex items-center justify-center">
                  <iframe
                    :src="campaign.assetsUrl"
                    :title="campaign.title"
                    class="w-full h-full min-h-[300px] rounded-lg border-0"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  ></iframe>
                </div>
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

            <!-- User Guide Section -->
            <div>
              <h3 class="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <svg class="w-4 h-4 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                User Guide
              </h3>
              <div class="bg-gray-900 rounded-lg p-4">
                <h4 class="text-sm font-semibold text-white mb-4">Step by Step</h4>
                <ol class="space-y-4">
                  <li class="flex gap-3">
                    <span class="flex-shrink-0 w-6 h-6 rounded-full bg-brand-red text-white text-xs font-semibold flex items-center justify-center">1</span>
                    <div class="flex-1">
                      <p class="text-sm text-gray-300">Copy the Overlay URL</p>
                    </div>
                  </li>
                  <li class="flex gap-3">
                    <span class="flex-shrink-0 w-6 h-6 rounded-full bg-brand-red text-white text-xs font-semibold flex items-center justify-center">2</span>
                    <div class="flex-1">
                      <p class="text-sm font-medium text-white mb-2">Add Browser Source in OBS</p>
                      <p class="text-sm text-gray-400 mb-2">With the link copied, follow these steps in OBS Studio:</p>
                      <ul class="space-y-2 text-sm text-gray-300 ml-4 list-disc">
                        <li>Open OBS Studio.</li>
                        <li>In the <strong class="text-white">Sources</strong> section, usually located at the bottom of the screen, click the <strong class="text-white">add</strong> button (the <strong class="text-white">+</strong> icon).</li>
                        <li>In the menu that appears, select the <strong class="text-white">Browser</strong> option.</li>
                        <li>You will be prompted to create a new source. Give it a <strong class="text-white">descriptive name</strong> (e.g., "EXITLAG CAMPAIGN") and click <strong class="text-white">OK</strong>.</li>
                        <li>In the Browser Source properties window, locate the <strong class="text-white">URL</strong> field.</li>
                        <li><strong class="text-white">Paste the URL</strong> you copied into this field.</li>
                        <li>Adjust the <strong class="text-white">Width and Height</strong> to match your stream resolution (320x400)</li>
                        <li>Click <strong class="text-white">OK</strong>.</li>
                      </ul>
                    </div>
                  </li>
                  <li class="flex gap-3">
                    <span class="flex-shrink-0 w-6 h-6 rounded-full bg-brand-red text-white text-xs font-semibold flex items-center justify-center">3</span>
                    <div class="flex-1">
                      <p class="text-sm font-medium text-white mb-2">Position and Resize</p>
                      <ul class="space-y-2 text-sm text-gray-300 ml-4 list-disc">
                        <li>The overlay will now appear in your OBS preview area.</li>
                        <li>You can <strong class="text-white">click and drag</strong> the corners of the source in the preview screen to resize it.</li>
                        <li><strong class="text-white">Drag the overlay</strong> to the desired position in your scene.</li>
                        <li>Make sure the overlay source is <strong class="text-white">above</strong> other sources (such as Game Capture, Camera, etc.) in the Sources list, so it appears on top of everything.</li>
                      </ul>
                    </div>
                  </li>
                </ol>
              </div>
            </div>

            <!-- Additional Assets Section -->
            <div>
              <h3 class="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <svg class="w-4 h-4 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Additional Assets
              </h3>
              <div v-if="!campaign.additionalAssetsUrl" class="bg-gray-900 rounded-lg p-8 text-center">
                <svg class="w-12 h-12 text-gray-700 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <p class="text-sm text-gray-500">No additional assets available yet</p>
              </div>
              <div v-else class="bg-gray-900 rounded-lg p-4">
                <a
                  :href="campaign.additionalAssetsUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-3 bg-black border border-gray-800 rounded-lg px-4 py-3 hover:border-brand-red transition-colors group"
                >
                  <svg class="w-5 h-5 text-brand-red group-hover:text-primary-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-white group-hover:text-brand-red transition-colors">
                      Download Additional Assets
                    </p>
                    <p class="text-xs text-gray-500 mt-0.5 truncate">
                      {{ campaign.additionalAssetsUrl }}
                    </p>
                  </div>
                  <svg class="w-4 h-4 text-gray-500 group-hover:text-brand-red transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
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

// Meta tags
useHead({
  title: 'ExitLab Creators HUB - Campaigns',
  meta: [
    {
      name: 'description',
      content: 'View and manage your active campaign partnerships',
    },
  ],
})

const copiedAssetId = ref<string | null>(null)
const expandedCampaigns = ref<Set<string>>(new Set())

// Toggle campaign expansion
const toggleCampaign = (campaignId: string) => {
  if (expandedCampaigns.value.has(campaignId)) {
    expandedCampaigns.value.delete(campaignId)
  } else {
    expandedCampaigns.value.add(campaignId)
  }
}

const isExpanded = (campaignId: string) => {
  return expandedCampaigns.value.has(campaignId)
}

// Mock data - Replace with actual API call
const campaigns = ref<Campaign[]>([
  {
    id: '1',
    title: 'ExitLag SkillFest',
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
    assetsUrl: 'https://streamelements.com/overlay/6930899c4bb34feeda05404c/3gHRY-sdJzhi0m1gEoRyZeraUruDgvSrOiSxbYasLnAOc_v0',
    additionalAssetsUrl: 'https://campaign.exitlag.com/q4-2025-gaming-performance/additional-assets.zip',
    createdAt: '2025-11-10',
    updatedAt: '2025-11-20',
  },
  {
    id: '2',
    title: 'ExitLag Black Friday 2025',
    status: 'active',
    briefing: `Join us for the biggest Black Friday campaign of the year!

This campaign focuses on promoting ExitLag's exclusive Black Friday deals and special offers.

Key Messages:
- Highlight the amazing Black Friday discounts
- Showcase the value proposition of ExitLag
- Create urgency with limited-time offers
- Engage with your community about the best deals

Content should be exciting, engaging, and emphasize the exclusive nature of these Black Friday offers.`,
    startDate: '2025-11-20',
    endDate: '2025-11-30',
    brand: 'ExitLag',
    deliverables: [
      '3 YouTube videos showcasing Black Friday deals',
      '5 Instagram posts/reels with discount codes',
      '3 TikTok videos creating urgency',
      '2 Twitch stream integrations (minimum 3 hours each)',
    ],
    requirements: [
      'Must include Black Friday discount codes',
      'Include ExitLag branding and logo in all content',
      'Create sense of urgency and exclusivity',
      'Tag @exitlag in all social media posts',
      'Submit content for approval 24 hours before publishing',
    ],
    assetsUrl: 'https://streamelements.com/overlay/6930b34680cf59ada0d8bafb/3gHRY-sdJzhi0m1gEoRyZeraUruDgvSrOiSxbYasLnAOc_v0',
    additionalAssetsUrl: 'https://campaign.exitlag.com/black-friday-2025/additional-assets.zip',
    createdAt: '2025-11-15',
    updatedAt: '2025-11-18',
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