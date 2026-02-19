import moment from "moment"
import type { task } from "../../types/task"

export const doneToday = ((t: task) => {
  return t.lastCompleted && t.lastCompleted >= moment(new Date()).startOf("day").toDate()
})

export const doneYesterday = ((t: task) => {
  return t.lastCompleted && t.lastCompleted >= moment(new Date()).subtract(1, 'day').startOf('day').toDate()
})

export const markComplete = (t: task) => {
  t.lastCompleted = new Date()
  if (t.isStreak) updateStreak(t)
}

export const markCancelled = (t: task) => {
  t.lastCompleted = new Date()
  if (t.isStreak) updateStreak(t)
}
export const updateStreak = ((t: task) => {
  if (!t.streakCount) t.streakCount = 0
  if (doneToday(t))
    t.streakCount += 1
})
