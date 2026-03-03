import type { ChangeEvent } from 'react'
import styles from './index.module.scss'

type inputFieldProps = {
  title: string
  type: string
  value?: any
  updateValue: (e: ChangeEvent<HTMLInputElement, Element>) => void
}
export function InputField(props: inputFieldProps) {
  const { value, type, title, updateValue } = props

  return (
    <div className={styles.inputContainer}>
      <p>{title}</p>
      <input
        className={styles.input}
        type={type}
        onChange={(e) => updateValue(e)}
        value={value}
      />
    </div>
  )
}
