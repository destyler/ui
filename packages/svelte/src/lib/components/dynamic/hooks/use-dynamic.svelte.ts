import type { Accessor } from '$lib/types'
import type { PropTypes } from '@destyler/svelte'
import type { MaybeFunction } from '@destyler/utils'
import { useMachine } from '$lib/hooks/use-destyler-machine.svelte.js'
import { useEnvironmentContext, useLocaleContext } from '$lib/providers'
import { createMachineProps } from '$lib/utils/create-machine-props'
import { normalizeProps } from '$lib/utils/normalize-props'
import * as dynamic from '@destyler/dynamic'
import { runIfFn } from '@destyler/utils'
import { useFieldContext } from '../../field'

export interface UseDynamicProps extends Omit<dynamic.Context, 'dir' | 'getRootNode' | 'id'> {
  /**
   * A stable id for the dynamic input.
   *
   * Svelte hooks cannot call `$props.id()`. Components should pass the id
   * generated at the component's top level; `Dynamic.Root` does this
   * automatically.
   */
  id: string
  defaultValue?: dynamic.Context['value']
}
export interface UseDynamicReturn extends Accessor<dynamic.Api<PropTypes>> {}

export function useDynamic(inProps: MaybeFunction<UseDynamicProps>): UseDynamicReturn {
  const props = $derived.by<UseDynamicProps>(() => {
    const resolvedProps = runIfFn(inProps)
    return resolvedProps
  })

  const env = useEnvironmentContext()
  const locale = useLocaleContext()
  const field = useFieldContext()

  const machineProps = $derived.by(() => createMachineProps({
    ids: {
      label: field?.().ids.label,
      hiddenInput: field?.().ids.control,
    },
    dir: locale().dir,
    disabled: field?.().disabled,
    invalid: field?.().invalid,
    readOnly: field?.().readOnly,
    required: field?.().required,
    getRootNode: env().getRootNode,
    ...props,
  }, { value: 'defaultValue' }))

  const [state, send] = useMachine(() => dynamic.machine(machineProps.initial as dynamic.Context), {
    get context() {
      return machineProps.context as dynamic.Context
    },
  })
  const api = $derived(dynamic.connect(state, send, normalizeProps))

  return () => api
}
