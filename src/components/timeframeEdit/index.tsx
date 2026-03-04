import moment from 'moment';
import type { TaskTimeframeType } from '../../types/taskTimeframe';
import { ToggleText } from '../toggleText';
import styles from './index.module.scss'
import type { Moment } from "moment";
import { InputField } from '../fields/inputField';
type timeframeComponentProps = {
  index: number
  startTime?: Moment
  endTime?: Moment
  edit?: boolean // requires updateTimeframe
  showDelete?: boolean
  compact?: boolean
  t?: TaskTimeframeType
  updateTimeframe?: (index: number, updated: Partial<TaskTimeframeType>) => void
  deleteTimeframe?: (index: number) => void
}



type dayName = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday"
// NOTE: add in the start and end time for editing tasks, no need for adding new ones 

export function TimeFrameEdit(props: timeframeComponentProps) {

  const { compact, edit, t, index, updateTimeframe, deleteTimeframe } = props

  const toggleDay = (day: string) => {
    if (!t || !updateTimeframe) return
    const newDays = (t.days ?? []).includes(day as dayName)
      ? t.days!.filter((dayName) => dayName !== day)
      : [...(t.days ?? []), day]
    updateTimeframe(index, { days: newDays as dayName[] })
  }


  return (
    <div className={styles.container}>
      {edit && updateTimeframe && deleteTimeframe? (
        <div className={styles.timeframe}>
          <button onClick={() => deleteTimeframe(index)}>delete</button>
          <InputField
            title="Start"
            type="time"
            updateValue={(e => updateTimeframe(index, { startTime: e.target.value }))}
          />
          <InputField
            title="End"
            type="time"
            updateValue={(e => updateTimeframe(index, { endTime: e.target.value }))}
          />

        </div >
      ) : (
        <p>🕰️ {t?.startTime} ➡️ {t?.endTime} </p>
      )}
      <div className={edit ? styles.inputContainer : styles.compactContainer}>
        {moment.weekdays()
          .filter((key) => typeof key === 'string')
          .map((weekday: string) => {
            const hasDay = t && t.days?.find((dayday) => dayday === weekday)
            return (
              < ToggleText edit={!!edit} callback={() => toggleDay(weekday)} key={`${t}${weekday}`} active={!!hasDay} text={weekday.slice(0, 1).toUpperCase()} />
            )
          })}
      </div>
    </div>
  )
}
