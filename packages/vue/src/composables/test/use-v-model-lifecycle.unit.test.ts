import { describe, expect, it, vi } from 'vitest'
import { effectScope, nextTick, reactive, watch } from 'vue'
import { useVModel } from '../use-v-model'

describe('useVModel passive parent lifecycle', () => {
  it.each(['pre', 'post'] as const)('retains a newer parent value from a %s watcher without echoing either value', async (flush) => {
    const scope = effectScope()
    const props = reactive({ modelValue: 'initial' })
    const emit = vi.fn()
    const value = scope.run(() => {
      const model = useVModel(props, 'modelValue', emit, { passive: true })
      watch(() => props.modelValue, (value) => {
        if (value === 'intermediate')
          props.modelValue = 'final'
      }, { flush })
      return model
    })!
    try {
      props.modelValue = 'intermediate'
      await nextTick()
      await nextTick()
      expect(props.modelValue).toBe('final')
      expect(value.value).toBe('final')
      expect(emit).not.toHaveBeenCalled()

      value.value = 'child'
      await nextTick()
      expect(emit).toHaveBeenCalledExactlyOnceWith('update:modelValue', 'child')

      // A second parent cycle proves the echo guard was released and does not
      // merely happen to accept the first normalized value.
      props.modelValue = 'intermediate'
      await nextTick()
      await nextTick()
      expect(value.value).toBe('final')
      expect(emit).toHaveBeenCalledTimes(1)
    }
    finally {
      scope.stop()
    }
  })

  it('stops both synchronization directions when its owning scope is disposed', async () => {
    const scope = effectScope()
    const props = reactive({ modelValue: 'initial' })
    const emit = vi.fn()
    const value = scope.run(() => useVModel(props, 'modelValue', emit, { passive: true }))!
    props.modelValue = 'queued before dispose'
    scope.stop()
    props.modelValue = 'parent after dispose'
    await nextTick()
    expect(value.value).toBe('initial')
    value.value = 'child after dispose'
    await nextTick()
    expect(emit).not.toHaveBeenCalled()
  })
})
