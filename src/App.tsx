import { useState } from 'react'
import './App.css'
import { Now } from './pages/now'
import { Tasks } from './pages/tasks'
import { Settings } from './pages/settings'

function App() {
  const [count, setCount] = useState(0)
  const [page, setpage] = useState("now")

  return (
    <div style={{ width: '100vw', height: '100vh', justifyContent: 'center' }} >
      <nav style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
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
      {page == 'now' && (
        <Now />)}
      {page == 'tasks' && (
        <Tasks />)}
      {page == 'settings' && (
        <Settings />)}

    </div>
  )
}

export default App
