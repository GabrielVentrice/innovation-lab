<template>
  <div :class="containerClasses">
    <div v-if="variant === 'spinner'" :class="spinnerClasses">
      <svg class="animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <div v-else-if="variant === 'dots'" class="flex space-x-2">
      <div v-for="i in 3" :key="i" :class="dotClasses" :style="{ animationDelay: `${i * 0.15}s` }"></div>
    </div>

    <div v-else-if="variant === 'pulse'" :class="pulseClasses"></div>

    <p v-if="text" :class="textClasses">
      {{ text }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'spinner' | 'dots' | 'pulse'
  size?: 'sm' | 'md' | 'lg'
  text?: string
  centered?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'spinner',
  size: 'md',
  centered: false,
})

const containerClasses = computed(() => {
  const base = 'flex flex-col items-center gap-3'
  const center = props.centered ? 'justify-center min-h-[200px]' : ''
  return [base, center].filter(Boolean).join(' ')
})

const spinnerClasses = computed(() => {
  const sizes = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  }
  return ['text-primary', sizes[props.size]].join(' ')
})

const dotClasses = computed(() => {
  const sizes = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4',
  }
  return [
    'rounded-full bg-primary animate-bounce',
    sizes[props.size]
  ].join(' ')
})

const pulseClasses = computed(() => {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  }
  return [
    'rounded-full bg-primary animate-pulse',
    sizes[props.size]
  ].join(' ')
})

const textClasses = computed(() => {
  return 'text-gray-600 text-sm font-medium'
})
</script>
