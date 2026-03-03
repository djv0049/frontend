
export interface TaskTimeframeType {
  start: string; // "HH:mm"
  finish: string; // "HH:mm"
  days?: string[]
  monthDates?: number[]; // [1, 15, 30]
}
