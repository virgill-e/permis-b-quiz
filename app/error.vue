<script setup lang="ts">
const props = defineProps<{ error: { statusCode: number; statusMessage?: string } }>()
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-4 text-center">
    <p class="text-6xl">🚧</p>
    <h1 class="text-xl font-bold text-slate-900">{{ props.error.statusCode }} — {{ props.error.statusMessage || 'Page introuvable' }}</h1>
    <NuxtLink to="/" class="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white">
      Retour à l'accueil
    </NuxtLink>
  </div>
</template>
