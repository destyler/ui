import type { InputHTMLAttributes } from 'vue'
import { Checkbox, Collapsible, Field, Toggle, useToggleContext } from '@destyler-ui/vue'
import { h } from 'vue'

const toggleProps: Toggle.RootProps = { defaultPressed: false }
const checkboxProps: Checkbox.RootProps = { defaultChecked: true }
const collapseProps: Collapsible.RootProps = { defaultOpen: false }
export const examples = [h(Toggle.Root, toggleProps), h(Checkbox.Root, checkboxProps), h(Collapsible.Root, collapseProps)]
export const readContext = () => useToggleContext().value.pressed satisfies boolean

// @ts-expect-error The public props must not collapse to any.
export const invalid: Toggle.RootProps = { defaultPressed: 'yes' }

// Native attributes and polymorphic props stay available from the public entry.
const fieldInputProps: Field.InputProps = { asChild: true, autocomplete: 'shipping street-address' }
export const fieldInput = h(Field.Input, fieldInputProps, () => h('input'))
export const fieldInputInline = h(Field.Input, { asChild: true }, () => h('input'))
// @ts-expect-error Polymorphic boolean props remain strict.
export const invalidFieldAsChild: Field.InputProps = { asChild: 'yes' }
// @ts-expect-error Native autocomplete remains a string attribute.
export const invalidFieldAutocomplete: Field.InputProps = { autocomplete: true }

// Keep each supported Vue release's native optional-property contract.
export const fieldCustomAutocomplete: Field.InputProps = { autocomplete: 'custom-autocomplete-token' }
export const nativeToFieldAutocomplete = (value: InputHTMLAttributes['autocomplete']): Field.InputProps['autocomplete'] => value
export const fieldToNativeAutocomplete = (value: Field.InputProps['autocomplete']): InputHTMLAttributes['autocomplete'] => value
// @ts-expect-error The native autocomplete attribute excludes null.
export const invalidNativeNull: InputHTMLAttributes['autocomplete'] = null
// @ts-expect-error The public autocomplete attribute also excludes null.
export const invalidFieldNull: Field.InputProps['autocomplete'] = null
// @ts-expect-error Numeric autocomplete values remain invalid.
export const invalidFieldNumber: Field.InputProps = { autocomplete: 1 }
// @ts-expect-error Native capture literals remain strict.
export const invalidFieldCapture: Field.InputProps = { capture: 'not-a-camera' }

type FieldInputSlots = InstanceType<typeof Field.Input>['$slots']
export const fieldDefaultSlot: NonNullable<FieldInputSlots['default']> = () => [h('input')]
// @ts-expect-error The default slot must remain callable.
export const invalidFieldSlot: NonNullable<FieldInputSlots['default']> = 'not-a-slot'
export const fieldComponentName: string | undefined = Field.Input.name
// @ts-expect-error Component statics must retain their type instead of becoming any.
export const invalidFieldComponentName: number = Field.Input.name

export const nativeInputPropsToField = (value: Omit<InputHTMLAttributes, 'value'>): Field.InputProps => value
export const fieldPropsToNative = (value: Field.InputProps): Omit<InputHTMLAttributes, 'value'> => value

type ExpectTrue<T extends true> = T
type NativeAcceptsExplicitUndefined = { autocomplete: undefined } extends Pick<InputHTMLAttributes, 'autocomplete'> ? true : false
type FieldAcceptsExplicitUndefined = { autocomplete: undefined } extends Pick<Field.InputProps, 'autocomplete'> ? true : false
export type ExactOptionalAutocompleteIsPreserved = ExpectTrue<
  NativeAcceptsExplicitUndefined extends FieldAcceptsExplicitUndefined
    ? FieldAcceptsExplicitUndefined extends NativeAcceptsExplicitUndefined ? true : false
    : false
>
