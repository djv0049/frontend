import { TaskModel } from "../../models/task";
import type { RawTaskTimeframeType } from "../../types/taskTimeframe";
import type { MOD_ACTIONS } from "../../types/task";


const url = import.meta.env.VITE_URL

type RawTask = {
  _id: any
  name: string
  startTime?: string
  endTime?: string
  date?: Date
  repeatingFrequency?: string
  repeatingFrequencyCount?: number
  streakCount?: number
  isStreak?: boolean
  lastModified?: { date: Date, action: MOD_ACTIONS }
  timeframes: RawTaskTimeframeType[]
}

function serializeTask(task: TaskModel): RawTask {
  return {
    ...task,
    startTime: task.startTime?.format("HH:mm"),
    endTime: task.endTime?.format("HH:mm"),
    timeframes: task.timeframes?.map(tf => ({
      ...tf,
      startTime: tf.startTime.format("HH:mm"),
      endTime: tf.endTime.format("HH:mm"),
    })) ?? [],
  }
}

export function createTask(task: TaskModel) {
  fetch(url + '/task/', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(serializeTask(task)),
  });
}

export async function getAllTasks() {
  const taskList = await fetch(url + '/task/', { method: "GET" })
  const rawTasks = await taskList.json() as RawTask[]
  return rawTasks.map((raw) => new TaskModel(
    raw._id,
    raw.name,
    raw.timeframes,
    raw.startTime,
    raw.endTime,
    raw.date,
    raw.repeatingFrequency,
    raw.repeatingFrequencyCount,
    raw.streakCount,
    raw.isStreak,
    raw.lastModified ?? undefined
  ))
}

export async function updateTask(task: TaskModel) {
  return await fetch(url + '/task/', {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(serializeTask(task)),
  })
}

export async function deleteTask(task: TaskModel) {
  return await fetch(url + '/task/', {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(serializeTask(task)),
  })
}

