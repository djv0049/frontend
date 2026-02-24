import { useState, useEffect } from "react"
import { getAllTasks } from "../../api/task"
import type { TaskModel } from "../../models/task"
import moment from "moment"

export function DayView() {
  const [taskList, setTaskList] = useState<TaskModel[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAllTasks()
        const body = res
        setTaskList(body);
      }
      catch {
        console.log("ERROER")
      }
    }
    load()
  }, [])

  return (
    <>
      {taskList && taskList.sort((a, b) =>
        moment(a.startTime, "HH:mm")
          .isBefore(moment(b.startTime, "HH:mm"))
          ? -1 
          : 1)
        .map((task:TaskModel) => {
          return 

        })}

    </>
  )
}
