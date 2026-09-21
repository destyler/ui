import type { UseNumberInputProps } from '../hooks/use-number-input'
import { NumberInput } from '../index'

export function InitialValue(props: UseNumberInputProps) {
  return (
    <NumberInput.Root {...props} defaultValue="42">
