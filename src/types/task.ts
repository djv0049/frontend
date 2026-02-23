export type task = {
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
  lastCompleted?: Date;
  doneToday(): boolean;
  doneYesterday(): boolean;
  updateStreak(): void;

  markComplete(): void;
  markCancelled(): void;

}
