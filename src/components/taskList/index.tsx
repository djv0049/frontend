import { useState, useEffect } from "react";
import { getAllTasks } from "../../api/task";
import { Task } from "../task";
import { TaskModel } from "../../models/task";

export function TaskList() {
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

  const relevantTasks = taskList.filter((t: TaskModel) => (t.currentlyRelevant()))

  return (
    <>
      {taskList && (
        relevantTasks.map((t: TaskModel, i: number) => {
          return (
            <Task
              key={t._id}
              task={t}
              scaleDown={i}
            />
          )
        })
      )}
    </>
  )
}
