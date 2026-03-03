
export interface TaskTimeframeType {
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  days?: string[]
  monthDates?: number[]; // [1, 15, 30]
}
