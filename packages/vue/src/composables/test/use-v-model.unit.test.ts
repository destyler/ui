import type { Ref } from 'vue'
import { afterEach, describe, expect, expectTypeOf, it, vi } from 'vitest'
import { effectScope, nextTick, reactive } from 'vue'
import { useVModel } from '../use-v-model'

const scopes: ReturnType<typeof effectScope>[] = []

afterEach(() => {
  scopes.splice(0).forEach(scope => scope.stop())
})

function setupPassiveModel() {
  const scope = effectScope()
  scopes.push(scope)
  const props = reactive({ modelValue: 'initial' })
  const emit = vi.fn<(event: 'update:modelValue', value: string) => void>()
  const value = scope.run(() => useVModel(props, 'modelValue', emit, { passive: true }))!
  return { props, emit, value }
}

describe('useVModel passive synchronization', () => {
  it('keeps optional reads separate from the emitter payload type', async () => {
    const scope = effectScope()
    scopes.push(scope)
    const props = reactive<{ modelValue?: string }>({})
    const emit = vi.fn<(event: 'update:modelValue', value: string) => void>()
    const value = scope.run(() => useVModel(props, 'modelValue', emit, { passive: true }))!
    expectTypeOf(value).toEqualTypeOf<Ref<string | undefined, string>>()
    expect(value.value).toBeUndefined()

    value.value = 'initialized'
    await nextTick()
    expect(emit).toHaveBeenCalledExactlyOnceWith('update:modelValue', 'initialized')
  })

  it('emits the typed value payload when the local ref changes', async () => {
    const { emit, value } = setupPassiveModel()
    expect(value.value).toBe('initial')
    expect(emit).not.toHaveBeenCalled()

    value.value = 'updated'
    await nextTick()
    expect(emit).toHaveBeenCalledExactlyOnceWith('update:modelValue', 'updated')
  })

  it('accepts parent updates without emitting them back', async () => {
    const { props, emit, value } = setupPassiveModel()
    props.modelValue = 'from-parent'
    await nextTick()
    await nextTick()
    expect(value.value).toBe('from-parent')
    expect(emit).not.toHaveBeenCalled()

    value.value = 'from-child'
    await nextTick()
    expect(emit).toHaveBeenCalledExactlyOnceWith('update:modelValue', 'from-child')
  })
})
