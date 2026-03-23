import type { Moment } from "moment"
import type { TaskTimeframeType } from "./taskTimeframe"


export type MOD_ACTIONS = "Complete" | "Cancelled"

export type task = {
  _id: any
  name: string
  startTime?: Moment
  endTime?: Moment
  date?: Date
  repeatingFrequency?: string
  repeatingFrequencyCount?: number
  streakCount?: number
  isStreak?: boolean
  lastModified?: {date: Date, action: string}
  timeframes: TaskTimeframeType[]
  doneToday(): boolean;
  doneYesterday(): boolean;
  updateStreak(action: MOD_ACTIONS): void;

  markComplete(): Promise<void>;
  markCancelled(): Promise<void>;

}
