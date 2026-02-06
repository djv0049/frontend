import { useEffect, useState } from "react"
import { getAllTasks } from "../../api/task"
import type { task } from "../../types/task"

export function Task() {

  const [taskList, setTaskList] = useState([])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAllTasks()
        if (!res.ok) throw new Error("Failed to fetch");
        const body = await res.json();
        setTaskList(body);
      }
      catch {
        console.log("ERROER")
      }
    }
    load()
  }, [])


  return (
    <div style={{ width: "60%", borderRadius: '1em', border: 'solid', display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <button style={{ marginLeft: '0.5em', marginTop: '0.5em' }}>Icon button</button>
      <table>
        {taskList && (
            {taskList.map((task: task) => (
          <tr key={task._id}>


              <td>{task.name}</td>
          </tr>
            ))}
        )}
      </table>
      <table>
        <tr>
          <td>
            Name:
          </td>
          <td >
            [[]]
          </td>
        </tr>
      </table>
    </div>
  )
}
