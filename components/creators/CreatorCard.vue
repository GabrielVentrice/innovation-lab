<template>
  <div
    class="bg-white rounded-xl shadow-soft border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-medium hover:border-gray-300 cursor-pointer group"
    @click="$emit('click')"
  >
    <!-- Header with Avatar and Name -->
    <div class="p-5 border-b border-gray-100">
      <div class="flex items-start gap-4">
        <!-- Avatar -->
        <div class="flex-shrink-0">
          <img
            v-if="primaryAccount?.avatarUrl"
            :src="primaryAccount.avatarUrl"
            :alt="creator.name"
            class="w-16 h-16 rounded-full border-2 border-gray-200 object-cover"
          />
          <div v-else class="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
            <span class="text-2xl font-semibold text-gray-500">
              {{ creator.name[0].toUpperCase() }}
            </span>
          </div>
        </div>

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <h3 class="text-lg font-semibold text-gray-900 truncate group-hover:text-primary transition-colors">
            {{ creator.name }}
          </h3>

          <!-- Location and Language -->
          <div class="flex items-center gap-3 mt-1 text-sm text-gray-600">
            <span v-if="creator.country" class="flex items-center gap-1">
              <span>{{ getCountryFlag(creator.country) }}</span>
              <span>{{ creator.country }}</span>
            </span>
            <span v-if="creator.language" class="flex items-center gap-1">
              <span>🗣️</span>
              <span>{{ getLanguageName(creator.language) }}</span>
            </span>
          </div>

          <!-- Platform Badges -->
          <div class="flex flex-wrap gap-2 mt-3">
            <UiBadge
              v-for="account in creator.accounts"
              :key="account.platform"
              variant="default"
              size="sm"
            >
              {{ platformLabels[account.platform] }}
            </UiBadge>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-5 space-y-4">
      <!-- Game Tags -->
      <div v-if="creator.gameTags.length > 0">
        <div class="flex flex-wrap gap-2">
          <UiBadge
            v-for="tag in creator.gameTags"
            :key="tag"
            variant="primary"
            size="sm"
          >
            🎮 {{ tag }}
          </UiBadge>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-gray-50 rounded-lg p-3">
          <div class="text-xs text-gray-600 mb-1">Total Followers</div>
          <div class="text-xl font-semibold text-gray-900">
            {{ formatNumber(totalFollowers) }}
          </div>
        </div>
        <div class="bg-gray-50 rounded-lg p-3">
          <div class="text-xs text-gray-600 mb-1">Platforms</div>
          <div class="text-xl font-semibold text-gray-900">
            {{ creator.accounts.length }}
          </div>
        </div>
      </div>

      <!-- Contact Links (if available) -->
      <div v-if="contactLinks.length > 0" class="pt-2 border-t border-gray-100">
        <div class="text-xs font-medium text-gray-600 mb-2">Contact</div>
        <div class="flex flex-wrap gap-2">
          <a
            v-for="link in contactLinks.slice(0, 3)"
            :key="link.url"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-xs font-medium hover:bg-primary-100 transition-colors"
            @click.stop
          >
            <span>{{ getContactIcon(link.type) }}</span>
            <span>{{ link.label }}</span>
          </a>
        </div>
      </div>

      <!-- Social Links -->
      <div v-if="socialLinks.length > 0" class="flex flex-wrap gap-2">
        <a
          v-for="link in socialLinks.slice(0, 4)"
          :key="link.url"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          class="text-gray-500 hover:text-primary transition-colors"
          :title="link.label"
          @click.stop
        >
          <span class="text-lg">{{ getSocialIcon(link.type) }}</span>
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div class="px-5 py-3 bg-gray-50 border-t border-gray-100">
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-600">
          {{ creator.accounts.length }} account{{ creator.accounts.length !== 1 ? 's' : '' }}
        </span>
        <span class="text-primary font-medium group-hover:underline">
          View Details →
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Creator } from '~/types/creator'
import { formatNumber, getCountryFlag, getLanguageName, extractAllLinks } from '~/utils/formatters'

interface Props {
  creator: Creator
}

const props = defineProps<Props>()

defineEmits<{
  click: []
}>()

// Platform labels
const platformLabels: Record<string, string> = {
  youtube: 'YouTube',
  twitch: 'Twitch',
  tiktok: 'TikTok',
}

// Computed
const primaryAccount = computed(() => {
  return props.creator.accounts[0] || null
})

const totalFollowers = computed(() => {
  return props.creator.accounts.reduce((sum, account) => sum + (account.followers || 0), 0)
})

const allLinks = computed(() => extractAllLinks(props.creator.accounts))

const contactLinks = computed(() => {
  return allLinks.value.filter(link =>
    ['email', 'whatsapp', 'discord', 'telegram'].includes(link.type)
  )
})

const socialLinks = computed(() => {
  return allLinks.value.filter(link =>
    ['twitter', 'instagram', 'facebook', 'linkedin'].includes(link.type)
  )
})

// Helpers
const getContactIcon = (type: string) => {
  const icons: Record<string, string> = {
    email: '✉️',
    whatsapp: '💬',
    discord: '🎮',
    telegram: '✈️',
  }
  return icons[type] || '🔗'
}

const getSocialIcon = (type: string) => {
  const icons: Record<string, string> = {
    twitter: '🐦',
    instagram: '📷',
    facebook: '📘',
    linkedin: '💼',
    youtube: '▶️',
    twitch: '📺',
    tiktok: '🎵',
  }
  return icons[type] || '🔗'
}
</script>
