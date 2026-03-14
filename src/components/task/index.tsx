import type { TaskModel as taskClass } from "../../models/task"
import { TimeFrameEdit } from "../timeframeEdit"

type props = {
  task: taskClass
  showDelete?: boolean
  scaleDown?: number
  showTimeframes?: boolean
}

export function Task(props: props) {
  const { task } = props
  const { showDelete } = props || false
  const { showTimeframes } = props || false
  const scaleDown = props.scaleDown ?? 1
  const proportional = 1 - scaleDown * 0.01

  return (
    <div style={{
      position: 'relative',
      background: `rgba(${scaleDown * 10},${10 + scaleDown * 5},${150 - scaleDown * 5},${(100 - (scaleDown * 2)) / 100})`,
      scale: proportional,
      transform: `translateY(${(-scaleDown * scaleDown) / 4}rem)`,
      borderRadius: `${proportional}rem`,
      border: 'solid',
      padding: `${proportional}rem`,
      marginBottom: `${proportional}rem`,
      marginTop: `${proportional}rem`,
      width: '90%',
      zIndex: `${props.scaleDown ?? 1}`,
    }}>

      <div>

        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>

          <div style={{ display: "flex", flexDirection: "row" }}>
            <div><h1 style={{ padding: "1rem", margin: 0 }}>{task.name}</h1></div>
          </div>
          {showDelete ? (<button style={{ color: "red", padding: "0.5rem", margin: "0.1rem" }} onClick={(() => task.delete())}>󰆴</button>) : (

            <div>

              <button style={{ padding: "0.5rem", margin: "0.1rem" }} onClick={(() => task.markComplete())}>✅</button>
              <button style={{ padding: "0.5rem", margin: "0.1rem" }} onClick={(() => task.markCancelled())}>❌</button>
            </div>
          )}
        </div>
      </div>
      <div style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}>
        <div>
        </div>

          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <span style={{ color: "red" }}>{task.getPercentage()}% {">"} {task.getCurrentTimeframe()?.endTime}</span>
            <span style={{ color: "green" }}>{task.getPercentageSinceLastModifiedTillNextStart()}%</span>
          </div>


      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div>
          {showTimeframes && task.timeframes.map((tf, i) => {
            return (
              <TimeFrameEdit
                key={'tf' + i} timeframe={tf}
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
