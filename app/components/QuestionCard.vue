<script setup lang="ts">
import type { Question } from '~/composables/useQuestionBanks'

const props = defineProps<{
  question: Question & { lessonSlug: string; lessonTitle: string; sourceFile: string }
  index: number
  total: number
  revealImmediately?: boolean
}>()

const emit = defineEmits<{
  answer: [selectedIndex: number]
}>()

const selected = ref<number | null>(null)
const revealed = ref(false)

watch(() => props.question.id, () => {
  selected.value = null
  revealed.value = false
})

function choose(idx: number) {
  if (revealed.value) return
  selected.value = idx
  if (props.revealImmediately) revealed.value = true
  emit('answer', idx)
}

function choiceClasses(idx: number) {
  const base = 'w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors'
  if (!revealed.value) {
    return selected.value === idx
      ? `${base} border-brand-500 bg-brand-50 text-brand-800`
      : `${base} border-slate-200 bg-white hover:border-brand-300 hover:bg-brand-50/50`
  }
  if (idx === props.question.correctIndex) {
    return `${base} border-emerald-500 bg-emerald-50 text-emerald-800`
  }
  if (idx === selected.value) {
    return `${base} border-rose-500 bg-rose-50 text-rose-800`
  }
  return `${base} border-slate-200 bg-white text-slate-400`
}

const pdfHref = computed(() => `${useRuntimeConfig().app.baseURL}pdf/${encodeURIComponent(props.question.sourceFile)}#page=${props.question.page}`)
</script>

<template>
  <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
    <div class="mb-4 flex items-center justify-between text-xs font-medium text-slate-400">
      <span>Question {{ index + 1 }} / {{ total }}</span>
      <span
        v-if="question.severity === 'grave'"
        class="rounded-full bg-rose-100 px-2.5 py-1 text-rose-700"
      >Faute grave (5 pts)</span>
      <span v-else class="rounded-full bg-slate-100 px-2.5 py-1 text-slate-500">Faute simple (1 pt)</span>
    </div>

    <h2 class="mb-5 text-lg font-semibold leading-snug text-slate-900 sm:text-xl">
      {{ question.question }}
    </h2>

    <div class="flex flex-col gap-2.5">
      <button
        v-for="(choice, idx) in question.choices"
        :key="idx"
        type="button"
        :class="choiceClasses(idx)"
        @click="choose(idx)"
      >
        {{ choice }}
      </button>
    </div>

    <div v-if="revealed" class="mt-5 rounded-xl bg-slate-50 p-4 text-sm">
      <p class="font-medium" :class="selected === question.correctIndex ? 'text-emerald-700' : 'text-rose-700'">
        {{ selected === question.correctIndex ? 'Bonne réponse !' : 'Mauvaise réponse' }}
      </p>
      <p class="mt-1 text-slate-600">{{ question.explanation }}</p>
      <a
        :href="pdfHref"
        target="_blank"
        rel="noopener"
        class="mt-3 inline-flex items-center gap-1.5 text-brand-700 underline decoration-brand-300 underline-offset-2 hover:text-brand-800"
      >
        📖 Voir la leçon « {{ question.lessonTitle }} » — page {{ question.page }}
      </a>
    </div>
  </div>
</template>
