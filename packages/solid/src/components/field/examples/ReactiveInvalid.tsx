import { Field } from '@destyler-ui/solid/field'
import { createSignal } from 'solid-js'

export interface ReactiveInvalidProps extends Field.RootProps {}

export function ReactiveInvalid(props: ReactiveInvalidProps) {
  const [errorMessage, setErrorMessage] = createSignal('')
  const invalid = () => !!errorMessage()

  return (
    <>
      <input
        aria-label="Error message"
        value={errorMessage()}
        onInput={event => setErrorMessage(event.currentTarget.value)}
        placeholder="Type an error message"
      />
      <Field.Root invalid={invalid()} {...props}>
        <span>IsInvalid? {String(invalid())}</span>
        <Field.ErrorText style={{ color: 'red' }}>{errorMessage()}</Field.ErrorText>
      </Field.Root>
    </>
  )
}
