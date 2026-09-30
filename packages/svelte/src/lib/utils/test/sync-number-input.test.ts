import { afterEach, expect, it } from 'vitest'
import { syncNumberInputElement } from '../sync-number-input'

const inputs: HTMLInputElement[] = []
const frame = () => new Promise<void>(resolve => requestAnimationFrame(() => resolve()))

function createInput(type = 'text') {
  const input = document.createElement('input')
  input.type = type
  input.value = '10'
  document.body.append(input)
  input.focus()
  inputs.push(input)
  return input
}

afterEach(() => {
  inputs.splice(0).forEach(input => input.remove())
})

it('checks native ownership when the queued numeric write executes', async () => {
  const input = createInput()
  let ownsInput = true
  syncNumberInputElement(input, '12', () => ownsInput)
  ownsInput = false
  input.value = '編集中'
  input.setSelectionRange(1, 1)
  await frame()
  expect(input.value).toBe('編集中')
  expect(input.selectionStart).toBe(1)
})

it('updates native input types without text-selection support', async () => {
  const input = createInput('number')
  syncNumberInputElement(input, '12', () => true)
  await frame()
  expect(input.value).toBe('12')
  expect(input.selectionStart).toBeNull()
})

it('leaves unchanged selection intact and cancels obsolete writes', async () => {
  const input = createInput()
  input.setSelectionRange(0, 2)
  syncNumberInputElement(input, '10', () => true)
  await frame()
  expect(input.selectionStart).toBe(0)
  expect(input.selectionEnd).toBe(2)
  const cancel = syncNumberInputElement(input, '12', () => true)
  cancel()
  await frame()
  expect(input.value).toBe('10')
})
