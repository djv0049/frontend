import { useState, useEffect } from "react"
import { getAllTasks } from "../../api/task"
import type { task } from "../../types/task"
import moment from "moment"

export function Streaks() {

  // NOTE: 
  // get streak things as props
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

  const doneToday = ((t: task) => {
    return t.lastCompleted && t.lastCompleted >= moment(new Date()).startOf("day").toDate()
  })

  const doneYesterday()

    /* NOTE: 
     * this is great, but can't be used here, it's just for adding the streak count. this should all be handled in the task utils
     *
     * 
  const updateStreak = ((t: task) => {
    if (!t.streakCount) t.streakCount = 0
    if (doneToday(t))
      t.streakCount += 1
  })
  */

  return (
    <div>
      <p>Streaks!</p>
      {taskList.map((t: task) => {
        if (t._id && !t.isStreak) return
        else

          return (
            <div key={`streak ${t._id}`}>
              <p>{t.streakCount} - {t.name}</p>
            </div>
          )
      }
      )}
    </div>
  )
}
