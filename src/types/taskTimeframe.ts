import type { daysEnum } from "./days";

export interface TaskTimeframeType {
  start: string; // "HH:mm"
  finish: string; // "HH:mm"
  days?: daysEnum[]; // ["monday", "tuesday"]
  monthDates?: number[]; // [1, 15, 30]
}
