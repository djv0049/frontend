export function Task() {

  return (
    <div style={{ width: "60%", borderRadius: '1em', border: 'solid' }}>
      <div style={{ display: 'flex', width: '100%', justifyContent:"space-between" }}>
        <div style={{marginRight: '0.5em', marginTop: '0.5em'}} >
          [[name]]
        </div>
          <button style={{ marginLeft: '0.5em', marginTop: '0.5em' }}>Icon button</button>
      </div>

      <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
        <div>
          Name:
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
        <div>
          Start:
        </div>
        <div>
          [[start]]
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
        <div>
          End:
        </div>
        <div>
          [[end]]
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
        <div>
          Priority:
        </div>
        <div>
          [[priority]]
        </div>
      </div>
    </div>
  )
}
