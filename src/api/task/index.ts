import type { task } from "../../types/task";

export function createTask(task: Partial<task>) {
  console.log("hit task")
  console.log("Task", task)
  console.log('json stringify data', JSON.stringify(task))
  fetch('http://localhost:3002/task/', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

}
export function getAllTasks() {
  return fetch('http://localhost:3002/task/', { method: "GET" })
}

