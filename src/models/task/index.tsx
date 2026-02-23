import moment from "moment"
import type { task } from "../../types/task"
import { updateTask } from "../../api/task"

export class TaskModel implements task {
  _id: any
  name: string
  startTime?: string
  endTime?: string
  date?: Date
  priority: number
  repeatingFrequency?: string
  repeatingFrequencyCount?: number
  streakCount?: number
  isStreak?: boolean
  lastCompleted?: Date;
  constructor(
    _id: any,
    name: string,
    priority: number,
    startTime?: string,
    endTime?: string,
    date?: Date,
    repeatingFrequency?: string,
    repeatingFrequencyCount?: number,
    streakCount?: number,
    isStreak?: boolean,
    lastCompleted?: Date,
  ) {
    this._id = _id
    this.name = name
    this.priority = priority
    this.startTime = startTime && startTime
    this.endTime = endTime
    this.date = date
    this.repeatingFrequency = repeatingFrequency
    this.repeatingFrequencyCount = repeatingFrequencyCount
    this.streakCount = streakCount
    this.isStreak = isStreak
    this.lastCompleted = lastCompleted
  }

  doneToday() {
    console.log(this.name, this.lastCompleted)
    if (!this.lastCompleted) return false
    const startOfDay = moment().startOf('day')
    const completedAt = moment(this.lastCompleted)
    console.log(this.name, " been completed today: ", startOfDay.isBefore(completedAt))
    return startOfDay.isBefore(completedAt)
  }

  doneYesterday() {
    if (!this.lastCompleted) return false
    return this.lastCompleted && this.lastCompleted >= moment(new Date()).subtract(1, 'day').startOf('day').toDate()
  }

  markComplete() {
    this.lastCompleted = new Date()
    if (this.isStreak) this.updateStreak()
    this.updateTask()
  }

  markCancelled() {
    this.lastCompleted = new Date()
    if (this.isStreak) this.updateStreak()
    this.updateTask()
  }

  updateStreak() {
    if (!this.streakCount) this.streakCount = 0
    if (this.doneToday())
      this.streakCount += 1
  }
  updateTask() {
    updateTask(this)
  }

  currentlyRelevant() {
    if (this.startTime && this.endTime){
      return moment(this.startTime, "HH:mm").isBefore(moment()) && moment(this.endTime, "HH:mm").isAfter(moment()) && !this.doneToday()
    }

    console.log(this.name , " has no start and finish time")
    return false
  }
}

