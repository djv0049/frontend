import { useState, type ChangeEvent } from "react";
import { CreateTaskButton } from "../../components/buttons/createTaskButton";
import { createTask } from "../../api/task";
import type { task } from "../../types/task";

type frequency = "never" | "daily" | "weekly" | "monthly | yearly"
export function Tasks() {

  const [name, setName] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [location, setLocation] = useState("TBC")
  const [priority, setPriority] = useState(1)
  const [repeatingFrequency, setRepeatingFrequency] = useState<frequency>("never")
  const [repeatingFrequencyCount, setRepeatingFrequencyCount] = useState(1)
  const [date, setDate] = useState("")


  const handleCreateButtonClick = () => {
    createTask({ name:name, startTime:startTime, endTime:endTime, date:date, priority:priority } as task)
  }

  return (
    <>
      <p>Task page</p>
      <div style={{ display: "flex", flexDirection: 'column' }}>
                <input placeholder="Do the thing!" onChange={(e) => setName(e.target.value)} />

        <p>{name}</p>
      </div>

      <div style={{ display: "flex", flexDirection: 'column' }}>
        <input placeholder="5" type='number' onChange={(e) => setPriority(Number(e.target.value))} />
        <p>{priority}</p>
      </div>

      <div style={{ display: "flex", flexDirection: 'column' }}>
        <input placeholder="Do the thing!" type='date' onChange={(e) => setDate((e.target.value))} />
        <p>{date.toString()}</p>
      </div>

      <div style={{ display: "flex", flexDirection: 'column' }}>
        <input placeholder="Do the thing!" type='date' onChange={(e) => setStartTime((e.target.value))} />
        <p>{startTime}</p>
      </div>

      <div style={{ display: "flex", flexDirection: 'column' }}>
        <input placeholder="Do the thing!" type='date' onChange={(e) => setEndTime((e.target.value))} />
        <p>{endTime}</p>
      </div>
      <CreateTaskButton onClick={handleCreateButtonClick} />
    </>
  )
}
