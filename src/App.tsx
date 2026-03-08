import { useState } from 'react'
import './App.css'
import { LiveView } from './components/liveView'
import { Meta } from './components/meta'
import { NavigationPanel } from './components/navigationPanel'
import { Streaks } from './components/streaks'
import { Now } from './pages/now'
import { Settings } from './pages/settings'
import { Tasks } from './pages/tasks'


function App() {
  const [page, setpage] = useState("now")

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
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}> {/*Live view and habits*/}
        <LiveView />
        <Streaks />
      </div>
    </div>
  )
}

export default App
