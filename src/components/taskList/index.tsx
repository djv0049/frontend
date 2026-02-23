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

  return (
    <>
      {taskList && (
        taskList.map((t: TaskModel) => ( <Task key={t._id}
          task={t}
          />
        ))
      )}
    </>
  )
}
