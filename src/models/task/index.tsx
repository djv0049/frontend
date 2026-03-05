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
  repeatingFrequency?: string
  repeatingFrequencyCount?: number
  streakCount?: number
  isStreak?: boolean
  lastModified?: { date: Date, action: string } // TODO: type the action
  timeframes: TaskTimeframeType[]
  score: number = 0
  // history: TaskEvent[] = []
  constructor(
    _id: any,
    name: string,
    timeframes?: TaskTimeframeType[],
    startTime?: string,
    endTime?: string,
    date?: Date,
    repeatingFrequency?: string,
    repeatingFrequencyCount?: number,
    streakCount?: number,
    isStreak?: boolean,
    lastModified?: { date: Date, action: string },
  ) {
    this._id = _id
    this.name = name
    this.timeframes = timeframes || []
    this.startTime = startTime && startTime
    this.endTime = endTime && endTime
    this.date = date && date
    // cooldown
    this.repeatingFrequency = repeatingFrequency && repeatingFrequency
    this.repeatingFrequencyCount = repeatingFrequencyCount && repeatingFrequencyCount
    this.streakCount = streakCount && streakCount
    this.isStreak = isStreak && isStreak
    this.lastModified = lastModified && { ...lastModified }

  }

  doneToday() {
    if (!this.lastModified) return false
    const startOfDay = moment().startOf('day')
    const lastModified = moment(this.lastModified.date)
    return startOfDay.isBefore(lastModified)
  }

  doneYesterday() {
    const done = this.lastModified?.date
    if (done == undefined) return false
    const yesterday = moment().subtract(1, 'day').startOf('day').toDate()
    return done >= yesterday
  }

  markComplete() {
    this.lastModified = {date: new Date(), action: "Complete"}
    if (this.isStreak) this.updateStreak()
    this.updateTask()
  }

  markCancelled() { // FIXME: last completed, should be lastModified with a date and an action
    this.lastModified = {date: new Date(), action: "cancelled"}
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

  getPercentage() {
    console.log("getting percentage")
    const timeframe = this.currentTimeframe()
    if (timeframe == null) return
    const start = moment(timeframe.startTime, "HH:mm")
    const end = moment(timeframe.endTime, "HH:mm")

    console.log("start", start)
    const total = start.diff(end)
    console.log("total", total)
    const passed = moment().diff(start)
    // Calc percentage
    const pct = Math.min(Math.max((passed / total) * 100, 1), 100)
    return pct
  }

  doneLastTimeframe(): boolean {
    /*
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
*/
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
    const todayDay = moment.weekdays(moment().weekday())
    const c = this.timeframes.some((tf) => tf.days?.some((day) => todayDay == day))
    return c
  }


  doneThisTimeframe(): boolean {
    const current = this.currentTimeframe()
    if (current && this.lastModified)
      if (this.lastModified.date > new Date(current.startTime)
        && this.lastModified.date < new Date(current.endTime))
        return true
    return false
  }

  isNowInTimeframeTime(timeframe: { startTime: string, endTime: string }) {
    // Assumes timeframe IS valid today, just checks the start and end
    const start = moment(timeframe.startTime, "HH:mm")
    //console.log("start", start)
    const end = moment(timeframe.endTime, "HH:mm")
    //console.log("end", end)
    const now = moment()
    //console.log("start is before now", start.isBefore(now))
    //console.log("end is after now", end.isAfter(now))
    //console.log("done today", !this.doneToday())
    //console.log("all", start.isBefore(now) && end.isAfter(now) && !this.doneToday())
    return start.isBefore(now) && end.isAfter(now) && !this.doneToday()
  }

  currentTimeframe(): (TaskTimeframeType | null) {
    if (!this.timeframes || !this.timeframes.length) return null
    if (!this.relevantToday()) return null
    const relevantNow = this.timeframes.filter((timeframe) =>
      this.isNowInTimeframeTime(timeframe)
    )
    //console.log("relevant current timeframe ", relevantNow)
    if (!relevantNow || !relevantNow.length) return null
    return relevantNow[0]
  }

  currentlyRelevant(): boolean {
    if (!!this.startTime && !!this.endTime) {
      const { startTime, endTime } = this
      console.log(this.name, "start time", startTime)
      return this.isNowInTimeframeTime({ startTime, endTime })
    }
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
    let end = moment(this.currentTimeframe()?.endTime, "HH:mm")
    let start = moment(this.currentTimeframe()?.startTime, "HH:mm")

    const endOfToday = moment().endOf("day").format("HH:mm")

    if (start.diff(endOfToday, 'minutes') < minutesModifier)
      start = start.add(minutesModifier, 'minutes')

    if (end.diff(endOfToday, 'minutes') < minutesModifier)
      end = end.add(minutesModifier, 'minutes')
    return this
  }
}

