import { useState, useEffect } from "react";
import { getAllTasks } from "../../api/task";
import { Task } from "../task";
import type { task } from "../../types/task";

export function TaskList() {
  const [taskList, setTaskList] = useState<task[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAllTasks()
        if (!res.ok) throw new Error("Failed to fetch");
        const body = await res.json();
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
        taskList.map((t: task) => (
          <Task key={t._id}
            priority={t.priority}
            name={t.name}
          />
        ))
      )}
    </>
  )
}
