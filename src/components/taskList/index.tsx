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

  // currently relevant: 4, getPercentage: 2, getPercentageToNext
  const sortTasks = (tasklist: TaskModel[]) => {

    return tasklist.sort((a, b) => {
      const aPercent = a.getPercentage()
      const bPercent = b.getPercentage()
      const aProg = a.getPercentageSinceLastModifiedTillNextStart()
      const bProg = b.getPercentageSinceLastModifiedTillNextStart()

      const aScore =
        (a.currentlyRelevant() ? 4 : -4) +
        (aPercent > bPercent ? 2 : -2) +
        (aProg > bProg ? 1 : -1)

      const bScore =
        (b.currentlyRelevant() ? 4 : -4) +
        (bPercent > aPercent ? 2 : -2) +
        (bProg > aProg ? 1 : -1)

      return bScore - aScore
    })
    
  }


  const sortingTasks = sortTasks(taskList)
  const sortedTasks = sortTasks(sortingTasks)



  return (
    <div style={{ justifyItems: "center", }}>
      {taskList && (
        sortedTasks.map((t: TaskModel, i: number) => {
          return (
            <Task
              key={t._id}
              task={t}
              scaleDown={i}
            />
          )
        })
      )}
    </div>
  )
}
