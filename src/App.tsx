import { useEffect, useState } from 'react'
import './App.css'
import { Now } from './pages/now'
import { Tasks } from './pages/tasks'
import { Settings } from './pages/settings'

function App() {
  const [page, setpage] = useState("now")
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://0.0.0.0:3002/task/test")
      .then(res => res.json())
      .then(data => setMessage(data.working));
    console.log(message)
  }, [message]);


  return (
    <div style={{ width: '100%', height: '100%', justifyContent: 'center', display: 'flex', flexDirection: 'row'}} >
      <nav style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', width: '100%' }}>{/*nav*/}
        <div>
          <p onClick={() => setpage("tasks")} >Tasks</p>
        </div>
        <div>
          <p onClick={() => setpage("now")} title='now'>Now</p>
        </div>
        <div>
          <p onClick={() => setpage("settings")} >Settings</p>
        </div>
      </nav>
      <div> {/*main container*/}
        <h1>message = "{message}"</h1>
        {page == 'now' && (
          <Now />)}
        {page == 'tasks' && (
          <Tasks />)}
        {page == 'settings' && (
          <Settings />)}
        <h2 >message= quote of the day</h2>
      </div>
      <div> {/*Live view and habits*/}
hello
      </div>

    </div>
  )
}

export default App
