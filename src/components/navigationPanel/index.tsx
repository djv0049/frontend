export type NavProps={
  setPage: (pageName: string) => void
}
export function NavigationPanel(props:NavProps){
  const {setPage} = props
return (
        <nav style={{ display: 'flex', flexDirection: 'column', alignContent: 'space-between' }}>{/*nav*/}
          <div>
            <p onClick={() => setPage("tasks")} >Tasks</p>
          </div>
          <div>
            <p onClick={() => setPage("now")} title='now'>Now</p>
          </div>
          <div>
            <p onClick={() => setPage("settings")} >Settings</p>
          </div>
        </nav>
)
}
