import moment, { type Moment } from "moment"
import { deleteTask, updateTask } from "../../api/task"
import type { task } from "../../types/task"
import type { TaskTimeframeType, RawTaskTimeframeType } from "../../types/taskTimeframe"

type MOD_ACTIONS = "Complete" | "Cancelled"

// FIXME: re organise the conditional rendering. there's a lot of repitition

export class TaskModel implements task {
  _id: any
  name: string
  startTime?: Moment
  endTime?: Moment
  date?: Date
  repeatingFrequency?: string
  repeatingFrequencyCount?: number
  streakCount?: number
  isStreak?: boolean
  lastModified?: { date: Date, action: string } // TODO: type the action
  timeframes: TaskTimeframeType[]
  score: number = 0
  percentage: number = 0
  nextTimeFrameStart: Moment
  percentageTillNextTimeframe: number = 0
  current: boolean
  currentTimeframe: TaskTimeframeType | null

  //  TODO: history: TaskEvent[] = []

  constructor(
    _id: any,
    name: string,
    timeframes?: RawTaskTimeframeType[],
    startTime?: string,
    endTime?: string,
    date?: Date,
    repeatingFrequency?: string,
    repeatingFrequencyCount?: number,
    streakCount?: number,
    isStreak?: boolean,
    lastModified?: { date: Date, action: MOD_ACTIONS },
  ) {
    this._id = _id
    this.name = name
    this.timeframes = timeframes?.map(tf => ({
      ...tf,
      startTime: moment(tf.startTime, "HH:mm"),
      endTime: moment(tf.endTime, "HH:mm"),
    })) ?? []
    this.startTime = startTime ? moment(startTime, "HH:mm") : undefined
    this.endTime = endTime ? moment(endTime, "HH:mm") : undefined
    this.date = date && date
    // TODO: cooldown 
    this.repeatingFrequency = repeatingFrequency && repeatingFrequency
    this.repeatingFrequencyCount = repeatingFrequencyCount && repeatingFrequencyCount
    this.streakCount = streakCount && streakCount
    this.isStreak = isStreak && isStreak
    this.lastModified = lastModified && { ...lastModified }
    this.percentage = this.getPercentage()
    this.current = this.currentlyRelevant()
    this.nextTimeFrameStart = this.getNextTimeframeStart()
    this.percentageTillNextTimeframe = this.getPercentageSinceLastModifiedTillNextStart()
    this.currentTimeframe = this.getCurrentTimeframe()
  }

  delete() {
    console.log(this.name, " is being deleted")
    deleteTask(this)
  }

  async markComplete() {
    this.updateStreak()
    this.lastModified = {
      date: new Date(),
      action: "Complete"
    }
    await updateTask(this)
  }

  async markCancelled() {
    console.debug("markCancelled")
    this.lastModified = {
      date: new Date(),
      action: "Cancelled"
    }
    await updateTask(this)
  }

  updateStreak() {
    if (!this.isStreak || this.doneToday()) return
    if (!this.doneYesterday()) {
      this.streakCount = 1
      return
    }
    const { streakCount } = this
    this.streakCount = streakCount ? streakCount + 1 : 0
    return
  }

  updateTask() {
    console.debug("update task")
    updateTask(this)
  }

  getNextTimeframeStart(): Moment {
    const today = moment().weekday()

    for (let i = 0; i <= 7; i++) {
      const starttimes = this.timeframes.map((timeframe) => {
        const newDayNum = (today + i) % 7
        const newDay = moment.weekdays(newDayNum)

        const hasDaysTimeframeList = timeframe.days?.filter((day) => newDay == day)
        if (hasDaysTimeframeList?.length) {
          const start = timeframe.startTime.clone()
          const nextStart = start.add(i, 'days')
          return nextStart
        }
      }).filter(tf =>
        tf != undefined
      ).filter(tf =>
        tf.isAfter(moment())
      )

      if (starttimes.length) {
        return starttimes.sort((a, b) => a.diff(b))[0]
      }
    }
    console.error('shouldn"t see this')
    return moment()
  }

  getPercentageSinceLastModifiedTillNextStart() {
    if (!this?.lastModified?.date) return 0
    const nextTimeframe = this.nextTimeFrameStart
    if (!nextTimeframe) return 0
    const now = moment()
    const lastDone = moment(this.lastModified.date)
    const timeSinceLastDone = now.diff(lastDone)
    const totalTime = nextTimeframe?.diff(lastDone)
    const percentage = timeSinceLastDone / totalTime
    return Math.floor(percentage * 100)
  }

  getTimeTillNextTimeframeString() {
    const diff = this.nextTimeFrameStart.diff(moment())
    const s = this.timeTillTimeString(diff)
    return s
  }

  getTimeTillEndOfCurrent() {
    const diff = this.currentTimeframe?.endTime.diff(moment()) ?? 0
    return this.timeTillTimeString(diff)
  }

  timeTillTimeString(diff: number) {
    const minutes = Math.floor(diff / 1000 / 60) % 60
    const hours = Math.floor(diff / 1000 / 60 / 60) % 24
    const days = Math.floor(diff / 1000 / 60 / 60 / 24) % 7
    const weeks = Math.floor(diff / 1000 / 60 / 60 / 24) % 7

    let s = ""
    s += weeks ? `${weeks}W` : ""
    s += days ? `${days}D` : ""
    s += hours ? `${hours}H` : ""
    s += minutes ? `${minutes}M` : ""
    return s
  }


  getPercentage(): number {
    const timeframe = this.getCurrentTimeframe()
    if (timeframe == null) return 0
    const done = this.doneInTimeframe(timeframe)
    if (done) return 0
    const start = timeframe.startTime
    const end = timeframe.endTime
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
    const mod = this.lastModified?.action
    if (done == undefined || mod == undefined) return false

    const yesterday = moment()
      .startOf('day')
      .subtract(1, 'day')
    if (
      moment(done).toDate() > yesterday.toDate()
      && moment(done).toDate() < moment().startOf('day').toDate()
      && mod === 'Complete'
    ) {
      return true
    }
    console.log(done, mod)
    return false
  }

  doneInTimeframe(timeframe: TaskTimeframeType): boolean {
    const { lastModified } = this
    if (!timeframe || !lastModified) return false
    const { date } = lastModified
    const modifiedDate = new Date(date) // TODO: move to constructor
    const [start, end] = [
      timeframe.startTime,
      timeframe.endTime
    ].map(time => time.toDate())
    if (start < modifiedDate && modifiedDate < end) return true
    return false
  }

  isNowInTimeframeTime(timeframe: { startTime: Moment, endTime: Moment }) {
    // Assumes timeframe IS valid today, just checks the start and end
    const { startTime: start, endTime: end } = timeframe
    const now = moment()
    if (start.isAfter(end))
      return end.clone().add(1, 'day').isAfter(now) && start.isBefore(now)
    return start.isBefore(now) && end.isAfter(now)
  }

  getCurrentTimeframe(): (TaskTimeframeType | null) {
    if (this?.timeframes == undefined || !this.timeframes.length) {
      if (!!this.startTime && !!this.endTime) {
        const { startTime, endTime } = this
        return this.isNowInTimeframeTime({ startTime, endTime })
          ? { startTime, endTime }
          : null
      }
    }
    if (!this.relevantToday()) return null
    const relevantNow = this.timeframes.filter((timeframe) =>
      this.isNowInTimeframeTime(timeframe)
    )
    if (!relevantNow || !relevantNow.length) return null
    return relevantNow[0]
  }

  currentlyRelevant(): boolean {
    const current = this.getCurrentTimeframe()

    if (!current || (current && this.doneInTimeframe(current)))
      return false

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
