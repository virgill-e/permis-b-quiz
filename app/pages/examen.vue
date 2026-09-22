<script setup lang="ts">
import { drawExamQuestions, penaltyFor, isMathematicallyFailed, PASS_SCORE, START_SCORE, EXAM_SIZE, type ExamAnswer, type ExamQuestion } from '~/composables/useExamSession'

const pool = useAllQuestions() as ExamQuestion[]

const started = ref(false)
const questions = ref<ExamQuestion[]>([])
const currentIndex = ref(0)
const answers = ref<ExamAnswer[]>([])
const selectedIndex = ref<number | null>(null)
const stoppedEarly = ref(false)
const finished = ref(false)

const penaltySoFar = computed(() => answers.value.reduce((sum, a) => sum + a.penalty, 0))
const scoreSoFar = computed(() => START_SCORE - penaltySoFar.value)
const current = computed(() => questions.value[currentIndex.value])
const isLast = computed(() => currentIndex.value === questions.value.length - 1)

function startExam() {
  questions.value = drawExamQuestions(pool, EXAM_SIZE)
  currentIndex.value = 0
  answers.value = []
  selectedIndex.value = null
  stoppedEarly.value = false
  finished.value = false
  started.value = true
}

function choose(idx: number) {
  selectedIndex.value = idx
}

function validate() {
  const q = current.value
  const penalty = penaltyFor(q, selectedIndex.value)
  answers.value.push({
    question: q,
    selectedIndex: selectedIndex.value,
    correct: selectedIndex.value === q.correctIndex,
    penalty
  })

  if (isMathematicallyFailed(questions.value.length, penaltySoFar.value + penalty, answers.value.length)) {
    stoppedEarly.value = true
    finished.value = true
    return
  }

  if (isLast.value) {
    finished.value = true
    return
  }

  currentIndex.value += 1
  selectedIndex.value = null
}

const finalScore = computed(() => Math.max(0, scoreSoFar.value))
const passed = computed(() => !stoppedEarly.value && finalScore.value >= PASS_SCORE)
const wrongAnswers = computed(() => answers.value.filter(a => !a.correct))
</script>

<template>
  <div class="mx-auto max-w-2xl">
    <div v-if="!started" class="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-10">
      <h1 class="text-xl font-bold text-slate-900 sm:text-2xl">Simulation d'examen officiel</h1>
      <div class="mx-auto mt-4 max-w-md space-y-2 text-left text-sm text-slate-600">
        <p>• {{ EXAM_SIZE }} questions tirées au hasard parmi toutes les leçons.</p>
        <p>• Tu pars avec {{ START_SCORE }} points, il en faut au moins {{ PASS_SCORE }}/{{ START_SCORE }} pour réussir.</p>
        <p>• Une erreur simple coûte 1 point, une erreur sur une faute grave coûte 5 points.</p>
        <p>• Comme dans le vrai examen, la session s'arrête dès qu'il est mathématiquement impossible d'atteindre {{ PASS_SCORE }}/{{ START_SCORE }}.</p>
      </div>
      <button
        type="button"
        class="mt-6 rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
        @click="startExam"
      >
        Démarrer la simulation
      </button>
    </div>

    <template v-else-if="!finished">
      <div class="mb-3 flex items-center justify-between text-sm font-medium text-slate-500">
        <span>Question {{ currentIndex + 1 }} / {{ questions.length }}</span>
        <span :class="scoreSoFar < PASS_SCORE ? 'text-rose-600' : 'text-slate-500'">
          Score actuel : {{ scoreSoFar }} / {{ START_SCORE }}
        </span>
      </div>
      <div class="mb-4 h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          class="h-full rounded-full bg-brand-600 transition-all"
          :style="{ width: `${(currentIndex / questions.length) * 100}%` }"
        />
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div class="mb-4 flex items-center justify-between text-xs font-medium text-slate-400">
          <span>Question {{ currentIndex + 1 }} / {{ questions.length }}</span>
          <span
            v-if="current.severity === 'grave'"
            class="rounded-full bg-rose-100 px-2.5 py-1 text-rose-700"
          >Faute grave (5 pts)</span>
          <span v-else class="rounded-full bg-slate-100 px-2.5 py-1 text-slate-500">Faute simple (1 pt)</span>
        </div>
        <h2 class="mb-5 text-lg font-semibold leading-snug text-slate-900 sm:text-xl">
          {{ current.question }}
        </h2>
        <div class="flex flex-col gap-2.5">
          <button
            v-for="(choice, idx) in current.choices"
            :key="idx"
            type="button"
            class="w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors"
            :class="selectedIndex === idx
              ? 'border-brand-500 bg-brand-50 text-brand-800'
              : 'border-slate-200 bg-white hover:border-brand-300 hover:bg-brand-50/50'"
            @click="choose(idx)"
          >
            {{ choice }}
          </button>
        </div>
      </div>

      <div class="mt-5 flex justify-end">
        <button
          type="button"
          :disabled="selectedIndex === null"
          class="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
          @click="validate"
        >
          {{ isLast ? 'Valider et terminer' : 'Valider' }}
        </button>
      </div>
    </template>

    <template v-else>
      <div
        class="rounded-2xl border p-6 text-center shadow-sm sm:p-10"
        :class="passed ? 'border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'"
      >
        <p class="text-sm font-medium" :class="passed ? 'text-emerald-700' : 'text-rose-700'">
          {{ passed ? 'Réussi' : 'Échec' }}
        </p>
        <p class="mt-1 text-4xl font-bold text-slate-900">{{ finalScore }} / {{ START_SCORE }}</p>
        <p v-if="stoppedEarly" class="mt-2 text-sm text-slate-600">
          Session arrêtée après {{ answers.length }} questions : le score de {{ PASS_SCORE }}/{{ START_SCORE }}
          n'était plus atteignable, comme lors du véritable examen.
        </p>
        <p v-else class="mt-2 text-sm text-slate-600">
          {{ answers.length - wrongAnswers.length }} bonnes réponses sur {{ answers.length }}.
        </p>
        <button
          type="button"
          class="mt-5 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
          @click="startExam"
        >
          Refaire une simulation
        </button>
      </div>

      <div v-if="wrongAnswers.length" class="mt-8">
        <h2 class="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Corrections</h2>
        <div class="flex flex-col gap-4">
          <div
            v-for="item in wrongAnswers"
            :key="item.question.id"
            class="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm"
          >
            <p class="font-medium text-slate-900">{{ item.question.question }}</p>
            <p class="mt-1 text-rose-700">
              Ta réponse : {{ item.selectedIndex === null ? '(pas de réponse)' : item.question.choices[item.selectedIndex] }}
              <span class="text-slate-400">(-{{ item.penalty }} pt{{ item.penalty > 1 ? 's' : '' }})</span>
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
              📖 {{ item.question.lessonTitle }} — page {{ item.question.page }}
            </a>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
