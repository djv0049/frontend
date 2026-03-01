import { daysEnum } from '../../types/days';
import type { TaskTimeframeType } from '../../types/taskTimeframe';
import { ToggleText } from '../toggleText';
import styles from './index.module.scss'
import type { Moment } from "moment";
type timeframeComponentProps = {
  index: number
  startTime?: Moment
  endTime?: Moment
  edit?: boolean // requires updateTimeframe
  showDelete?: boolean
  compact?: boolean
  t?: TaskTimeframeType
  updateTimeframe?: (index: number, updated: Partial<TaskTimeframeType>) => void
}



type day = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"
// NOTE: add in the start and end time for editing tasks, no need for adding new ones 

// TODO: DAYS
export function TimeFrameEdit(props: timeframeComponentProps) {

  const { edit, t, index, updateTimeframe } = props

  const toggleDay = (day: string) => {
    if (!t || !updateTimeframe) return
    const newDays = (t.days ?? []).includes(day as daysEnum)
      ? t.days!.filter((dayName) => dayName !== day)
      : [...(t.days ?? []), day]
    updateTimeframe(index, { days: newDays as daysEnum[] })
  }

  return (
    <>
      {edit && updateTimeframe ? (
        <div className={styles.timeframe}>
          <div className={styles.inputContainer}>
            <p>Start Time</p>
            <input
              className={styles.inputField}
              type='time'
              onChange={(e) => updateTimeframe(index, { start: e.target.value })}
            />
          </div>

          <div className={styles.inputContainer}>
            <p>End Time</p>
            <input
              className={styles.inputField}
              type='time'
              onChange={(e) => updateTimeframe(index, { finish: e.target.value })}
            />
          </div>
        </div >
      ) : (
        <p>🕰️ {t?.start} ➡️ {t?.finish} </p>
      )}
      <div className={edit ? styles.inputContainer: styles.compactContainer}>
        {Object.values(daysEnum)
          .filter((key) => typeof key === 'string')
          .map((day: string) => {
            const hasDay = t && t.days?.find((dayday) => dayday === day)
            return (
              < ToggleText edit={!!edit} callback={() => toggleDay(day)} key={day} active={!!hasDay} text={day.slice(0, 1).toUpperCase()} />
            )
          })}
      </div>
    </>
  )
}
