import type { PropTypes } from '@destyler/react'
import type { Optional } from '~/types'
import * as dynamic from '@destyler/dynamic'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'
import { useFieldContext } from '~/components/field'
import { useEvent } from '~/hooks/use-event'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UseDynamicProps extends Optional<Omit<dynamic.Context, 'dir' | 'getRootNode'>, 'id'> {
  /**
   * The initial value of the dynamic when it is first rendered.
   * Use when you do not need to control the state of the dynamic.
   */
  defaultValue?: dynamic.Context['value']
}

export interface UseDynamicReturn extends dynamic.Api<PropTypes> {}

export function useDynamic(props: UseDynamicProps = {}): UseDynamicReturn {
  const { getRootNode } = useEnvironmentContext()
  const { dir } = useLocaleContext()
  const field = useFieldContext()

  const initialContext: dynamic.Context = {
    id: useId(),
    ids: {
      label: field?.ids.label,
      hiddenInput: field?.ids.control,
    },
    dir,
    disabled: field?.disabled,
    invalid: field?.invalid,
    readOnly: field?.readOnly,
    required: field?.required,
    getRootNode,
    value: props.defaultValue,
    ...props,
  }

  const context: dynamic.Context = {
    ...initialContext,
    value: props.value,
    onValueChange: useEvent(props.onValueChange, { sync: true }),
    onValueInvalid: useEvent(props.onValueInvalid),
    onHighlightChange: useEvent(props.onHighlightChange),
  }

  const [state, send] = useMachine(dynamic.machine(initialContext), { context })

  return dynamic.connect(state, send, normalizeProps)
}
