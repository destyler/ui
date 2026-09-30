import { Checkbox, Collapsible, createListCollection, Toggle, useToggleContext } from '@destyler-ui/react'
import { createRef } from 'react'

const buttonRef = createRef<HTMLButtonElement>()
const collection = createListCollection({ items: [{ label: 'React', value: 'react' }] })
const toggleProps: Toggle.RootProps = { defaultPressed: false, onPressedChange: value => value satisfies boolean }
const checkboxProps: Checkbox.RootProps = { defaultChecked: true }

function PressedState() {
  const pressed: boolean = useToggleContext().pressed
  return <span>{String(pressed)}</span>
}

export const example = (
  <>
    <Toggle.Root {...toggleProps} ref={buttonRef}><PressedState /></Toggle.Root>
    <Checkbox.Root {...checkboxProps}>
      <Checkbox.Label>{collection.items[0].label}</Checkbox.Label>
      <Checkbox.Control><Checkbox.Indicator /></Checkbox.Control>
      <Checkbox.HiddenInput />
    </Checkbox.Root>
    <Collapsible.Root defaultOpen onOpenChange={details => details.open satisfies boolean}>
      <Collapsible.Trigger>Details</Collapsible.Trigger>
      <Collapsible.Content>Content</Collapsible.Content>
    </Collapsible.Root>
  </>
)
