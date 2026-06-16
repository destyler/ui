import { useState } from 'react'
import { Field } from '../index'

export interface ReactiveInvalidProps extends Field.RootProps {}

export function ReactiveInvalid(props: ReactiveInvalidProps) {
  const [errorMessage, setErrorMessage] = useState('')
  const invalid = !!errorMessage

  return (
    <>
      <input
        value={errorMessage}
        onChange={e => setErrorMessage(e.target.value)}
        placeholder="Type an error message"
      />
      <Field.Root invalid={invalid} {...props}>
        <span>IsInvalid? {String(invalid)}</span>
        <Field.ErrorText style={{ color: 'red' }}>{errorMessage}</Field.ErrorText>
      </Field.Root>
    </>
  )
}
