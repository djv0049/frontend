import { Checkbox, IconButton } from "@mui/material"
import moment from "moment"
import React, { useState } from "react"
import { createTask } from "../../api/task"
import type { TaskTimeframeType } from "../../types/taskTimeframe"
import { CreateTaskButton } from "../buttons/createTaskButton"
import { TimeFrameEdit } from "../timeframeEdit"
import styles from './index.module.scss'
import { InputField } from "../fields/inputField"

//type frequency = "never" | "daily" | "weekly" | "monthly | yearly"

export function AddTask() {
  const defaultTaskTimeframe: TaskTimeframeType = {
    startTime: moment().format("HH:mm"),
    endTime: moment().add(1, 'hour').format("HH:mm"),
    days: ["Monday"]
  }

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
  const [timeframes, setTimeframes] = useState<TaskTimeframeType[]>([defaultTaskTimeframe])


  const handleCreateButtonClick = () => {
    if (!name) return
    if (isRepeating) createTask({ name, priority, isStreak, timeframes })
    createTask({ name, startTime, endTime, date, priority })
  }

  const addTimeframe = (): void => {
    setTimeframes((prev: TaskTimeframeType[]) => [...prev, defaultTaskTimeframe])
  }

  const updateTimeframe = (index: number, updated: Partial<TaskTimeframeType>) => {
    // console.log("updating timeframe array for ", { title }, " with ", updated);
    setTimeframes((prev) =>
      prev.map((tf, i) => {
        const times: TaskTimeframeType = i === index ? { ...tf, ...updated } : tf
        return times
      }),
    )
  }

  function deleteTimeframe(index: number) {
    setTimeframes((prev) =>
      prev.filter((tf, i) => {
        if (i !== index) {
          return (tf)
        }
      }),
    )
  }

  return <div className={styles.container}>

    <InputField
      title="Name"
      type='text'
      placeholder="I will achieve"
      value={name}
      updateValue={(e => setName(e.target.value))}
    />
    <InputField
      title="Priority"
      type='number'
      placeholder="5"
      updateValue={e => setPriority(Number(e.target.value))}
      value={priority}
    />

    <div className={styles.inputContainer}>
      <p>Repeating</p>
      <Checkbox aria-label="Repeating" defaultChecked onChange={(e) => setIsRepeating(e.target.checked)} />
    </div>

    {isRepeating ? (<>
      <div className={styles.inputContainer}>
        <p>Is Streak</p>
        <Checkbox aria-label="Streak" defaultChecked onChange={(e) => setIsStreak(e.target.checked)} />
      </div>
      <div className={styles.inputContainerContainer}>
        {timeframes.map(
          (timeframe, i) => {
            return (
              <div className={styles.timeframeContainer} key={"timeframeAdd" + i}>
                <TimeFrameEdit
                  timeframe={timeframe}
                  edit={true}
                  index={i}
                  updateTimeframe={updateTimeframe}
                  deleteTimeframe={deleteTimeframe}

                />
              </div>
            )
          })
        }

        <IconButton onClick={() => addTimeframe()} >➕ Timeframe</IconButton>
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
