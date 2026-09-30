import { expect, it } from 'vitest'
import { createInputValueSync } from '../sync-input-value'

it('leaves accepted partial input to the core instead of eagerly applying its formatted value', async () => {
  const input = document.createElement('input')
  document.body.append(input)
  input.value = '1.'
  let state = '10'
  const sync = createInputValueSync(() => ({ value: '1' }), () => state)
  try {
    const pending = sync({ currentTarget: input } as unknown as Event)
    state = '1.'
    await pending
    expect(input.value).toBe('1.')
  }
  finally {
    input.remove()
  }
})

it('restores the accepted normalized value and selection when a native edit is rejected', async () => {
  const input = document.createElement('input')
  document.body.append(input)
  input.value = 'draft'
  input.setSelectionRange(2, 3, 'backward')
  const sync = createInputValueSync(() => ({ value: 'saved' }), () => 'saved')
  try {
    await sync({ currentTarget: input } as unknown as Event)
    expect(input.value).toBe('saved')
    expect(input.selectionStart).toBe(2)
    expect(input.selectionEnd).toBe(3)
    expect(input.selectionDirection).toBe('backward')
  }
  finally {
    input.remove()
  }
})

it('does not rewrite composing or unmounted inputs', async () => {
  const input = document.createElement('input')
  document.body.append(input)
  input.value = '編集中'
  const sync = createInputValueSync(() => ({ value: 'saved' }), () => 'saved')
  try {
    await sync({ currentTarget: input, isComposing: true } as unknown as InputEvent)
    expect(input.value).toBe('編集中')
    const pending = sync({ currentTarget: input } as unknown as Event)
    input.remove()
    await pending
    expect(input.value).toBe('編集中')
  }
  finally {
    input.remove()
  }
})

it('preserves the event-time caret after a reactive rollback already rewrote the input', async () => {
  const input = document.createElement('input')
  document.body.append(input)
  input.value = 'draft'
  input.setSelectionRange(2, 3, 'backward')
  const sync = createInputValueSync(() => ({ value: 'saved' }), () => 'saved')
  try {
    const pending = sync({ currentTarget: input } as unknown as Event)
    input.value = 'saved'
    input.setSelectionRange(0, 0)
    await pending
    expect(input.value).toBe('saved')
    expect(input.selectionStart).toBe(2)
    expect(input.selectionEnd).toBe(3)
    expect(input.selectionDirection).toBe('backward')
  }
  finally {
    input.remove()
  }
})

it('does not apply an older edit after a newer composing input supersedes it', async () => {
  const input = document.createElement('input')
  document.body.append(input)
  input.value = 'draft'
  const sync = createInputValueSync(() => ({ value: 'saved' }), () => 'saved')
  try {
    const pending = sync({ currentTarget: input } as unknown as Event)
    input.value = '編集中'
    await sync({ currentTarget: input, isComposing: true } as unknown as InputEvent)
    await pending
    expect(input.value).toBe('編集中')
  }
  finally {
    input.remove()
  }
})
