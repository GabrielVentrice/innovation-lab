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
          <NuxtLink
            to="/"
            class="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Voltar ao Dashboard
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-[800px] mx-auto px-6 lg:px-8 py-8">
      <!-- Title Section -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-white">Redes Sociais</h1>
        <p class="mt-1 text-sm text-gray-500">
          Adicione as redes sociais do criador (opcional)
        </p>
      </div>

      <!-- Form Card -->
      <div class="bg-black rounded-lg border border-gray-800 p-6 lg:p-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- YouTube -->
          <div>
            <label
              for="youtube"
              class="block text-sm font-medium text-gray-300 mb-2"
            >
              YouTube
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
              <input
                id="youtube"
                v-model="socials.youtube"
                type="url"
                placeholder="https://youtube.com/@usuario"
                class="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all"
              />
            </div>
          </div>

          <!-- Twitch -->
          <div>
            <label
              for="twitch"
              class="block text-sm font-medium text-gray-300 mb-2"
            >
              Twitch
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
                </svg>
              </div>
              <input
                id="twitch"
                v-model="socials.twitch"
                type="url"
                placeholder="https://twitch.tv/usuario"
                class="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all"
              />
            </div>
          </div>

          <!-- TikTok -->
          <div>
            <label
              for="tiktok"
              class="block text-sm font-medium text-gray-300 mb-2"
            >
              TikTok
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </div>
              <input
                id="tiktok"
                v-model="socials.tiktok"
                type="url"
                placeholder="https://tiktok.com/@usuario"
                class="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all"
              />
            </div>
          </div>

          <!-- Instagram -->
          <div>
            <label
              for="instagram"
              class="block text-sm font-medium text-gray-300 mb-2"
            >
              Instagram
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.057-1.274-.07-1.649-.07-4.844 0-3.196.016-3.586.074-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                </svg>
              </div>
              <input
                id="instagram"
                v-model="socials.instagram"
                type="url"
                placeholder="https://instagram.com/usuario"
                class="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all"
              />
            </div>
          </div>

          <!-- Twitter/X -->
          <div>
            <label
              for="twitter"
              class="block text-sm font-medium text-gray-300 mb-2"
            >
              Twitter/X
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </div>
              <input
                id="twitter"
                v-model="socials.twitter"
                type="url"
                placeholder="https://twitter.com/usuario"
                class="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all"
              />
            </div>
          </div>

          <!-- Success Message -->
          <div
            v-if="success"
            class="bg-green-900/20 border border-green-800 rounded-lg p-4 flex items-start gap-3"
          >
            <svg
              class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p class="text-sm font-medium text-green-400">
                Redes sociais salvas com sucesso!
              </p>
              <p class="text-xs text-green-500/80 mt-1">
                O criador foi cadastrado completamente no sistema.
              </p>
            </div>
          </div>

          <!-- Error Message -->
          <div
            v-if="submitError"
            class="bg-red-900/20 border border-red-800 rounded-lg p-4 flex items-start gap-3"
          >
            <svg
              class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p class="text-sm font-medium text-red-400">Erro ao salvar</p>
              <p class="text-xs text-red-500/80 mt-1">
                {{ submitError }}
              </p>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex gap-4 pt-4">
            <button
              type="submit"
              :disabled="loading"
              class="flex-1 px-6 py-3 bg-brand-red hover:bg-primary-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg
                v-if="loading"
                class="w-5 h-5 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>{{
                loading ? "Salvando..." : "Finalizar Cadastro"
              }}</span>
            </button>
            <button
              type="button"
              @click="skipSocials"
              class="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-lg transition-colors flex items-center justify-center"
            >
              Pular
            </button>
            <NuxtLink
              to="/register"
              class="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-lg transition-colors flex items-center justify-center"
            >
              Voltar
            </NuxtLink>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";

// Meta tags
useHead({
  title: "Redes Sociais - ExitLag",
  meta: [
    {
      name: "description",
      content: "Adicione as redes sociais do criador",
    },
  ],
});

// Get creator ID from query
const route = useRoute();
const creatorId = ref<string>("");

// Form state
const socials = reactive({
  youtube: "",
  twitch: "",
  tiktok: "",
  instagram: "",
  twitter: "",
});

const loading = ref(false);
const success = ref(false);
const submitError = ref("");

// Load creator ID on mount
onMounted(() => {
  const id = route.query.id as string;
  if (!id) {
    // Se não houver ID, redirecionar para registro
    navigateTo("/register");
    return;
  }
  creatorId.value = id;
});

// Submit handler
const handleSubmit = async () => {
  success.value = false;
  submitError.value = "";

  loading.value = true;

  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Buscar creators do localStorage
    const existingCreators = JSON.parse(
      localStorage.getItem("creators") || "[]"
    );

    // Encontrar o criador pelo ID
    const creatorIndex = existingCreators.findIndex(
      (c: any) => c.id === creatorId.value
    );

    if (creatorIndex === -1) {
      throw new Error("Criador não encontrado");
    }

    // Filtrar apenas redes sociais preenchidas
    const filledSocials: Record<string, string> = {};
    Object.entries(socials).forEach(([key, value]) => {
      if (value && value.trim()) {
        filledSocials[key] = value.trim();
      }
    });

    // Atualizar o criador com as redes sociais
    existingCreators[creatorIndex].socials = filledSocials;
    existingCreators[creatorIndex].updatedAt = new Date().toISOString();

    // Salvar de volta no localStorage
    localStorage.setItem("creators", JSON.stringify(existingCreators));

    // Limpar ID temporário
    localStorage.removeItem("currentCreatorId");

    success.value = true;

    // Redirecionar para página de campaigns após 2 segundos
    setTimeout(() => {
      navigateTo("/campaigns");
    }, 2000);
  } catch (error) {
    submitError.value =
      error instanceof Error
        ? error.message
        : "Erro ao salvar redes sociais. Tente novamente.";
  } finally {
    loading.value = false;
  }
};

// Skip socials
const skipSocials = async () => {
  try {
    // Limpar ID temporário
    localStorage.removeItem("currentCreatorId");

    // Redirecionar para página de campaigns
    await navigateTo("/campaigns");
  } catch (error) {
    submitError.value = "Erro ao pular etapa. Tente novamente.";
  }
};
</script>

