type props = {
  _id?: string
  name: string
  priority: number
}
export function Task(props: props) {

  console.log("PROPS:", props)


  return (
    <div style={{ width: "90%", borderRadius: '1em', border: 'solid', display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <button style={{ marginLeft: '0.5em', marginTop: '0.5em' }}>Icon button</button>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div>Name:</div>
        <div>{props.name}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div>priority:</div>
        <div>{props.priority}</div>
      </div>
    </div>
  )
}
