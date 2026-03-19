import type { TaskModel as taskClass } from "../../models/task"
import { TimeFrameEdit } from "../timeframeEdit"

type props = {
  task: taskClass
  showDelete?: boolean
  scaleDown?: number
  showTimeframes?: boolean
  onUpdate?: () => void
}

export function Task(props: props) {
  const { task, onUpdate } = props
  const { showDelete } = props || false
  const { showTimeframes } = props || false
  console.log("till next: ", task.name, task.percentageTillNextTimeframe)

  const red = task.percentage * 255/100
  const blue = task.percentageTillNextTimeframe * 255/100 || 0
  const green = task.percentage * 225/100 || 0
  return (
    <div style={{
      position: 'relative',
      background: `rgba(${red},0,${blue},1)`,
      borderRadius: `1rem`,
      border: 'solid',
      borderColor:`rgba(0,${green},0,1)`,
      marginTop: `1rem`,
      width: '90%',
      zIndex: `${props.scaleDown ?? 1}`,
    }}>

      <div>

        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>

          <div style={{ display: "flex", flexDirection: "row" }}>
            <div><p style={{ padding: "1rem", margin: 0, fontSize:'2rem', }}>{task.name}</p></div>
          </div>
          {showDelete ? (<button style={{ color: "red", padding: "0.5rem", margin: "0.1rem" }} onClick={(() => task.delete())}>󰆴</button>) : (

            <div>

              <button style={{ padding: "0.5rem", margin: "0.1rem" }} onClick={async () => { await task.markComplete(); onUpdate?.() }}>✅</button>
              <button style={{ padding: "0.5rem", margin: "0.1rem" }} onClick={async () => { await task.markCancelled(); onUpdate?.() }}>❌</button>
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

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", background: 'rgba(0,0,0,0.5', borderRadius:'1rem', padding:'0.5rem' }}>
          <span style={{ color: "red" }}>Remaining: {task.getTimeTillEndOfCurrent()}</span>
          <span style={{ color: "green" }}>Next: {task.getTimeTillNextTimeframeString()}</span>
          
          
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
