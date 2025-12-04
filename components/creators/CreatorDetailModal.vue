<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen && creator"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
        @click.self="close"
      >
        <div
          class="bg-black rounded-2xl border border-gray-800 shadow-large max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          @click.stop
        >
          <!-- Header -->
          <div class="flex items-start justify-between p-6 border-b border-gray-800">
            <div class="flex items-start gap-4 flex-1">
              <img
                v-if="primaryAccount?.avatarUrl"
                :src="primaryAccount.avatarUrl"
                :alt="creator.name"
                class="w-20 h-20 rounded-full border-2 border-gray-200 object-cover"
              />
              <div v-else class="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center">
                <span class="text-3xl font-semibold text-gray-400">
                  {{ creator.name[0].toUpperCase() }}
                </span>
              </div>

              <div class="flex-1">
                <h2 class="text-2xl font-bold text-white mb-2">
                  {{ creator.name }}
                </h2>

                <div class="flex items-center gap-4 text-sm text-gray-400">
                  <span v-if="creator.country" class="flex items-center gap-1">
                    <span>{{ getCountryFlag(creator.country) }}</span>
                    <span>{{ creator.country }}</span>
                  </span>
                  <span v-if="creator.language" class="flex items-center gap-1">
                    <span>🗣️</span>
                    <span>{{ getLanguageName(creator.language) }}</span>
                  </span>
                </div>

                <div class="flex flex-wrap gap-2 mt-3">
                  <UiBadge
                    v-for="tag in creator.gameTags"
                    :key="tag"
                    variant="primary"
                  >
                    🎮 {{ tag }}
                  </UiBadge>
                </div>
              </div>
            </div>

            <button
              class="text-gray-500 hover:text-brand-red transition-colors p-2"
              @click="close"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto p-6">
            <div class="space-y-8">
              <!-- Stats Overview -->
              <div class="grid grid-cols-3 gap-4">
                <div class="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
                  <div class="text-sm text-gray-500 mb-1">Total Followers</div>
                  <div class="text-2xl font-bold text-white">
                    {{ formatNumber(totalFollowers) }}
                  </div>
                </div>
                <div class="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
                  <div class="text-sm text-gray-500 mb-1">Platforms</div>
                  <div class="text-2xl font-bold text-white">
                    {{ creator.accounts.length }}
                  </div>
                </div>
                <div class="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
                  <div class="text-sm text-gray-500 mb-1">Avg Views</div>
                  <div class="text-2xl font-bold text-white">
                    {{ formatNumber(avgViews) }}
                  </div>
                </div>
              </div>

              <!-- Contact Links -->
              <div v-if="contactLinks.length > 0">
                <h3 class="text-lg font-semibold text-white mb-4">Contact</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div
                    v-for="link in contactLinks"
                    :key="link.url"
                    class="bg-gray-900 rounded-lg border border-gray-800  transition-all p-4"
                  >
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      class="flex items-center gap-3 text-brand-red  transition-colors group mb-3"
                    >
                      <span class="text-2xl">{{ getContactIcon(link.type) }}</span>
                      <div class="flex-1 min-w-0">
                        <div class="font-medium">{{ link.label }}</div>
                      </div>
                      
                    </a>
                    
                    <button
                      v-if="link.type === 'email' && !inviteSent"
                      @click.stop="sendInvite"
                      class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-brand-red hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Enviar Convite
                    </button>
                    
                    <div
                      v-if="link.type === 'email' && inviteSent"
                      class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-900 border border-green-700 text-green-300 text-sm font-semibold rounded-lg"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Convite Enviado
                    </div>
                  </div>
                </div>
              </div>

              <!-- Platform Accounts -->
              <div>
                <h3 class="text-lg font-semibold text-white mb-4">Platform Accounts</h3>
                <div class="space-y-4">
                  <div
                    v-for="account in creator.accounts"
                    :key="account.externalId"
                    class="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-brand-red transition-colors"
                  >
                    <div class="flex items-start justify-between mb-3">
                      <div class="flex items-center gap-3">
                        <UiBadge variant="primary">
                          {{ platformLabels[account.platform] }}
                        </UiBadge>
                        <a
                          :href="account.url"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="font-medium text-white hover:text-brand-red transition-colors"
                        >
                          @{{ account.username }}
                        </a>
                      </div>
                      <a
                        :href="account.url"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-gray-500 hover:text-brand-red transition-colors"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>

                    <div class="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <div class="text-xs text-gray-500">Followers</div>
                        <div class="text-lg font-semibold text-white">
                          {{ formatNumber(account.followers) }}
                        </div>
                      </div>
                      <div>
                        <div class="text-xs text-gray-500">Avg Views</div>
                        <div class="text-lg font-semibold text-white">
                          {{ formatNumber(account.avgViews) }}
                        </div>
                      </div>
                    </div>

                    <p v-if="account.bio" class="text-sm text-gray-400 leading-relaxed whitespace-pre-wrap">
                      {{ account.bio }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Social Links -->
              <div v-if="socialLinks.length > 0">
                <h3 class="text-lg font-semibold text-white mb-4">Social Media</h3>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <a
                    v-for="link in socialLinks"
                    :key="link.url"
                    :href="link.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center gap-3 p-3 bg-gray-900 border border-gray-800 rounded-lg hover:border-brand-red transition-all group"
                  >
                    <span class="text-xl">{{ getSocialIcon(link.type) }}</span>
                    <span class="text-sm font-medium text-gray-300 group-hover:text-brand-red">
                      {{ link.label }}
                    </span>
                  </a>
                </div>
              </div>

              <!-- Other Links -->
              <div v-if="otherLinks.length > 0">
                <h3 class="text-lg font-semibold text-white mb-4">Other Links</h3>
                <div class="space-y-2">
                  <a
                    v-for="link in otherLinks"
                    :key="link.url"
                    :href="link.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center gap-2 p-3 bg-gray-900 border border-gray-800 rounded-lg hover:border-brand-red transition-all text-sm text-gray-300"
                  >
                    <span>🔗</span>
                    <span class="truncate">{{ link.url }}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Creator } from '~/types/creator'
import { formatNumber, getCountryFlag, getLanguageName, extractAllLinks } from '~/utils/formatters'

interface Props {
  isOpen: boolean
  creator: Creator | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  'mark-contacted': [creator: Creator]
  'invite-sent': [creator: Creator]
}>()

// State
const inviteSent = ref(false)

// Watch para resetar o estado quando o modal abrir com um novo creator
watch(() => props.creator?.id, () => {
  inviteSent.value = false
})

// Platform labels
const platformLabels: Record<string, string> = {
  youtube: 'YouTube',
  twitch: 'Twitch',
  tiktok: 'TikTok',
}

// Computed
const primaryAccount = computed(() => {
  return props.creator?.accounts[0] || null
})

const totalFollowers = computed(() => {
  return props.creator?.accounts.reduce((sum, account) => sum + (account.followers || 0), 0) || 0
})

const avgViews = computed(() => {
  const accounts = props.creator?.accounts || []
  const totalViews = accounts.reduce((sum, account) => sum + (account.avgViews || 0), 0)
  return accounts.length > 0 ? Math.round(totalViews / accounts.length) : 0
})

const allLinks = computed(() => {
  return props.creator ? extractAllLinks(props.creator.accounts) : []
})

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

const otherLinks = computed(() => {
  return allLinks.value.filter(link => link.type === 'other')
})

// Methods
const close = () => {
  emit('close')
}

const sendInvite = () => {
  if (!props.creator) return
  
  inviteSent.value = true
  emit('invite-sent', props.creator)
  
  // Aqui você pode adicionar lógica adicional, como:
  // - Enviar para uma API
  // - Salvar no localStorage
  // - Mostrar notificação de sucesso
}

const copyInformation = () => {
  if (!props.creator) return

  const text = `
Creator: ${props.creator.name}
Country: ${props.creator.country || 'N/A'}
Language: ${getLanguageName(props.creator.language)}
Total Followers: ${formatNumber(totalFollowers.value)}

Platforms:
${props.creator.accounts.map(acc => `- ${platformLabels[acc.platform]}: ${acc.url}`).join('\n')}

Contact:
${contactLinks.value.map(link => `- ${link.label}: ${link.url}`).join('\n')}
  `.trim()

  navigator.clipboard.writeText(text)
  alert('Information copied to clipboard!')
}

const markAsContacted = () => {
  if (props.creator) {
    emit('mark-contacted', props.creator)
    alert('Marked as contacted!')
  }
}

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

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.3s ease;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.95);
}
</style>
