import { useState, type ChangeEvent } from "react";
import { CreateTaskButton } from "../../components/buttons/createTaskButton";
import { createTask } from "../../api/task";

type frequency = "never" | "daily" | "weekly" | "monthly | yearly"
export function Tasks() {

  const [name, setName] = useState("")
  const [startTime, setStartTime] = useState(new Date())
  const [endTime, setEndTime] = useState(new Date())
  const [location, setLocation] = useState("TBC")
  const [priority, setPriority] = useState(1)
  const [repeatingFrequency, setRepeatingFrequency] = useState<frequency>("never")
  const [repeatingFrequencyCount, setRepeatingFrequencyCount] = useState(1)
  const [date, setDate] = useState(new Date())

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target || !event.target.value) return
    setName(event.target.value);
  };
  const handleCreateButtonClick = () => {
    createTask({ name, startTime, endTime, date })
  }
  return (
    <>
      <p>Task page</p>
      <div style={{ display: "flex", flexDirection: 'column' }}>

        <input placeholder="Do the thing!" onChange={handleNameChange} />
        <p>{name}</p>
      </div>
      <CreateTaskButton onClick={handleCreateButtonClick} />
    </>
  )
}
