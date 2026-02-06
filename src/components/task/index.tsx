import type { task } from "../../types/task"

export function Task({_id, name, priority, startTime}) {
  


  return (
      <div key={_id}>
        <div>Name:</div>
        <div>{name}</div>
        <div>priority:</div>
        <div>{priority}</div>
        <div>startTime:</div>
        <div>{startTime}</div>
      </div>
      )
}
