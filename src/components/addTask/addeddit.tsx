import { Button } from "@mui/material"
import { TaskModel } from "../../models/task"
import React, { useState, useCallback, useEffect } from "react"
import type { TaskTimeframeType } from "../../types/taskTimeframe"
import { TaskModel } from "../../models/task/task"
import { Task } from "../task"


export function TaskCreateEditView() {
  const [taskForDisplay, setTaskForDisplay] = React.useState<TaskModel>()
  const [priority, setPriority] = React.useState<number>(1)
  const [title, setTitle] = React.useState('')
  const [timeframes, setTimeframes] = useState<TaskTimeframeType[]>([defaultTaskTimeframe])

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

  return (
    <>
      <div style={{ margin: 8 }}>
        {taskForDisplay && <Task task={taskForDisplay} showDelete={true} />}
      </div>
      <div style={{ flexDirection: 'row' }}>
        <div style={{ flex: 3, padding: 4 }}>
          <p>Title</p>
          <input 
            className={styles.inputFeild}
            value={title}
            onChange={(e) => setTitle(e.target.textContent)}
            placeholder="Task title"
            style={{ borderWidth: 1, marginBottom: 10 }}
          />
        </div>

        <div style={{ padding: 4 }}>
          <p>Priority</p>
          <div>
            <input className={styles.inputField}
              type="number"
              onChange={(text) => setPriority(Number(text.target.textContent) || 0)}
              value={priority.toString() || ''}
              style={{ borderWidth: 1, marginBottom: 10 }}
            />
          </div>
        </div>
      </div>
      <div style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
        {timeframes.map((tf, i) => (
          <div key={i} style={{ flex: 1 }}>
            {/*<TimeFrameEditor
              taskIndex={i}
              updateTimeframeCallback={updateTimeframe}
              deleteTimeframeCallback={deleteTimeframe}
              tf={tf}
            />
            */ }
            <div style={{ height: 10 }} />
          </div>
        ))}
        <Button onClick={addTimeframe}>Add Timeframe</Button>
        <div style={{ height: 10 }} />
        <Button onClick={onSave}>Save</Button>
        <div style={{ height: 10 }} />
      </div>
    </>
  )
}
