import { useCallback, useEffect, useState } from "react"
import styles from './index.module.scss'
import { createTask } from "../../api/task"
import { CreateTaskButton } from "../buttons/createTaskButton"
import { Checkbox, IconButton } from "@mui/material"
import React from "react"
import { TaskModel } from "../../models/task/task"
import type { TaskTimeframeType } from "../../types/taskTimeframe"

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
  const [taskForDisplay, setTaskForDisplay] = React.useState<TaskModel>()
  const [timeframes, setTimeframes] = useState<TaskTimeframeType[]>([defaultTaskTimeframe])


  const handleCreateButtonClick = () => {
    createTask({ name, startTime, endTime, date, priority, isStreak })
  }

  useEffect(() => {
    setTaskForDisplay(
      new TaskModel( 
        "" , title, priority
      ),
    )
  }, [title, timeframes, priority])

  const addTimeframe = (): void => {
    setTimeframes((prev: TaskTimeframeType[]) => [...prev, defaultTaskTimeframe])
  }


  const updateTimeframe = useCallback((index: number, updated: Partial<TaskTimeframeModel>) => {
    // console.log("updating timeframe array for ", { title }, " with ", updated);
    setTimeframes((prev) =>
      prev.map((tf, i) => {
        const times = i === index ? { ...tf, ...updated } : tf
        return new TaskTimeframeModel(times)
      }),
    )
  },[])

  function deleteTimeframe(index: number) {
    // console.log("deleting", timeframes[index]);
    setTimeframes((prev) =>
      prev.filter((tf, i) => {
        if (i !== index) {
          return new TaskTimeframeModel(tf)
        }
      }),
    )
  }

  const onSave = async () => {
    if (!title || timeframes.length === 0) return
    const newTask = new TaskModel(
    "",
      title,
      priority,
      timeframes,

    )
    // TODO: create the task
    return
  }

  const addTimeframe = () => {
    
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
        <div></div>
        <IconButton onClick={() => addTimeframe()} >add</IconButton>
        
        <div className={styles.timeframe}>

        </div>


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
