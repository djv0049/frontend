import { Button } from "@mui/material"

export function ToggleText({
  callback,
  active,
  text,
}: {
  callback?: () => void
  active: boolean
  text: string
}) {
  return (
    <Button
      onClick={callback}
      style={{
        borderRadius: 8,
        backgroundColor: "gray"
      }}
    >
      <p
        style={{
          fontSize: 18,

          marginLeft: 16,
          marginRight: 16,
          marginTop: 8,
          marginBottom: 8,
          borderWidth: 0,
          color: active ? "red" : "blue",
          fontWeight: active ? 'bold' : 'normal',
        }}
      >
        {text}
      </p>
    </Button>
  )
}
