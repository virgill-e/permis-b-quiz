<script setup lang="ts">
const route = useRoute()
const slug = computed(() => String(route.params.slug))
const bank = useQuestionBank(slug.value)

if (!bank) {
  throw createError({ statusCode: 404, statusMessage: 'Leçon introuvable' })
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

interface Answered {
  questionId: string
  selectedIndex: number
  correct: boolean
}

const questions = ref(shuffle(bank!.questions).map(q => ({
  ...q,
  lessonSlug: bank!.slug,
  lessonTitle: bank!.title,
  sourceFile: bank!.sourceFile
})))
const currentIndex = ref(0)
const answers = ref<Answered[]>([])
const finished = ref(false)

const current = computed(() => questions.value[currentIndex.value])
const isLast = computed(() => currentIndex.value === questions.value.length - 1)
const hasAnsweredCurrent = computed(() => answers.value.some(a => a.questionId === current.value?.id))

function onAnswer(selectedIndex: number) {
  const q = current.value
  answers.value.push({
    questionId: q.id,
    selectedIndex,
    correct: selectedIndex === q.correctIndex
  })
}

function next() {
  if (isLast.value) {
    finished.value = true
    return
  }
  currentIndex.value += 1
}

function restart() {
  questions.value = shuffle(bank!.questions).map(q => ({
    ...q,
    lessonSlug: bank!.slug,
    lessonTitle: bank!.title,
    sourceFile: bank!.sourceFile
  }))
  currentIndex.value = 0
  answers.value = []
  finished.value = false
}

const correctCount = computed(() => answers.value.filter(a => a.correct).length)
const wrongAnswers = computed(() => answers.value.filter(a => !a.correct).map(a => ({
  answer: a,
  question: questions.value.find(q => q.id === a.questionId)!
})))
</script>

<template>
  <div v-if="bank" class="mx-auto max-w-2xl">
    <div class="mb-6">
      <NuxtLink to="/" class="text-sm text-brand-700 hover:underline">← Toutes les leçons</NuxtLink>
      <h1 class="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">{{ bank.title }}</h1>
    </div>

    <template v-if="!finished">
      <div class="mb-4 h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          class="h-full rounded-full bg-brand-600 transition-all"
          :style="{ width: `${(currentIndex / questions.length) * 100}%` }"
        />
      </div>

      <QuestionCard
        :question="current"
        :index="currentIndex"
        :total="questions.length"
        :reveal-immediately="true"
        @answer="onAnswer"
      />

      <div class="mt-5 flex justify-end">
        <button
          type="button"
          :disabled="!hasAnsweredCurrent"
          class="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
          @click="next"
        >
          {{ isLast ? 'Voir le résultat' : 'Question suivante' }}
        </button>
      </div>
    </template>

    <template v-else>
      <div class="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-10">
        <p class="text-sm font-medium text-slate-500">Résultat</p>
        <p class="mt-1 text-4xl font-bold text-slate-900">{{ correctCount }} / {{ questions.length }}</p>
        <p class="mt-2 text-slate-500">
          {{ correctCount === questions.length ? 'Sans faute, bravo !' : 'Revois les explications ci-dessous avant de recommencer.' }}
        </p>
        <button
          type="button"
          class="mt-5 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
          @click="restart"
        >
          Recommencer cette leçon
        </button>
      </div>

      <div v-if="wrongAnswers.length" class="mt-8">
        <h2 class="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">À revoir</h2>
        <div class="flex flex-col gap-4">
          <div
            v-for="item in wrongAnswers"
            :key="item.question.id"
            class="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm"
          >
            <p class="font-medium text-slate-900">{{ item.question.question }}</p>
            <p class="mt-1 text-rose-700">
              Ta réponse : {{ item.question.choices[item.answer.selectedIndex] }}
            </p>
            <p class="mt-1 text-emerald-700">
              Bonne réponse : {{ item.question.choices[item.question.correctIndex] }}
            </p>
            <p class="mt-2 text-slate-600">{{ item.question.explanation }}</p>
            <a
              :href="`${useRuntimeConfig().app.baseURL}pdf/${encodeURIComponent(item.question.sourceFile)}#page=${item.question.page}`"
              target="_blank"
              rel="noopener"
              class="mt-2 inline-flex items-center gap-1.5 text-brand-700 underline decoration-brand-300 underline-offset-2 hover:text-brand-800"
            >
              📖 Page {{ item.question.page }}
            </a>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
