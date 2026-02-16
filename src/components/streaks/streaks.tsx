import { useState, useEffect } from "react"
import { getAllTasks } from "../../api/task"
import type { task } from "../../types/task"

export function Streaks(){

  // NOTE: get streak things as props
  // calculate streaks validity
  // update streak info
  // display streak
  
  const [taskList, setTaskList] = useState<task[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAllTasks()
        if (!res.ok) throw new Error("Failed to fetch");
        const body = await res.json();
        const tasks = body 
        setTaskList(tasks);
      }
      catch {
        console.log("ERROER")
      }
    }
    load()
  }, [])

  return (
    <div>
      <p>Streaks!</p>
      { taskList.map((t:task)=> {

        return (
        <>
            {t._id}
          </>
        )}
      )}
    </div>
  )
}
