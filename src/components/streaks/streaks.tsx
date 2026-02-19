import { useState, useEffect } from "react"
import { getAllTasks } from "../../api/task"
import type { task } from "../../types/task"
import { doneToday, doneYesterday } from "../../models/task"

export function Streaks() {

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
      {taskList.map((t: task) => {
        if (t._id && !t.isStreak) return
        else

          return (
            <div key={`streak ${t._id}`} style={{ width: "100%",display:"flex", justifyContent:"space-between" }}>
              <p>{t.name}</p> {doneToday(t) ? (<p>🔥</p>) : doneYesterday(t) ? (<p>🔴</p>) : (<p>❌</p>) }
            </div>
          )
      }
      )}
    </div>
  )
}
