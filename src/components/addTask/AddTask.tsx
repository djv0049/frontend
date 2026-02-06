import { useState } from "react"
import { createTask } from "../../api/task"
import { CreateTaskButton } from "../buttons/createTaskButton"

//type frequency = "never" | "daily" | "weekly" | "monthly | yearly"

export function AddTask() {
  const [name, setName] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  //const [location, setLocation] = useState("TBC")
  const [priority, setPriority] = useState(1)
  //const [repeatingFrequency, setRepeatingFrequency] = useState<frequency>("never")
  //const [repeatingFrequencyCount, setRepeatingFrequencyCount] = useState(1)
  const [date, setDate] = useState(new Date())


  const handleCreateButtonClick = () => {
    console.log("hit button")
    createTask({ name: name, startTime: startTime, endTime: endTime, date: date, priority: priority })
  }
  return <>
    <div style={{ display: "flex", flexDirection: 'column' }}>
      <input placeholder="Do the thing!" onChange={(e) => setName(e.target.value)} />

      <p>{name}</p>
    </div>

    <div style={{ display: "flex", flexDirection: 'column' }}>
      <input placeholder="5" type='number' onChange={(e) => setPriority(Number(e.target.value))} />
      <p>{priority}</p>
    </div>

    <div style={{ display: "flex", flexDirection: 'column' }}>
      <input type='date' onChange={(e) => setDate(new Date(e.target.value))} />
      <p>{date.toISOString()}</p>
    </div>

    <div style={{ display: "flex", flexDirection: 'column' }}>
      <input type='time' onChange={(e) => setStartTime(e.target.value)} />
      <p>{startTime}</p>
    </div>

    <div style={{ display: "flex", flexDirection: 'column' }}>
      <input type='time' onChange={(e) => setEndTime(e.target.value)} />
      <p>{endTime}</p>
    </div>
    <CreateTaskButton onClick={handleCreateButtonClick} />
  </>
}
