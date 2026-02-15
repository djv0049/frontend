export type task = { 
  _id:any
  name: string
  startTime?: string
  endTime?: string
  date?: Date
  priority: number
  repeatingFrequency?: string
  repeatingFrequencyCount?: number
  streak?: boolean
}
