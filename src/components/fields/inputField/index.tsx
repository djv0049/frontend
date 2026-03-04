import type { ChangeEvent } from 'react'
import styles from './index.module.scss'

type inputFieldProps = {
  title: string
  type: string
  value?: any // NOTE: generic, could be any type, really? probably only the ones allowed as input, unless i conditionally return different input types, eg: checkbox
  placeholder?: string
  updateValue: (e: ChangeEvent<HTMLInputElement, Element>) => void
}
export function InputField(props: inputFieldProps) {
  const { value, type, title, updateValue, placeholder } = props

  return (
    <div className={styles.inputContainer}>
      <p>{title}</p>
      <input
        className={styles.input}
        type={type}
        placeholder={placeholder || ''}
        onChange={(e) => updateValue(e)}
        value={value || ''}
      />
    </div>
  )
}
