import type { TaskModel as taskClass } from "../../models/task"

type props = {
  task: taskClass
  showDelete: boolean
}
export function Task(props: props) {
  const { task } = props
  const { showDelete } = props || false

  return (
    <div style={{ width: "90%", borderRadius: '1em', border: 'solid', padding: '1rem', margin: '1rem', display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
      <div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div>Name:</div>
          <div>{task.name}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div>priority:</div>
          <div>{task.priority}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div>Times:</div>
          <div>{}</div>
        </div>
      </div>

      <div>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
          {showDelete ? (<button style={{ color: "red", padding: "0.5rem", margin: "0.1rem" }} onClick={(() => task.markComplete())}>󰆴</button>) : (

            <>
              <button style={{ padding: "0.5rem", margin: "0.1rem" }} onClick={(() => task.markComplete())}>✅</button>
              <button style={{ padding: "0.5rem", margin: "0.1rem" }}>⏲️</button>
              <button style={{ padding: "0.5rem", margin: "0.1rem" }}>❌</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
