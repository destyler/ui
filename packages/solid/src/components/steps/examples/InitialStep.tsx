import { Steps } from '@destyler-ui/solid/steps'
import { For } from 'solid-js'

const items = [
  { value: 'first', title: 'First', description: 'Contact Info' },
  { value: 'second', title: 'Second', description: 'Date & Time' },
  { value: 'third', title: 'Third', description: 'Select Rooms' },
]

export function InitialStep() {
  return (
    <Steps.Root count={items.length} defaultStep={1}>
