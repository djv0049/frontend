import { useState, useEffect } from "react";

export function Meta() {

  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_URL}/task/test`)
      .then(res => res.json())
      .then(data => setMessage(data.working));
  }, [message]);

  return (
    <div className='meta' style={{ display: 'flex', flexDirection: 'column' }} > {/*TODO: add meta class to modular styles*/}
      <h6>
        meta
      </h6>
      <table>
        <tbody>

          <tr>
            <td>
              <p style={{ fontSize: '8px' }}>time:</p>
            </td>
            <td>
              <p style={{ fontSize: '8px' }}>{new Date().toLocaleTimeString()}</p>
            </td>
          </tr>
          <tr>
            <td>
              <p style={{ fontSize: '8px' }}>version:</p>
            </td>
          </tr>
          <tr>
            <td>
              <p style={{ fontSize: '8px' }}>update date:</p>
            </td>
          </tr>
          <tr>
            <td>
              <p style={{ fontSize: '8px' }}>connection:</p>
            </td>
            <td>
              <p style={{ fontSize: '8px' }}>{message}</p>
            </td>
          </tr>
          <tr>
            <td>
              <p style={{ fontSize: '8px' }}>last active:</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  )
}
