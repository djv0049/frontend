import moment from "moment"

export class TaskModel {
  //frequency?: { interval: Interval; count: number } | undefined;
  //initialDate?: string | undefined;
  //location?: { lat: number; lng: number; radiusMeters?: number } | undefined;
  //createdAt!: Date;
  //deadline?: Date | undefined;

  title: string = 'No Title'
  priority: number = 1
  currentTimeframe?: {start: string, end: string}

  constructor(props: TaskObjectType) {
    Object.assign(this, props)

    this.score = this.scoreCalculated()

    this.timeframes = props.timeframes
      ? props.timeframes.map((t: TaskTimeframeType) => new TaskTimeframeModel(t))
      : []
  }

  /**returns percentage through timeframe * (priority || 4)*/
  private getTimePressure() {
    const percentage = this.getPercentage()
    return percentage * (this.priority ? this.priority : 1)
  }

  // TODO: rename to has been skippedORCompleted
  hasBeenModifiedThisTimeFrame() {
    /**Check If task has been completed by checking its histroy, and finding a "completed" event*/
    if (!this.history.length) return false

    const mostRecent = this.history.find((event) => {
      const at = new Date(event.at) // ensure it's a Date
      const timeframe = this.currentTimeframe
      return (
        timeframe &&
        at.getTime() > timeframe.start.getTime() &&
        at.getTime() < timeframe.end.getTime() &&
        (event.event === 'completed' || event.event === 'skipped')
      )
    })
    return mostRecent?.event ? true : false
  }


  scoreCalculated() {
    const timePressure = this.getTimePressure()
    const totalTimePressure = timePressure
    // TODO: location, context, history, pre-reqs?

    return Math.floor(totalTimePressure) || 0
  }

  /**Returns the percentage through the tasks given timeframe
   * OR 1
   */
  getPercentage() {
    if (!this.currentTimeframe) return 1
    let timeframe: Timeframe = this.currentTimeframe

    // Calc percentage
    const total = timeframe.end.getTime() - timeframe.start.getTime()
    const passed = new Date().getTime() - timeframe.start.getTime()
    const pct = Math.min(Math.max((passed / total) * 100, 1), 100)
    return pct
  }
  async complete() {
    this.history.push({ event: 'completed', at: new Date() })
    return this
  }

  /**Adds "Skipped" to the history of task*/
  async skip() {
    this.history.push({ event: 'skipped', at: new Date() })
    return this
  }

  async doLater() {
    /**Adds "postPoned" to the history of task and pushes the task back x minutes*/
    if (!this.currentTimeframe) return this

    this.history.push({ event: 'postponed', at: new Date() })

    const minutesModifier = 10
    let end  = moment(this.currentTimeframe.end, "HH:mm")
    let start = moment(this.currentTimeframe.start, "HH:mm")

    const endOfToday = moment().endOf("day")

    if (start.diff(endOfToday, 'minutes') < minutesModifier)
      start = start.add(minutesModifier, 'minutes')

    if (end.diff(endOfToday, 'minutes') < minutesModifier)
      end = end.add(minutesModifier, 'minutes')
    return this
  }
}
