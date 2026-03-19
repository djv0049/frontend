import type { TaskTimeframeType } from "./taskTimeframe"

export type task = {
  _id: any
  name: string
  startTime?: string
  endTime?: string
  date?: Date
  repeatingFrequency?: string
  repeatingFrequencyCount?: number
  streakCount?: number
  isStreak?: boolean
  lastModified?: {date: Date, action: string}
  timeframes: TaskTimeframeType[]
  doneToday(): boolean;
  doneYesterday(): boolean;
  updateStreak(): void;

  markComplete(): Promise<void>;
  markCancelled(): Promise<void>;

}
