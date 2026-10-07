import type { PropType } from 'vue'
import { defineComponent, h } from 'vue'
import { Checkbox } from '../../components/checkbox'
import { Radio } from '../../components/radio'
import { Switch } from '../../components/switch'

export const families = ['checkbox', 'radio', 'switch'] as const
export type Family = typeof families[number]

export const ChoiceInputsFixture = defineComponent({
  props: {
    family: { type: String as PropType<Family>, required: true },
    asChild: { type: Boolean, default: false },
  },
  emits: ['change', 'inputRef'],
  setup(props, { emit }) {
    return () => {
      const slots = props.asChild ? { default: () => h('input', { 'data-custom-input': '' }) } : undefined
      if (props.family === 'radio') {
        return h('form', {}, [h(Radio.Root, { id: 'radio', name: 'answer', modelValue: 'one', onValueChange: value => emit('change', value) }, () => [
          h(Radio.Label, {}, () => 'Radio'),
          ...['one', 'two'].map(value => h(Radio.Item, { value }, () => [h(Radio.ItemText, {}, () => value), h(Radio.ItemControl), h(Radio.ItemHiddenInput, { asChild: props.asChild, ref: input => emit('inputRef', value, input) }, slots)])),
        ])])
      }
      if (props.family === 'checkbox') {
        return h('form', {}, [h(Checkbox.Root, { id: 'checkbox', name: 'answer', value: 'one', checked: true, onCheckedChange: value => emit('change', value) }, () => [
          h(Checkbox.Label, {}, () => 'checkbox'),
          h(Checkbox.Control),
          h(Checkbox.HiddenInput, { asChild: props.asChild, ref: input => emit('inputRef', 'one', input) }, slots),
        ])])
      }
      return h('form', {}, [h(Switch.Root, { id: 'switch', name: 'answer', value: 'one', checked: true, onCheckedChange: value => emit('change', value) }, () => [
        h(Switch.Label, {}, () => 'switch'),
        h(Switch.Control),
        h(Switch.HiddenInput, { asChild: props.asChild, ref: input => emit('inputRef', 'one', input) }, slots),
      ])])
    }
  },
})
