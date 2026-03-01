import { Checkbox, IconButton } from "@mui/material"
import moment from "moment"
import React, { useCallback, useState } from "react"
import { createTask } from "../../api/task"
import { TaskModel } from "../../models/task"
import { daysEnum } from "../../types/days"
import type { TaskTimeframeType } from "../../types/taskTimeframe"
import { CreateTaskButton } from "../buttons/createTaskButton"
import styles from './index.module.scss'
import { TimeFrameEdit } from "../timeframeEdit"

//type frequency = "never" | "daily" | "weekly" | "monthly | yearly"

export function AddTask() {
  const [name, setName] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  //const [location, setLocation] = useState("TBC")
  //const [repeatingFrequency, setRepeatingFrequency] = useState<frequency>("never")
  //const [repeatingFrequencyCount, setRepeatingFrequencyCount] = useState(1)
  const [date, setDate] = useState(new Date())
  const [isStreak, setIsStreak] = useState(true)
  const [isRepeating, setIsRepeating] = useState(true)
  const [priority, setPriority] = React.useState<number>(1)
  const [timeframes, setTimeframes] = useState<TaskTimeframeType[]>([])

  const defaultTaskTimeframe: TaskTimeframeType = {
    start: moment().format("HH:mm"),
    finish: moment().add(1, 'hour').format("HH:mm"),
    days: [daysEnum.sunday]
  }

  const handleCreateButtonClick = () => {
    if (!name || timeframes.length === 0) return
    createTask({ name, startTime, endTime, date, priority, isStreak, timeframes })
  }

  const addTimeframe = (): void => {
    setTimeframes((prev: TaskTimeframeType[]) => [...prev, defaultTaskTimeframe])
  }

  const updateTimeframe = (index: number, updated: Partial<TaskTimeframeType>) => {
    // console.log("updating timeframe array for ", { title }, " with ", updated);
    setTimeframes((prev) =>
      prev.map((tf, i) => {
        const times: TaskTimeframeType = i === index ? { ...tf, ...updated } : tf
        console.log("times for timeframe ", index, updated)
        return times
      }),
    )
  }

  function deleteTimeframe(index: number) {
    setTimeframes((prev) =>
      prev.filter((tf, i) => {
        if (i !== index) {
          return new TaskTimeframeModel(tf)
        }
      }),
    )
  }

  return <div className={styles.container}>

    <div className={styles.inputContainer}>
      <p>Name</p>
      <input
        className={styles.inputField}
        placeholder="Do the thing!"
        onChange={(e) => setName(e.target.value)}
      />
    </div>

    <div className={styles.inputContainer}>
      <p>Priority</p>
      <input
        className={styles.inputField}
        placeholder="5"
        type='number'
        onChange={(e) => setPriority(Number(e.target.value))}
      />
    </div>

    <div className={styles.inputContainer}>
      <p>Repeating</p>
      <Checkbox aria-label="Repeating" defaultChecked onChange={(e) => setIsRepeating(e.target.checked)} />
    </div>

    <div className={styles.inputContainer}>
      <p>Is Streak</p>
      <Checkbox aria-label="Streak" defaultChecked onChange={(e) => setIsStreak(e.target.checked)} />
    </div>

    {isRepeating ? (<>
      <div className={styles.inputContainerContainer}>
        <IconButton onClick={() => addTimeframe()} >➕ Timeframe </IconButton>
        {timeframes.map(
          (tf, i) => {
            return (
              <div className={styles.timeframeContainer} key={"timeframe"+{i}}>
                <TimeFrameEdit index={i} updateTimeframe={updateTimeframe} />
              </div>
            )
          })
        }
      </div>
    </>) : (
      <>
        <div className={styles.inputContainer}>
          <p>Date</p>
          <input
            className={styles.inputField}
            type='date'
            onChange={(e) => setDate(new Date(e.target.value))}
          />
        </div>

        <div className={styles.inputContainer}>
          <p>Start Time</p>
          <input
            className={styles.inputField}
            type='time'
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>

        <div className={styles.inputContainer}>
          <p>End Time</p>
          <input
            className={styles.inputField}
            type='time'
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
      </>
    )}

    <CreateTaskButton onClick={handleCreateButtonClick} />
  </div>
}
