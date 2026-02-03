export function Task() {

  return (
    <div style={{ width: "60%", borderRadius: '1em', border: 'solid', display: "flex", flexDirection:"column", justifyContent: "center" }}>
      <button style={{ marginLeft: '0.5em', marginTop: '0.5em' }}>Icon button</button>
        <table>
          <tr>
            <td>
              Name:
            </td>
            <td >
              [[name]]
            </td>
          </tr>

          <tr>
            <td>
              Start:
            </td>
            <td>
              [[start]]
            </td>
          </tr>

          <tr>
            <td>
              End:
            </td>
            <td>
              [[end]]
            </td>
          </tr>

          <tr>
            <td>
              Priority:
            </td>
            <td>
              [[priority]]
            </td>
          </tr>
        </table>
    </div>
  )
}
