import type { task } from "../../types/task";

export function createTask(task: Partial<task>) {
  console.log(task)
  fetch('http://0.0.0.0:3002/task', {
    method: "POST", // Specify the method
    headers: {
      "Content-Type": "application/json", // Tell server you're sending JSON
    },
    body: JSON.stringify(task), // Body must be a string for JSON
  });

}
