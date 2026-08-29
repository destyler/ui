import { describe, expect, it } from 'vitest'
import { createSplitProps } from '../create-split-props'

describe('createSplitProps', () => {
  interface MachineProps {
    id: string
    disabled?: boolean
  }

  it('separates machine props without mutating the source', () => {
    const source = { id: 'field', disabled: true, class: 'root' }
    const [machine, local] = createSplitProps<MachineProps>()(source, ['id', 'disabled'])

    expect(machine).toStrictEqual({ id: 'field', disabled: true })
    expect(local).toStrictEqual({ class: 'root' })
    expect(source).toStrictEqual({ id: 'field', disabled: true, class: 'root' })
  })

  it('removes selected undefined keys from local props without forwarding them', () => {
    const source = { id: 'field', disabled: undefined, title: 'Label' }
    const [machine, local] = createSplitProps<MachineProps>()(source, ['id', 'disabled'])

    expect(machine).toStrictEqual({ id: 'field' })
    expect(local).toStrictEqual({ title: 'Label' })
  })

  it('keeps all props when the target has no keys', () => {
    const source = { title: 'Label', tabIndex: 0 }
    const [machine, local] = createSplitProps<Record<never, never>>()(source, [])

    expect(machine).toStrictEqual({})
    expect(local).toStrictEqual(source)
  })

  it('rejects incomplete and unknown target keys at type-check time', () => {
    const source = { id: 'field', disabled: true }

    // @ts-expect-error every MachineProps key must be listed
    createSplitProps<MachineProps>()(source, ['id'])
    // @ts-expect-error unknown keys cannot be selected
    createSplitProps<MachineProps>()(source, ['id', 'disabled', 'missing'])
  })
})
