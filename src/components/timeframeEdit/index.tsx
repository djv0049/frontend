import type { TaskTimeframeType } from '../../types/taskTimeframe';
import styles from './index.module.scss'
import type { Moment } from "moment";
type timeframeComponentProps = {
  index: number
  startTime?: Moment
  endTime?: Moment
  updateTimeframe: (index: number, updated: Partial<TaskTimeframeType>) => void

}
// NOTE: add in the start and end time for editing tasks, no need for adding new ones 

// TODO: DAYS
export function TimeFrameEdit(props: timeframeComponentProps) {
  const { index, updateTimeframe } = props
  return (<div className={styles.timeframe}>
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
  </div>
  )
}
