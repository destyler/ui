import type { PropTypes } from '@destyler/vue'
import type { ComputedRef } from 'vue'
import type { RootEmits } from '../namespace'
import type { EmitFn, Optional } from '~/types'
import * as editable from '@destyler/edit'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, shallowRef, useId } from 'vue'
import { useFieldContext } from '~/components/field'
import { DEFAULT_LOCALE, useEnvironmentContext, useLocaleContext } from '~/providers'
import { cleanProps } from '~/utils'

export interface UseEditProps
  extends Optional<Omit<editable.Context, 'dir' | 'getRootNode' | 'value'>, 'id'> {
  /**
   * The initial edit state of the editable when it is first rendered.
   * Use when you do not need to control its edit state.
   */
  defaultEdit?: editable.Context['edit']
  /**
   * The initial value of the editable when it is first rendered.
   * Use when you do not need to control the state of the editable.
   */
  defaultValue?: editable.Context['value']
  modelValue?: editable.Context['value']
}

export interface UseEditReturn extends ComputedRef<editable.Api<PropTypes>> {}

export function useEdit(props: UseEditProps = {}, emit?: EmitFn<RootEmits>): UseEditReturn {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext(DEFAULT_LOCALE)
  const field = useFieldContext()
  // Core has no defaultEdit. The UI owns this initial-only state and writes back
  // edit requests, while a live edit prop keeps the parent in control.
  const uncontrolledEdit = shallowRef(props.defaultEdit ?? false)
  const context = computed<editable.Context>(() => {
    const { defaultEdit: _defaultEdit, edit, onEditChange, ...rest } = props
    return {
      id,
      ids: {
        label: field?.value.ids.label,
        input: field?.value.ids.control,
      },
      disabled: field?.value.disabled,
      invalid: field?.value.invalid,
      readOnly: field?.value.readOnly,
      required: field?.value.required,
      dir: locale.value.dir,
      ...(props.modelValue !== undefined ? { value: props.modelValue } : {}),
      getRootNode: env?.value.getRootNode,
      edit: edit !== undefined ? edit : uncontrolledEdit.value,
      onEditChange: (details) => {
        if (props.edit === undefined)
          uncontrolledEdit.value = details.edit
        onEditChange?.(details)
        emit?.('editChange', details)
        emit?.('update:edit', details.edit)
      },
      onValueChange(details) {
        emit?.('valueChange', details)
        emit?.('update:modelValue', details.value)
      },
      onFocusOutside: details => emit?.('focusOutside', details),
      onInteractOutside: details => emit?.('interactOutside', details),
      onPointerDownOutside: details => emit?.('pointerDownOutside', details),
      onValueCommit: details => emit?.('valueCommit', details),
      onValueRevert: details => emit?.('valueRevert', details),
      ...cleanProps(rest),
    }
  })

  const [state, send] = useMachine(editable.machine(context.value), { context })
  return computed(() => editable.connect(state.value, send, normalizeProps))
}
