import type { task } from "../../types/task";


const url = 'http://localhost:3002'
export function createTask(task: Partial<task>) {
  fetch(url+'/task/', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

}
export async function getAllTasks() {
  return await fetch(url+'/task/', { method: "GET" })
}

export async function updateTask(task: Partial<task>){
  return await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  })
}

