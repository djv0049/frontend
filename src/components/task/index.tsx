import type { TaskModel as taskClass } from "../../models/task"
import { TimeFrameEdit } from "../timeframeEdit"

type props = {
  task: taskClass
  showDelete?: boolean
  scaleDown: number
}
export function Task(props: props) {
  const { task, scaleDown } = props
  const { showDelete } = props || false
  const proportional = 1.1 - (scaleDown * 0.03)

  return (
    <div style={{
      zIndex: `${999 - proportional}`,
      background: `rgba(${scaleDown * 10},${scaleDown * 10},${scaleDown * 10},${100 - scaleDown * 20})`,
      scale: proportional,
      borderRadius: `${proportional}rem`,
      border: 'solid',
      padding: `${proportional}rem`,
      marginBottom: `${proportional}rem`,
      marginTop: `${proportional}rem`,
      // TODO: move minwidth somewhere more useful/ better
      minWidth: "30vw",
    }}>
      <div style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}>
        <div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div><h1>{task.name}</h1></div>
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div>P{task.priority}</div>
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
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div>
          {task.timeframes.map((tf, i) => {
            return (
              <TimeFrameEdit
                key={'tf' + i} t={tf}
                index={i}
                compact={true}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
