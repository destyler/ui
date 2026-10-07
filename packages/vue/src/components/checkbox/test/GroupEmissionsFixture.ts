import { defineComponent, h } from 'vue'
import { Checkbox } from '../index'

export const GroupEmissionsFixture = defineComponent({
  emits: ['checkedChange', 'update:checked', 'valueChange'],
  setup(_props, { emit }) {
    return () => h('form', {}, [
      h(Checkbox.Group, { modelValue: ['alpha'], name: 'answer', onValueChange: value => emit('valueChange', value) }, () => [
        h(Checkbox.Root, {
          'id': 'hydrated-choice',
          'value': 'alpha',
          'onCheckedChange': details => emit('checkedChange', details),
          'onUpdate:checked': value => emit('update:checked', value),
        }, () => [h(Checkbox.Label, {}, () => 'Choice'), h(Checkbox.Control), h(Checkbox.HiddenInput)]),
      ]),
    ])
  },
})
