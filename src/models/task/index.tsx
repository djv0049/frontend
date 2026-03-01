import moment from "moment"
import type { task } from "../../types/task"
import { updateTask } from "../../api/task"
import type { TaskTimeframeType } from "../../types/taskTimeframe"

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
  lastCompleted?: Date
  timeframes: TaskTimeframeType[]
  score: number = 0
  // history: TaskEvent[] = []
  constructor(
    _id: any,
    name: string,
    priority: number,
    timeframes?: TaskTimeframeType[],
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
    this.timeframes = timeframes || []
    this.startTime = startTime && startTime
    this.endTime = endTime && endTime
    this.date = date && date
    // cooldown
    this.repeatingFrequency = repeatingFrequency && repeatingFrequency
    this.repeatingFrequencyCount = repeatingFrequencyCount && repeatingFrequencyCount
    this.streakCount = streakCount && streakCount
    this.isStreak = isStreak && isStreak
    this.lastCompleted = lastCompleted && lastCompleted
  }

  doneToday() {
    if (!this.lastCompleted) return false
    const startOfDay = moment().startOf('day')
    const lastCompleted = moment(this.lastCompleted)
    return startOfDay.isBefore(lastCompleted)
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
    if (!this.doneToday())
      this.streakCount += 1
  }
  updateTask() {
    updateTask(this)
  }

  currentTimeframe(): (TaskTimeframeType | null) {
    console.log("timeframes:", this.name, this.timeframes)
    if (!this.timeframes || !this.timeframes.length) return null
    const relevantToday = this.timeframes.map((tf) => { return tf.days?.find((x) => moment(new Date()).day() === x) ? tf : null })
    if (!relevantToday || !relevantToday.length) return null
    const relevantNow = this.timeframes.map((tf) => {
      return moment(tf.start, "HH:mm").isAfter(moment()) && moment(tf.finish, "HH:mm").isBefore(moment()) ? tf : null
    })
    if (!relevantNow || !relevantNow.length) return null
    console.log(relevantNow)
    return relevantNow[0]
  }

  currentlyRelevant(): boolean {
    // NOTE: temp code to handle legacy objects before their deletion
    if (this.startTime && this.endTime) { return moment(this.startTime, "HH:mm").isBefore(moment(new Date(), "HH:mm")) && moment(this.endTime, "HH:mm").isAfter(moment()) && !this.doneToday() }
    // NOTE: end of temp code

    const current = this.currentTimeframe()
    if (current)
      if (this.doneToday()) return false
    console.log("Current timeframe", current)
    return true
  }

  async doLater() {
    /**Adds "postPoned" to the history of task and pushes the task back x minutes*/
    if (!this.currentTimeframe) return this

    //this.history.push({ event: 'postponed', at: new Date() })

    const minutesModifier = 10
    let end = moment(this.currentTimeframe()?.finish, "HH:mm")
    let start = moment(this.currentTimeframe()?.start, "HH:mm")

    const endOfToday = moment().endOf("day").format("HH:mm")

    if (start.diff(endOfToday, 'minutes') < minutesModifier)
      start = start.add(minutesModifier, 'minutes')

    if (end.diff(endOfToday, 'minutes') < minutesModifier)
      end = end.add(minutesModifier, 'minutes')
    return this
  }
}

