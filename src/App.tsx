import { useState } from 'react'
import { LiveView } from './components/liveView'
import { Meta } from './components/meta'
import { NavigationPanel } from './components/navigationPanel'
import { Streaks } from './components/streaks'
import { Now } from './pages/now'
import { Settings } from './pages/settings'
import { Tasks } from './pages/tasks'
import styles from './index.module.scss'
import './App.css'


function App() {
  const [page, setpage] = useState("now")

  return (
    <div className={styles.mainBody} >
      <div className={styles.leftBar}>
        <NavigationPanel setPage={setpage} />
        <Meta />
      </div>
      <div style={{ justifyContent: "center" }}> {/*main container*/}
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
