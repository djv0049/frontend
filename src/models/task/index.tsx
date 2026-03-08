import moment from "moment"
import type { task } from "../../types/task"
import { deleteTask, updateTask } from "../../api/task"
import type { TaskTimeframeType } from "../../types/taskTimeframe"


// FIXME: re organise the conditional rendering. there's a lot of repitition

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

  delete() {
    console.log(this.name, " is being deleted")
    deleteTask(this)
  }

  markComplete() {
    console.debug("markComplete")
    this.lastModified = { date: new Date(), action: "Complete" }
    if (this.isStreak) this.updateStreak()
  }

  markCancelled() {
    console.debug("markCancelled")
    this.lastModified = { date: new Date(), action: "Cancelled" }
    if (this.isStreak) this.updateStreak()
  }

  updateStreak() {
    console.debug("updateStreak")
    if (!this.streakCount)
      console.log("has no streak")
      this.streakCount = 0
    if (!this.doneToday())
      console.log("not done today")
      this.streakCount = this.streakCount + 1
    console.log(this.streakCount)
    console.log("updating this", this.name, this.streakCount)
    updateTask(this)
    console.log(this.streakCount)
  }

  updateTask() {
    console.debug("update task")
    updateTask(this)
  }

  getNextTimeframe() {
    // for each day, starting today:
    //   find all timeframes with that day
    //     sort by timeframe startTime
    //   for each timeframe with that day:
    //    return the first one that is after now
    //     
    const today = moment().weekday()
    this.timeframes.filter((timeframe) => {
      for (let i = 0; i <= 7; i++) {
        const newDayNum = (today + i) % 7
        const newDay = moment.weekdays(newDayNum)
        const hasDays = timeframe.days?.find((day) => newDay == day)
        if (hasDays) return true
        console.log("day", hasDays)
      }
      console.log("none found")
    }
    )
  }

  getPercentageSinceLastModified() {
    const lastDone = this.lastModified?.date
    const nextTimeframe = this.getNextTimeframe()
    return nextTimeframe
  }


  getPercentage() {


    console.log("percent since last modified = ", this.getPercentageSinceLastModified())
    const timeframe = this.currentTimeframe()
    if (timeframe == null) return
    const start = moment(timeframe.startTime, "HH:mm")
    const end = moment(timeframe.endTime, "HH:mm")

    const total = start.diff(end)
    const passed = moment().diff(start)
    // Calc percentage
    const pct = Math.min(Math.max((passed / total) * 100, 1), 100)
    return pct
  }

  doneToday() {
    console.debug(this.name, "modified", this.lastModified?.date)
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

  doneThisTimeframe(): boolean {
    const current = this.currentTimeframe()
    console.log("current ", current)
    if (current && this.lastModified) {
      console.log("last mod", this.lastModified.date)
      console.log("end", new Date(current.startTime))
      console.log("start:", new Date(current.endTime))
      if (this.lastModified.date > new Date(current.startTime)
        && this.lastModified.date < new Date(current.endTime))
        return true
    }
    return false
  }

  isNowInTimeframeTime(timeframe: { startTime: string, endTime: string }) {
    // Assumes timeframe IS valid today, just checks the start and end
    const start = moment(timeframe.startTime, "HH:mm")
    //console.log("start", start)
    const end = moment(timeframe.endTime, "HH:mm")
    //console.log("end", end)
    const now = moment()
    if (start.isAfter(end))
      return end.add(1, 'day').isAfter(now) && start.isBefore(now)
    //console.log("start is before now", start.isBefore(now))
    //console.log("end is after now", end.isAfter(now))
    //console.log("done today", !this.doneToday())
    //console.log("all", start.isBefore(now) && end.isAfter(now) && !this.doneToday())
    return start.isBefore(now) && end.isAfter(now)
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
    console.debug(this.name, "is repeating")
    //console.log(this.doneLastTimeframe())
    if (this.isStreak && this.doneToday()) return false
    console.debug(this.name, "is not streak that has been done")
    if (!this.currentTimeframe()) return false
    console.debug(this.name, "is in this current timeframe")
    if (this.doneThisTimeframe()) return false
    console.log(this.name, "was not done this timeframe")
    console.warn(this.name, "WENT PAST ALL CHECKS")
    return true
  }

  relevantToday(): boolean {
    const todayDay = moment.weekdays(moment().weekday())
    const c = this.timeframes.some((tf) => tf.days?.some((day) => todayDay == day))
    return c
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
}
