<script setup lang="ts">
const banks = useQuestionBanks()
const totalQuestions = computed(() => banks.reduce((sum, b) => sum + b.questions.length, 0))
</script>

<template>
  <div>
    <section class="mb-10 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-6 text-white shadow-sm sm:p-10">
      <h1 class="text-2xl font-bold sm:text-3xl">
        Entraînement au code de la route — Permis B (Belgique)
      </h1>
      <p class="mt-3 max-w-2xl text-brand-50">
        {{ totalQuestions }} questions réparties sur {{ banks.length }} leçons, générées à partir de ton support de
        cours. Chaque question renvoie vers la page exacte du PDF concerné.
      </p>
      <div class="mt-6 flex flex-wrap gap-3">
        <NuxtLink
          to="/examen"
          class="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-brand-700 shadow-sm hover:bg-brand-50"
        >
          Lancer une simulation d'examen (50 questions)
        </NuxtLink>
      </div>
    </section>

    <section>
      <h2 class="mb-4 text-lg font-semibold text-slate-800">Leçons</h2>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <NuxtLink
          v-for="bank in banks"
          :key="bank.slug"
          :to="`/lecon/${bank.slug}`"
          class="group flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
        >
          <div class="flex items-center justify-between">
            <span v-if="bank.lessonNumber" class="text-xs font-semibold uppercase tracking-wide text-brand-600">
              Leçon {{ bank.lessonNumber }}
            </span>
            <span v-else class="text-xs font-semibold uppercase tracking-wide text-brand-600">Ressource</span>
            <span class="text-xs text-slate-400">{{ bank.questions.length }} questions</span>
          </div>
          <h3 class="mt-2 font-semibold text-slate-900 group-hover:text-brand-700">
            {{ bank.title }}
          </h3>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
