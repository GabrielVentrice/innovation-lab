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
        <h1 class="text-2xl font-bold text-white">Cadastro de Creators</h1>
        <p class="mt-1 text-sm text-gray-500">
          Preencha os dados abaixo para cadastrar um novo criador
        </p>
      </div>

      <!-- Form Card -->
      <div class="bg-black rounded-lg border border-gray-800 p-6 lg:p-8">
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
                Criador cadastrado com sucesso!
              </p>
              <p class="text-xs text-green-500/80 mt-1">
                Os dados foram salvos e o criador está disponível no sistema.
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
              <p class="text-sm font-medium text-red-400">Erro ao cadastrar</p>
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
                loading ? "Cadastrando..." : "Cadastrar Criador"
              }}</span>
            </button>
            <NuxtLink
              to="/"
              class="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-lg transition-colors flex items-center justify-center"
            >
              Cancelar
            </NuxtLink>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";

// Meta tags
useHead({
  title: "Cadastro de Criador - ExitLag",
  meta: [
    {
      name: "description",
      content: "Cadastre novos criadores de conteúdo no sistema",
    },
  ],
});

// Form state
const form = reactive({
  name: "",
  email: "",
  phone: "",
  password: "",
  mainGame: "",
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
    // Simular chamada de API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Gerar ID único para o criador
    const creatorId = `creator_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 11)}`;

    // Preparar dados para salvar
    const creatorData = {
      id: creatorId,
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password, // Em produção, isso deveria ser hash
      mainGame: form.mainGame,
      socials: {}, // Será preenchido na próxima página
      createdAt: new Date().toISOString(),
    };

    // Salvar no localStorage
    const existingCreators = JSON.parse(
      localStorage.getItem("creators") || "[]"
    );
    existingCreators.push(creatorData);
    localStorage.setItem("creators", JSON.stringify(existingCreators));

    // Salvar dados temporários para a próxima página
    localStorage.setItem("currentCreatorId", creatorId);

    // Redirecionar para página de redes sociais
    await navigateTo(`/register-socials?id=${creatorId}`);
  } catch (error) {
    submitError.value =
      error instanceof Error
        ? error.message
        : "Erro ao cadastrar criador. Tente novamente.";
    loading.value = false;
  }
};
</script>
