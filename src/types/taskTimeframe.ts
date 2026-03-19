
import type { Moment } from "moment"

// Raw shape from/to the API — strings only
export interface RawTaskTimeframeType {
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  days?: string[]
  monthDates?: number[];
}

// Domain type used everywhere inside the app
export interface TaskTimeframeType {
  startTime: Moment;
  endTime: Moment;
  days?: string[]
  monthDates?: number[];
}
