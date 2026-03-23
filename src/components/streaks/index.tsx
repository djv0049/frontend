import { useEffect, useState } from "react"
import { getAllTasks } from "../../api/task"
import { TaskModel } from "../../models/task"

export function Streaks() {

  const [taskList, setTaskList] = useState<TaskModel[]>([])

  // TODO: replace this with store, or something.
  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAllTasks()
        setTaskList(res);
      }
      catch {
        console.log("ERROER")
      }
    }
    load()
  }, [])

  const isDoneToday = ((task: TaskModel) => {
    const done = task.doneToday()
    return done

  })


  return (
    <div>
      <p>Streaks!</p>
      {
        taskList.sort((a, b) => (a.streakCount || 0) - (b.streakCount || 0)).map((t: TaskModel) => {
          if (t._id && !t.isStreak) return
          else

            return (
              <div key={`streak ${t._id}`} style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                <p>{t.name}</p> {isDoneToday(t) ? (<p>🔥{t.streakCount}</p>) : t.doneYesterday() ? (<p>🔴{t.streakCount}</p>) : (<p>❌</p>)}
              </div>
            )
        }
        )}
    </div>
  )
}
