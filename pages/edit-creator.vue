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
          <div class="flex items-center gap-4">
            <NuxtLink
              to="/creators"
              class="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Ver Creators
            </NuxtLink>
            <NuxtLink
              to="/"
              class="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Voltar ao Dashboard
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-[800px] mx-auto px-6 lg:px-8 py-8">
      <!-- Title Section -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-white">Editar Creator</h1>
        <p class="mt-1 text-sm text-gray-500">
          Atualize os dados do criador abaixo
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loadingData" class="bg-black rounded-lg border border-gray-800 p-8 text-center">
        <svg class="w-12 h-12 animate-spin text-brand-red mx-auto mb-4" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-white font-medium">Carregando dados...</p>
      </div>

      <!-- Form Card -->
      <div v-else-if="creator" class="bg-black rounded-lg border border-gray-800 p-6 lg:p-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Nome -->
          <div>
            <label
              for="name"
              class="block text-sm font-medium text-gray-300 mb-2"
            >
              Nome <span class="text-brand-red">*</span>
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              placeholder="Digite o nome completo"
              class="w-full px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all"
            />
            <p v-if="errors.name" class="mt-1.5 text-sm text-red-500">
              {{ errors.name }}
            </p>
          </div>

          <!-- E-mail -->
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-gray-300 mb-2"
            >
              E-mail <span class="text-brand-red">*</span>
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              placeholder="exemplo@email.com"
              class="w-full px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all"
            />
            <p v-if="errors.email" class="mt-1.5 text-sm text-red-500">
              {{ errors.email }}
            </p>
          </div>

          <!-- Telefone -->
          <div>
            <label
              for="phone"
              class="block text-sm font-medium text-gray-300 mb-2"
            >
              Telefone <span class="text-brand-red">*</span>
            </label>
            <input
              id="phone"
              v-model="form.phone"
              type="tel"
              required
              placeholder="(00) 00000-0000"
              @input="formatPhone"
              maxlength="15"
              class="w-full px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all"
            />
            <p v-if="errors.phone" class="mt-1.5 text-sm text-red-500">
              {{ errors.phone }}
            </p>
          </div>

          <!-- Senha -->
          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-300 mb-2"
            >
              Senha <span class="text-brand-red">*</span>
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              placeholder="Mínimo 8 caracteres"
              class="w-full px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all"
            />
            <p v-if="errors.password" class="mt-1.5 text-sm text-red-500">
              {{ errors.password }}
            </p>
          </div>

          <!-- Jogo Principal -->
          <div>
            <label
              for="mainGame"
              class="block text-sm font-medium text-gray-300 mb-2"
            >
              Jogo Principal <span class="text-brand-red">*</span>
            </label>
            <input
              id="mainGame"
              v-model="form.mainGame"
              type="text"
              required
              placeholder="Digite o nome do jogo principal"
              class="w-full px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all"
            />
            <p v-if="errors.mainGame" class="mt-1.5 text-sm text-red-500">
              {{ errors.mainGame }}
            </p>
          </div>

          <!-- Redes Sociais Section -->
          <div class="pt-6 border-t border-gray-800">
            <h3 class="text-lg font-semibold text-white mb-4">Redes Sociais</h3>
            
            <!-- YouTube -->
            <div class="mb-4">
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
                  v-model="form.socials.youtube"
                  type="url"
                  placeholder="https://youtube.com/@usuario"
                  class="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all"
                />
              </div>
            </div>

            <!-- Twitch -->
            <div class="mb-4">
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
                  v-model="form.socials.twitch"
                  type="url"
                  placeholder="https://twitch.tv/usuario"
                  class="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all"
                />
              </div>
            </div>

            <!-- TikTok -->
            <div class="mb-4">
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
                  v-model="form.socials.tiktok"
                  type="url"
                  placeholder="https://tiktok.com/@usuario"
                  class="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all"
                />
              </div>
            </div>

            <!-- Instagram -->
            <div class="mb-4">
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
                  v-model="form.socials.instagram"
                  type="url"
                  placeholder="https://instagram.com/usuario"
                  class="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all"
                />
              </div>
            </div>

            <!-- Twitter/X -->
            <div class="mb-4">
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
                  v-model="form.socials.twitter"
                  type="url"
                  placeholder="https://twitter.com/usuario"
                  class="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all"
                />
              </div>
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
                Creator atualizado com sucesso!
              </p>
              <p class="text-xs text-green-500/80 mt-1">
                Os dados foram salvos e atualizados no sistema.
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
              <p class="text-sm font-medium text-red-400">Erro ao atualizar</p>
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
                loading ? "Salvando..." : "Salvar Alterações"
              }}</span>
            </button>
            <NuxtLink
              to="/creators"
              class="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-lg transition-colors flex items-center justify-center"
            >
              Cancelar
            </NuxtLink>
          </div>
        </form>
      </div>

      <!-- Not Found -->
      <div v-else class="bg-black rounded-lg border border-gray-800 p-8 text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-900 mb-4">
          <svg class="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-white mb-2">Creator não encontrado</h3>
        <p class="text-gray-500 mb-6">O creator que você está tentando editar não existe.</p>
        <NuxtLink
          to="/creators"
          class="inline-flex px-6 py-3 bg-brand-red hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
        >
          Voltar para Listagem
        </NuxtLink>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";

// Meta tags
useHead({
  title: "Editar Creator - ExitLag",
  meta: [
    {
      name: "description",
      content: "Edite os dados do criador",
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

// Get creator ID from query
const route = useRoute();
const creatorId = ref<string>("");
const creator = ref<Creator | null>(null);
const loadingData = ref(true);

// Form state
const form = reactive({
  name: "",
  email: "",
  phone: "",
  password: "",
  mainGame: "",
  socials: {
    youtube: "",
    twitch: "",
    tiktok: "",
    instagram: "",
    twitter: "",
  },
});

const errors = reactive({
  name: "",
  email: "",
  phone: "",
  password: "",
  mainGame: "",
});

const loading = ref(false);
const success = ref(false);
const submitError = ref("");

// Phone mask function
const formatPhone = (event: Event) => {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/\D/g, ""); // Remove tudo que não é dígito

  // Limita a 11 dígitos (máximo para celular brasileiro)
  if (value.length > 11) {
    value = value.slice(0, 11);
  }

  // Aplica a máscara conforme o tamanho
  if (value.length <= 10) {
    // Telefone fixo: (00) 0000-0000
    if (value.length <= 6) {
      value = value.replace(/^(\d{0,2})(\d{0,4})/, (match, p1, p2) => {
        if (p2) return `(${p1}) ${p2}`;
        if (p1) return `(${p1}`;
        return value;
      });
    } else {
      value = value.replace(/^(\d{2})(\d{4})(\d{0,4})/, (match, p1, p2, p3) => {
        if (p3) return `(${p1}) ${p2}-${p3}`;
        return `(${p1}) ${p2}`;
      });
    }
  } else {
    // Celular: (00) 00000-0000
    value = value.replace(/^(\d{2})(\d{5})(\d{0,4})/, (match, p1, p2, p3) => {
      if (p3) return `(${p1}) ${p2}-${p3}`;
      return `(${p1}) ${p2}`;
    });
  }

  form.phone = value;
};

// Load creator data
const loadCreator = () => {
  try {
    const id = route.query.id as string;
    if (!id) {
      navigateTo("/creators");
      return;
    }

    creatorId.value = id;

    const stored = localStorage.getItem("creators");
    if (stored) {
      const creators: Creator[] = JSON.parse(stored);
      const foundCreator = creators.find((c) => c.id === id);

      if (foundCreator) {
        creator.value = foundCreator;
        // Preencher formulário com dados existentes
        form.name = foundCreator.name;
        form.email = foundCreator.email;
        form.phone = foundCreator.phone;
        form.password = foundCreator.password;
        form.mainGame = foundCreator.mainGame;

        // Preencher redes sociais
        if (foundCreator.socials) {
          form.socials.youtube = foundCreator.socials.youtube || "";
          form.socials.twitch = foundCreator.socials.twitch || "";
          form.socials.tiktok = foundCreator.socials.tiktok || "";
          form.socials.instagram = foundCreator.socials.instagram || "";
          form.socials.twitter = foundCreator.socials.twitter || "";
        }
      }
    }
  } catch (error) {
    console.error("Erro ao carregar creator:", error);
    submitError.value = "Erro ao carregar dados do creator";
  } finally {
    loadingData.value = false;
  }
};

// Validation
const validateForm = (): boolean => {
  let isValid = true;

  // Reset errors
  Object.keys(errors).forEach((key) => {
    errors[key as keyof typeof errors] = "";
  });

  // Name validation
  if (!form.name.trim()) {
    errors.name = "Nome é obrigatório";
    isValid = false;
  } else if (form.name.trim().length < 3) {
    errors.name = "Nome deve ter pelo menos 3 caracteres";
    isValid = false;
  }

  // Email validation
  if (!form.email.trim()) {
    errors.email = "E-mail é obrigatório";
    isValid = false;
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      errors.email = "E-mail inválido";
      isValid = false;
    }
  }

  // Phone validation
  if (!form.phone.trim()) {
    errors.phone = "Telefone é obrigatório";
    isValid = false;
  } else {
    // Remove caracteres não numéricos para validar
    const phoneDigits = form.phone.replace(/\D/g, "");
    if (phoneDigits.length < 10 || phoneDigits.length > 11) {
      errors.phone = "Telefone deve ter 10 ou 11 dígitos";
      isValid = false;
    }
  }

  // Password validation
  if (!form.password) {
    errors.password = "Senha é obrigatória";
    isValid = false;
  } else if (form.password.length < 8) {
    errors.password = "Senha deve ter pelo menos 8 caracteres";
    isValid = false;
  }

  // Main game validation
  if (!form.mainGame) {
    errors.mainGame = "Jogo principal é obrigatório";
    isValid = false;
  }

  return isValid;
};

// Submit handler
const handleSubmit = async () => {
  success.value = false;
  submitError.value = "";

  if (!validateForm()) {
    return;
  }

  loading.value = true;

  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Buscar creators do localStorage
    const existingCreators = JSON.parse(
      localStorage.getItem("creators") || "[]"
    );

    // Encontrar o criador pelo ID
    const creatorIndex = existingCreators.findIndex(
      (c: Creator) => c.id === creatorId.value
    );

    if (creatorIndex === -1) {
      throw new Error("Criador não encontrado");
    }

    // Filtrar apenas redes sociais preenchidas
    const filledSocials: Record<string, string> = {};
    Object.entries(form.socials).forEach(([key, value]) => {
      if (value && value.trim()) {
        filledSocials[key] = value.trim();
      }
    });

    // Atualizar o criador
    existingCreators[creatorIndex] = {
      ...existingCreators[creatorIndex],
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password,
      mainGame: form.mainGame,
      socials: filledSocials,
      updatedAt: new Date().toISOString(),
    };

    // Salvar de volta no localStorage
    localStorage.setItem("creators", JSON.stringify(existingCreators));

    success.value = true;

    // Redirecionar para página de listagem após 2 segundos
    setTimeout(() => {
      navigateTo("/creators");
    }, 2000);
  } catch (error) {
    submitError.value =
      error instanceof Error
        ? error.message
        : "Erro ao atualizar criador. Tente novamente.";
  } finally {
    loading.value = false;
  }
};

// Load on mount
onMounted(() => {
  loadCreator();
});
</script>

