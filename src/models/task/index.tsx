import moment from "moment"
import type { task } from "../../types/task"
import { updateTask } from "../../api/task"
import type { TaskTimeframeType } from "../../types/taskTimeframe"
import { daysEnum } from "../../types/days"

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
    const done = this.lastCompleted
    if (done == undefined) return false
    const yesterday = moment().subtract(1, 'day').startOf('day').toDate()
    return done >= yesterday
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

  doneLastTimeframe(): boolean {
    console.log(this.name, "Has timeframe?")
    const tf = this.timeframes
    console.log("how many timeframe", tf)
    const tfl = this.timeframes.length
    console.log("last timeframe?", tfl)
    const tfhd = this.timeframes[0].days
    console.log("timeframe 0 has days", tfhd)
    const tfdl = this.timeframes[0].days?.length
    console.log("timeframe 0 has ", tfdl, " days")
    const tfdht = this.timeframes[0].days?.[0]
    console.log("timeframe 0 day 0 is ", tfdht)

    return false
    /*if (!tf) return false
    for (let i = 0; i < tfl; i++) {
      if (!this.timeframes[i].days?.length) return false
      console.log("timeframe", i)
      for (let j = 0; j < this.timeframes[i].days?.length; j++) {
        return !!this.timeframes[i].days[j]
      }
    }*/
  }
  relevantToday(): boolean {
    const todayDay = moment().day() - 1
    console.log(daysEnum[todayDay])
    console.log(todayDay)
    const c = this.timeframes.some((tf) => {
      const x = tf.days?.some((x) => {
        console.log(this.name, "day", daysEnum[x])
        return daysEnum[todayDay] == daysEnum[x]

      })
      console.log(x)
      return x
    })
    console.log("relevantToday", c)
    return c
  }


  doneThisTimeframe(): boolean {
    const current = this.currentTimeframe()
    if (current && this.lastCompleted)
      if (this.lastCompleted > new Date(current.start)
        && this.lastCompleted < new Date(current.finish))
        return true
    return false
  }

  currentTimeframe(): (TaskTimeframeType | null) {
    if (!this.timeframes || !this.timeframes.length) return null
    if (!this.relevantToday()) return null
  console.log("is relevant!")
    const relevantNow = this.timeframes.map((tf) => {
      return moment(tf.start, "HH:mm").isAfter(moment()) && moment(tf.finish, "HH:mm").isBefore(moment()) ? tf : null
    })
    if (!relevantNow || !relevantNow.length) return null
    return relevantNow[0]
  }

  currentlyRelevant(): boolean {
    //console.log(this.doneLastTimeframe())
    if (this.isStreak && this.doneToday()) return false
    if (this.doneThisTimeframe()) return false
    if (!this.currentTimeframe()) return false
    console.warn(this.name, "WENT PAST ALL CHECKS")
    return true
  }

  async doLater() {
    /**Adds "postPoned" to the history of task and pushes the task back x minutes*/
    if (!this.currentTimeframe) return this
    //this.history.push({ event: 'postponed', at: new Date() })

    const minutesModifier = 15
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

