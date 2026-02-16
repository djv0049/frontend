import { useState, useEffect } from "react"
import { getAllTasks } from "../../api/task"
import type { task } from "../../types/task"

export function Streaks(){

  // NOTE: get streak things as props
  // calculate streaks validity
  // update streak info
  // display streak
  
  const [taskList, setTaskList] = useState<task[]>([])

  // TODO: replace this with store, or something.
  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAllTasks()
        console.log("got tasks in streaks")
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
        if (!t._id) console.log(t)
          else

        return (
        <div key={`streak ${t._id}`}>
            {t._id}
          </div>
        )}
      )}
    </div>
  )
}
