<script setup lang="ts">
const { data: banks } = await useAsyncData('sidebar-banks', () => Promise.resolve(useQuestionBanks()))
</script>

<template>
  <nav class="flex h-full flex-col gap-1 overflow-y-auto p-4">
    <NuxtLink
      to="/"
      class="mb-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
      active-class="bg-brand-50 text-brand-700"
    >
      Accueil
    </NuxtLink>
    <NuxtLink
      to="/examen"
      class="mb-4 rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
    >
      Simulation d'examen
    </NuxtLink>

    <p class="mb-1 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
      Leçons
    </p>
    <ul class="flex flex-1 flex-col gap-0.5">
      <li v-for="bank in banks" :key="bank.slug">
        <NuxtLink
          :to="`/lecon/${bank.slug}`"
          class="flex items-center justify-between rounded-lg px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100"
          active-class="bg-brand-50 text-brand-700 font-medium"
        >
          <span class="truncate">{{ bank.title }}</span>
          <span class="ml-2 shrink-0 text-xs text-slate-400">{{ bank.questions.length }}</span>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
