<template>
  <div class="min-h-screen bg-dark-bg">
    <!-- Header -->
    <header class="bg-black border-b border-gray-800">
      <div class="max-w-[1400px] mx-auto px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <NuxtLink to="/">
            <img
              src="~/assets/images/exitlag-logo.svg"
              alt="ExitLag Logo"
              class="h-8 w-auto"
            />
          </NuxtLink>
          <div class="flex items-center gap-6">
            <NuxtLink
              to="/register"
              class="px-4 py-2 bg-brand-red hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Register Creator
            </NuxtLink>
            <NuxtLink
              to="/"
              class="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Search Creators
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-[1400px] mx-auto px-6 lg:px-8 py-6">
      <!-- Title Section -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-white">Registered Creators</h1>
        <p class="mt-1 text-sm text-gray-500">
          List of all creators registered in the system
        </p>
      </div>

      <!-- Stats -->
      <div v-if="creators.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="bg-black rounded-lg border border-gray-800 p-4">
          <div class="text-sm text-gray-500">Total Creators</div>
          <div class="text-2xl font-bold text-white mt-1">{{ creators.length }}</div>
        </div>
        <div class="bg-black rounded-lg border border-gray-800 p-4">
          <div class="text-sm text-gray-500">With Social Media</div>
          <div class="text-2xl font-bold text-white mt-1">
            {{ creatorsWithSocials }}
          </div>
        </div>
        <div class="bg-black rounded-lg border border-gray-800 p-4">
          <div class="text-sm text-gray-500">Most Popular Game</div>
          <div class="text-2xl font-bold text-white mt-1">
            {{ mostPopularGame || "-" }}
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="creators.length === 0"
        class="text-center py-20 bg-black rounded-lg border border-gray-800"
      >
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-900 mb-4">
          <svg
            class="w-8 h-8 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </div>
        <h2 class="text-xl font-bold text-white mb-2">No creators registered</h2>
        <p class="text-gray-500 mb-8 max-w-md mx-auto">
          Start by registering your first content creator
        </p>
        <NuxtLink
          to="/register"
          class="inline-flex px-6 py-3 bg-brand-red hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
        >
          Register First Creator
        </NuxtLink>
      </div>

      <!-- Creators List -->
      <div v-else class="space-y-4">
        <div
          v-for="creator in creators"
          :key="creator.id"
          class="bg-black rounded-lg border border-gray-800 p-6 hover:border-gray-700 transition-colors"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-4 mb-4">
                <div class="h-12 w-12 rounded-full bg-gray-900 flex items-center justify-center">
                  <span class="text-brand-red font-semibold text-lg">
                    {{ creator.name.charAt(0).toUpperCase() }}
                  </span>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-white">{{ creator.name }}</h3>
                  <p class="text-sm text-gray-500">{{ creator.email }}</p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <div class="text-xs text-gray-500 mb-1">Phone</div>
                  <div class="text-sm text-white">{{ creator.phone }}</div>
                </div>
                <div>
                  <div class="text-xs text-gray-500 mb-1">Main Game</div>
                  <div class="text-sm text-white">{{ creator.mainGame }}</div>
                </div>
              </div>

              <!-- Social Networks -->
              <div v-if="creator.socials && Object.keys(creator.socials).length > 0">
                <div class="text-xs text-gray-500 mb-2">Social Networks</div>
                <div class="flex flex-wrap gap-2">
                  <a
                    v-for="(url, platform) in creator.socials"
                    :key="platform"
                    :href="url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-lg text-xs font-medium text-gray-300 hover:text-white transition-colors"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      v-if="platform === 'youtube'"
                    >
                      <path
                        d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a8 8 0 0 1 7.545 6.558zM8 4.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z"
                      />
                    </svg>
                    <svg
                      class="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      v-else-if="platform === 'twitch'"
                    >
                      <path
                        d="M9.571 2.571A.571.571 0 0 0 9 3.143v1.714h6.857a.571.571 0 0 0 .571-.571V2.57a.571.571 0 0 0-.571-.572H9.57zM6.857 6.857H2.57a.571.571 0 0 0-.571.571v8a.571.571 0 0 0 .571.572h1.714v2.286a.286.286 0 0 0 .468.226l2.857-2.857a.286.286 0 0 0 .083-.202V14.57h1.714a.571.571 0 0 0 .571-.571v-6.857a.571.571 0 0 0-.571-.572zm10.286 0h-4.286v6.857a.571.571 0 0 0 .571.572h1.714v2.286a.286.286 0 0 0 .468.226l2.857-2.857a.286.286 0 0 0 .083-.202V14.57h1.714a.571.571 0 0 0 .571-.571v-6.857a.571.571 0 0 0-.571-.572z"
                      />
                    </svg>
                    <svg
                      class="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      v-else-if="platform === 'instagram'"
                    >
                      <path
                        d="M10 0C7.284 0 6.944.012 5.877.048 4.812.084 4.017.222 3.3.42a5.967 5.967 0 0 0-2.153 1.4A5.967 5.967 0 0 0 .42 3.3C.222 4.017.084 4.812.048 5.877.012 6.944 0 7.284 0 10s.012 3.056.048 4.123c.036 1.065.174 1.86.372 2.577a5.967 5.967 0 0 0 1.4 2.153c.622.622 1.4 1.066 2.153 1.4.717.198 1.512.336 2.577.372C6.944 19.988 7.284 20 10 20s3.056-.012 4.123-.048c1.065-.036 1.86-.174 2.577-.372a5.967 5.967 0 0 0 2.153-1.4 5.967 5.967 0 0 0 1.4-2.153c.198-.717.336-1.512.372-2.577C19.988 13.056 20 12.716 20 10s-.012-3.056-.048-4.123c-.036-1.065-.174-1.86-.372-2.577a5.967 5.967 0 0 0-1.4-2.153A5.967 5.967 0 0 0 16.7.42c-.717-.198-1.512-.336-2.577-.372C13.056.012 12.716 0 10 0zm0 1.802c2.338 0 2.591.01 3.525.048.878.036 1.354.166 1.671.275.373.145.64.319.92.599.28.28.453.546.598.92.11.317.24.793.275 1.671.038.934.048 1.287.048 3.525s-.01 2.591-.048 3.525c-.036.878-.166 1.354-.275 1.671a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.317.11-.793.24-1.671.275-.934.038-1.287.048-3.525.048s-2.591-.01-3.525-.048c-.878-.036-1.354-.166-1.671-.275a2.478 2.478 0 0 1-.92-.599 2.48 2.48 0 0 1-.6-.92c-.109-.317-.24-.793-.275-1.671-.037-.934-.048-1.287-.048-3.525s.01-2.591.048-3.525c.036-.878.166-1.354.275-1.671.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.317-.11.793-.24 1.671-.275.738-.034 1.024-.044 3.525-.044zm0 4.678a4.52 4.52 0 1 0 0 9.04 4.52 4.52 0 0 0 0-9.04zm0 7.467a2.947 2.947 0 1 1 0-5.894 2.947 2.947 0 0 1 0 5.894zm5.138-8.77a1.056 1.056 0 1 1-2.112 0 1.056 1.056 0 0 1 2.112 0z"
                      />
                    </svg>
                    <svg
                      class="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      v-else-if="platform === 'twitter'"
                    >
                      <path
                        d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0 0 20 3.92a8.19 8.19 0 0 1-2.357.646 4.118 4.118 0 0 0 1.804-2.27 8.224 8.224 0 0 1-2.605.996 4.107 4.107 0 0 0-6.993 3.743 11.65 11.65 0 0 1-8.457-4.287 4.106 4.106 0 0 0 1.27 5.477A4.073 4.073 0 0 1 .8 7.713v.052a4.105 4.105 0 0 0 3.292 4.022 4.095 4.095 0 0 1-1.853.07 4.108 4.108 0 0 0 3.834 2.85A8.233 8.233 0 0 1 0 16.407a11.616 11.616 0 0 0 6.29 1.84"
                      />
                    </svg>
                    <svg
                      class="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      v-else-if="platform === 'facebook'"
                    >
                      <path
                        d="M18 10a8 8 0 1 0-9.25 7.872v-5.588H7.469v-2.284h1.281V8.769c0-1.263.75-1.963 1.908-1.963 1.553 0 2.313.115 2.313.115v2.544h-1.303c-1.285 0-1.685.797-1.685 1.614v1.937h2.869l-.458 2.284h-2.411v5.588A8.001 8.001 0 0 0 18 10z"
                      />
                    </svg>
                    <svg
                      class="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      v-else-if="platform === 'linkedin'"
                    >
                      <path
                        d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 1 1-.003-3.096 1.548 1.548 0 0 1 .003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"
                      />
                    </svg>
                    <svg
                      class="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      v-else-if="platform === 'tiktok'"
                    >
                      <path
                        d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.245V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"
                      />
                    </svg>
                    <span class="capitalize">{{ platform }}</span>
                  </a>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <NuxtLink
                :to="`/edit-creator?id=${creator.id}`"
                class="px-4 py-2 text-sm font-medium text-blue-400 hover:text-blue-300 bg-blue-900/20 hover:bg-blue-900/30 border border-blue-800 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit
              </NuxtLink>
              <button
                @click="deleteCreator(creator.id)"
                class="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 bg-red-900/20 hover:bg-red-900/30 border border-red-800 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>

          <div class="mt-4 pt-4 border-t border-gray-800 text-xs text-gray-500">
            Registered on:
            {{ new Date(creator.createdAt).toLocaleString("en-US") }}
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

// Meta tags
useHead({
  title: "Registered Creators - ExitLag",
  meta: [
    {
      name: "description",
      content: "List of all creators registered in the system",
    },
  ],
});

interface Creator {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  mainGame: string;
  socials?: Record<string, string>;
  createdAt: string;
  updatedAt?: string;
}

const creators = ref<Creator[]>([]);

// Computed properties
const creatorsWithSocials = computed(() => {
  return creators.value.filter(
    (c) => c.socials && Object.keys(c.socials).length > 0
  ).length;
});

const mostPopularGame = computed(() => {
  const games = creators.value.map((c) => c.mainGame);
  const gameCounts: Record<string, number> = {};
  games.forEach((game) => {
    gameCounts[game] = (gameCounts[game] || 0) + 1;
  });
  const sorted = Object.entries(gameCounts).sort((a, b) => b[1] - a[1]);
  return sorted.length > 0 ? sorted[0][0] : null;
});

// Load creators from localStorage
const loadCreators = () => {
  try {
    const stored = localStorage.getItem("creators");
    if (stored) {
      creators.value = JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading creators:", error);
    creators.value = [];
  }
};

// Delete creator
const deleteCreator = (id: string) => {
  if (confirm("Are you sure you want to delete this creator?")) {
    try {
      const updated = creators.value.filter((c) => c.id !== id);
      localStorage.setItem("creators", JSON.stringify(updated));
      creators.value = updated;
    } catch (error) {
      console.error("Error deleting creator:", error);
      alert("Error deleting creator. Please try again.");
    }
  }
};

// Load on mount
onMounted(() => {
  loadCreators();
});
</script>

