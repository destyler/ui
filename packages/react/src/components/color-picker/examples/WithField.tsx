import { Field } from '~/components/field'
import { ColorPicker, parseColor } from '../index'

interface WithFieldProps {
  required?: boolean
  disabled?: boolean
  readOnly?: boolean
  invalid?: boolean
}

export function WithField({ required, disabled, readOnly, invalid }: WithFieldProps = {}) {
  return (
    <Field.Root invalid={invalid}>
      <ColorPicker.Root defaultValue={parseColor('hsl(20, 100%, 50%)')} disabled={disabled} readOnly={readOnly}>
        <ColorPicker.Label>Label</ColorPicker.Label>
        <ColorPicker.Control>
          <ColorPicker.ChannelInput channel="hex" />
          <ColorPicker.ChannelInput channel="alpha" />
          <ColorPicker.ValueText />
          <ColorPicker.Trigger>
            <ColorPicker.TransparencyGrid />
            <ColorPicker.ValueSwatch />
          </ColorPicker.Trigger>
        </ColorPicker.Control>
        <ColorPicker.Positioner>
          <ColorPicker.Content />
        </ColorPicker.Positioner>
        <ColorPicker.HiddenInput required={required} />
      </ColorPicker.Root>
      <Field.HelperText>Additional Info</Field.HelperText>
      <Field.ErrorText>Error Info</Field.ErrorText>
    </Field.Root>
  )
}
