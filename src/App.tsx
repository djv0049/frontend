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
    <div style={{ width: '90vw', height: '90vh', justifyContent: 'space-between', display: 'flex', flexDirection: 'row' }} >
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
        <nav style={{ display: 'flex', flexDirection: 'column', alignContent: 'space-between' }}>{/*nav*/}
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
        <div className='meta' style={{ display: 'flex', flexDirection: 'column' }} > {/*TODO: add meta class to modular styles*/}
          <h6>
            meta
          </h6>
          <table>
            <th></th>

            <tr><td>
              <p style={{ fontSize: '8px' }}> time: </p>
            </td>
              <td>
              <p style={{ fontSize: '8px' }}> {new Date().toLocaleTimeString()} </p>
              </td>
            </tr>
            <tr><td>
              <p style={{ fontSize: '8px' }}> version </p>
            </td> </tr>
            <tr><td>
              <p style={{ fontSize: '8px' }}> update date </p>
            </td> </tr>
            <tr><td>
              <p style={{ fontSize: '8px' }}> location: </p>
            </td> </tr>
            <tr><td>
              <p style={{ fontSize: '8px' }}> last active: </p>
            </td> </tr>
            <tr><td>
              <p style={{ fontSize: '8px' }}> copyright </p>
            </td> </tr>
          </table>
        </div>
      </div>
      <div> {/*main container*/}
        <h1>connected to backend = "{message}"</h1>
        {page == 'now' && (
          <Now />)}
        {page == 'tasks' && (
          <Tasks />)}
        {page == 'settings' && (
          <Settings />)}
        <h2 >message= quote of the day</h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}> {/*Live view and habits*/}
        <div>
          live view
        </div>
        <div>
          habits
        </div>
      </div>

    </div>
  )
}

export default App
