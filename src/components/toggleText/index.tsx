import { Button } from "@mui/material"

export function ToggleText({
  callback,
  active,
  text,
  compact
}: {
  callback?: () => void
  active: boolean
  text: string
  compact?: boolean
  edit: boolean
}) {
  return (
    <>
      {compact ? (
        <Button
          onClick={callback}
          style={{
            borderRadius: 8,
            backgroundColor: "gray",
            margin: 0,
            padding: 0,
            minWidth: "12%"
          }}
        >
          <p
            style={{
              fontSize: 18,
              margin: 0,
              padding: 0,
              borderWidth: 0,
              color: active ? "red" : "blue",
              fontWeight: active ? 'bold' : 'normal',
            }}
          >
            {text}
          </p>
        </Button>
      ) : (<>
        <p
          style={{
            margin: 0,
            padding: 0,
            color: active ? "red" : "blue",
          }}
        >{text}</p>
      </>)}
    </ >
  )
}
