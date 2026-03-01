import type { TaskModel as taskClass } from "../../models/task"

type props = {
  task: taskClass
  showDelete?: boolean
  scaleDown: number
}
export function Task(props: props) {
  const { task, scaleDown } = props
  const { showDelete } = props || false
  const proportional = 1.1 - (scaleDown * 0.03)
  console.log(scaleDown)
  console.log(proportional)


  return (
    <div style={{
      zIndex:`${999-proportional}`,
      background: `rgba(${scaleDown*10},${scaleDown*10},${scaleDown*10},${100-scaleDown*20})`,
      scale: proportional,
      width: "100%",
      borderRadius: `${proportional}rem`,
      border: 'solid',
      padding: `${proportional}rem`,
      margin: `${proportional }rem`,
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
    }}>
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
          <div>{ }</div>
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
