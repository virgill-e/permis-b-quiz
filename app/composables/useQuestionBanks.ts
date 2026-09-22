export interface Question {
  id: string
  question: string
  choices: string[]
  correctIndex: number
  explanation: string
  severity: 'normale' | 'grave'
  page: number
}

export interface QuestionBank {
  slug: string
  sourceFile: string
  title: string
  lessonNumber: string | null
  questions: Question[]
}

const modules = import.meta.glob<{ default: Omit<QuestionBank, 'lessonNumber'> }>(
  '../../content/questions/*.json',
  { eager: true }
)

function extractLessonNumber(slug: string): string | null {
  const match = slug.match(/^(\d+)-/)
  return match ? match[1] : null
}

function buildBanks(): QuestionBank[] {
  const banks = Object.values(modules).map((mod) => {
    const data = mod.default
    return {
      ...data,
      lessonNumber: extractLessonNumber(data.slug)
    }
  })

  banks.sort((a, b) => {
    const na = a.lessonNumber !== null ? Number(a.lessonNumber) : null
    const nb = b.lessonNumber !== null ? Number(b.lessonNumber) : null
    if (na !== null && nb !== null) {
      if (na !== nb) return na - nb
      return a.slug.localeCompare(b.slug)
    }
    if (na !== null) return -1
    if (nb !== null) return 1
    return a.slug.localeCompare(b.slug)
  })

  return banks
}

let cached: QuestionBank[] | null = null

export function useQuestionBanks(): QuestionBank[] {
  if (!cached) cached = buildBanks()
  return cached
}

export function useQuestionBank(slug: string): QuestionBank | undefined {
  return useQuestionBanks().find(b => b.slug === slug)
}

export function useAllQuestions(): (Question & { lessonSlug: string; lessonTitle: string; sourceFile: string })[] {
  return useQuestionBanks().flatMap(bank =>
    bank.questions.map(q => ({
      ...q,
      lessonSlug: bank.slug,
      lessonTitle: bank.title,
      sourceFile: bank.sourceFile
    }))
  )
}
