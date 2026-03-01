import { useEffect, useState } from 'react'
import './App.css'
import { Now } from './pages/now'
import { Tasks } from './pages/tasks'
import { Settings } from './pages/settings'
import { Meta } from './components/meta'
import { NavigationPanel } from './components/navigationPanel'
import { LiveView } from './components/liveView'
import { Streaks } from './components/streaks/streaks'


function App() {
  const [page, setpage] = useState("now")
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_URL}/task/test`)
      .then(res => res.json())
      .then(data => setMessage(data.working));
  }, [message]);



  return (
    <div style={{ width: '90vw', height: '90vh', justifyContent: 'space-between', display: 'flex', flexDirection: 'row' }} >
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', alignContent: 'center' }}>
        <NavigationPanel setPage={setpage} />
        <Meta />
      </div>
      <div style={{justifyContent:"center"}}> {/*main container*/}
        <h1>General Life Administration</h1>
        {page == 'now' && (
          <Now />)}
        {page == 'tasks' && (
          <Tasks />)}
        {page == 'settings' && (
          <Settings />)}
        <h2 >message=quote of the day</h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}> {/*Live view and habits*/}
        <LiveView />
        <Streaks />
      </div>

    </div>
  )
}

export default App
