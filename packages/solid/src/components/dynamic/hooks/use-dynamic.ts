import type { PropTypes } from '@destyler/solid'
import type { Accessor } from 'solid-js'
import type { Optional } from '~/types'
import * as dynamic from '@destyler/dynamic'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import { useFieldContext } from '~/components/field'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UseDynamicProps
  extends Optional<Omit<dynamic.Context, 'dir' | 'getRootNode'>, 'id'> {
  /**
   * The initial value of the tags input when it is first rendered.
   * Use when you do not need to control the state of the tags input.
   */
  defaultValue?: dynamic.Context['value']
}
export interface UseDynamicReturn extends Accessor<dynamic.Api<PropTypes>> {}

export function useDynamic(props: UseDynamicProps = {}): UseDynamicReturn {
  const locale = useLocaleContext()
  const environment = useEnvironmentContext()
  const id = createUniqueId()
  const field = useFieldContext()

  const initialContext = createMemo(() => ({
    id,
    ids: {
      label: field?.().ids.label,
      hiddenInput: field?.().ids.control,
    },
    dir: locale().dir,
    disabled: field?.().disabled,
    invalid: field?.().invalid,
    readOnly: field?.().readOnly,
    required: field?.().required,
    getRootNode: environment().getRootNode,
    value: props.defaultValue,
    ...props,
  }))
  const context = createMemo(() => ({
    ...initialContext(),
    value: props.value,
  }))
  const [state, send] = useMachine(dynamic.machine(initialContext()), { context })

  return createMemo(() => dynamic.connect(state, send, normalizeProps))
}
