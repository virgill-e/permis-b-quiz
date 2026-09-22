import type { Question } from './useQuestionBanks'

export interface ExamQuestion extends Question {
  lessonSlug: string
  lessonTitle: string
  sourceFile: string
}

export interface ExamAnswer {
  question: ExamQuestion
  selectedIndex: number | null
  correct: boolean
  penalty: number
}

export const EXAM_SIZE = 50
export const PASS_SCORE = 41
export const START_SCORE = 50

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function drawExamQuestions(pool: ExamQuestion[], size = EXAM_SIZE): ExamQuestion[] {
  const shuffled = shuffle(pool)
  return shuffled.slice(0, Math.min(size, shuffled.length))
}

export function penaltyFor(question: Question, selectedIndex: number | null): number {
  if (selectedIndex === null) return 1
  if (selectedIndex === question.correctIndex) return 0
  return question.severity === 'grave' ? 5 : 1
}

export function maxAchievableScore(totalQuestions: number, penaltySoFar: number, answeredSoFar: number): number {
  const remaining = totalQuestions - answeredSoFar
  return START_SCORE - penaltySoFar - 0 * remaining
}

export function isMathematicallyFailed(totalQuestions: number, penaltySoFar: number, answeredSoFar: number): boolean {
  return maxAchievableScore(totalQuestions, penaltySoFar, answeredSoFar) < PASS_SCORE
}
