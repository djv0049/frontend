import moment from "moment"
import { deleteTask, updateTask } from "../../api/task"
import type { task } from "../../types/task"
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
  percentage: number = 0
  nextTimeFrameStart: Date = new Date()
  percentageTillNextTimeframe: number = 0
  current: boolean
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
    this.percentage = this.getPercentage()
    this.current = this.currentlyRelevant()
    this.percentageTillNextTimeframe = this.getPercentageSinceLastModifiedTillNextStart()
  }

  delete() {
    console.log(this.name, " is being deleted")
    deleteTask(this)
  }

  markComplete() {
    this.updateStreak()
    this.lastModified = {
      date: new Date(),
      action: "Complete"
    }
    updateTask(this)
  }

  markCancelled() {
    console.debug("markCancelled")
    this.lastModified = {
      date: new Date(),
      action: "Cancelled"
    }

    updateTask(this)
  }

  updateStreak() {
    if (!this.isStreak || this.doneToday()) return
    if (!this.doneYesterday()) this.streakCount = 0
    const { streakCount } = this
    this.streakCount = streakCount ? streakCount + 1 : 0
  }

  updateTask() {
    console.debug("update task")
    updateTask(this)
  }

  getNextTimeframe() {
    const today = moment().weekday()

    for (let i = 0; i <= 7; i++) {
      const starttimes = this.timeframes.map((timeframe) => {
        const newDayNum = (today + i) % 7
        const newDay = moment.weekdays(newDayNum)

        const hasDaysTimeframeList = timeframe.days?.filter((day) => newDay == day)
        if (hasDaysTimeframeList?.length) return moment(timeframe.startTime, "HH:mm").add(i, 'days')
      }).filter(tf =>
        tf != undefined
      ).filter(tf =>
        tf.isAfter(moment())
      )
      if (starttimes.length) return starttimes.sort((a, b) => a.diff(b))[0]
    }
  }

  getPercentageSinceLastModifiedTillNextStart() {
    if (!this?.lastModified?.date) return 0
    const nextTimeframe = this.getNextTimeframe()
    if (!nextTimeframe) return 0
    const now = moment()
    const lastDone = moment(this.lastModified.date)
    const timeSinceLastDone = now.diff(lastDone)
    const totalTime = nextTimeframe?.diff(lastDone)
    const percentage = timeSinceLastDone / totalTime
    return Math.floor(percentage * 100)
  }


  getPercentage(): number {
    const timeframe = this.getCurrentTimeframe()
    if (timeframe == null) return 0
    const done = this.doneInTimeframe(timeframe)
    if (done) return 0
    const start = moment(timeframe.startTime, "HH:mm")
    const end = moment(timeframe.endTime, "HH:mm")
    const total = start.diff(end)
    const passed = moment().diff(start)
    // Calc percentage
    const pct = Math.floor((-passed / total) * 100)
    return pct
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

  doneInTimeframe(timeframe: TaskTimeframeType): boolean {
    const { lastModified } = this
    if (!timeframe || !lastModified) return false
    const { date } = lastModified
    const modifiedDate = new Date(date) // TODO: move to constructor
    const [start, end] = [
      timeframe.startTime,
      timeframe.endTime
    ].map(time => moment(time, "HH:mm").toDate())
    if (start < modifiedDate && modifiedDate < end) return true
    return false
  }

  isNowInTimeframeTime(timeframe: { startTime: string, endTime: string }) {
    // Assumes timeframe IS valid today, just checks the start and end
    const start = moment(timeframe.startTime, "HH:mm")
    const end = moment(timeframe.endTime, "HH:mm")
    const now = moment()
    if (start.isAfter(end))
      return end.add(1, 'day').isAfter(now) && start.isBefore(now)
    return start.isBefore(now) && end.isAfter(now)
  }

  getCurrentTimeframe(): (TaskTimeframeType | null) {
    if (this?.timeframes == undefined || !this.timeframes.length) return null
    if (!this.relevantToday()) return null
    const relevantNow = this.timeframes.filter((timeframe) =>
      this.isNowInTimeframeTime(timeframe)
    )
    if (!relevantNow || !relevantNow.length) return null
    return relevantNow[0]
  }

  currentlyRelevant(): boolean {
    if (!!this.startTime && !!this.endTime) {
      const { startTime, endTime } = this
      return this.isNowInTimeframeTime({ startTime, endTime })
    }
    const current = this.getCurrentTimeframe()
    if (!current || (current && this.doneInTimeframe(current)))
      return false

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
    const tf = this.timeframes
    const tfl = this.timeframes.length
    const tfhd = this.timeframes[0].days
    const tfdl = this.timeframes[0].days?.length
    const tfdht = this.timeframes[0].days?.[0]
*/
    return false
    /*if (!tf) return false
    for (let i = 0; i < tfl; i++) {
      if (!this.timeframes[i].days?.length) return false
      for (let j = 0; j < this.timeframes[i].days?.length; j++) {
        return !!this.timeframes[i].days[j]
      }
    }*/
  }
}
