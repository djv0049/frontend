type createButtonProps = {
  onClick: () => void
}
export function CreateTaskButton(props: createButtonProps) {
  const { onClick } = props
  return (<button onClick={onClick}>Add Task</button>)
}
