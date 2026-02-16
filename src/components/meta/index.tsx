export function Meta() {
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
              <p style={{ fontSize: '8px' }}>version </p>
            </td>
          </tr>
          <tr>
            <td>
              <p style={{ fontSize: '8px' }}>update date</p>
            </td>
          </tr>
          <tr>
            <td>
              <p style={{ fontSize: '8px' }}>location:</p>
            </td>
          </tr>
          <tr>
            <td>
              <p style={{ fontSize: '8px' }}>last active:</p>
            </td>
          </tr>
          <tr>
            <td>
              <p style={{ fontSize: '8px' }}>copyright</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  )
}
