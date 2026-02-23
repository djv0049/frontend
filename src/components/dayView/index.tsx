import { useState, useEffect } from "react"
import { getAllTasks } from "../../api/task"
import type { TaskModel } from "../../models/task"

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
      {taskList && taskList.sort((a, b) => a.startTime - b.startTime) 
    </>
  )
}
