import { TaskModel } from "../../models/task";

const url = import.meta.env.VITE_URL

export function createTask(task: Partial<TaskModel>) {
  fetch(url + '/task/', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

}
export async function getAllTasks() {
  const taskList = await fetch(url + '/task/', { method: "GET" })
  const taskObjectList = await taskList.json() as TaskModel[]
  const returnObject = taskObjectList.map((rawTask) => new TaskModel(
    rawTask._id,
    rawTask.name,
    rawTask.priority,
    rawTask.timeframes,
    rawTask.startTime,
    rawTask.endTime,
    rawTask.date,
    rawTask.repeatingFrequency,
    rawTask.repeatingFrequencyCount,
    rawTask.streakCount,
    rawTask.isStreak,
    rawTask.lastCompleted ? rawTask.lastCompleted : undefined
  ))
  return returnObject
}

export async function updateTask(task: Partial<TaskModel>) {
  return await fetch(url + '/task/', {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  })
}

