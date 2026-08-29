import type { PropTypes } from '@destyler/svelte'
import type { Snippet } from 'svelte'
import { normalizeProps } from '@destyler/svelte'
import * as toast from '@destyler/toast'
import { uuid } from '@destyler/utils'

export interface CreateToasterProps extends Partial<toast.GroupMachineContext> {
  placement: toast.Placement
}

export interface CreateToasterReturn extends toast.GroupApi<PropTypes, Snippet> {
  machine: toast.GroupService<Snippet>
}

export function createToaster(props: CreateToasterProps): CreateToasterReturn {
  const machine = toast.group.machine<Snippet>({ id: uuid(), ...props } as toast.GroupMachineContext)
  const api = toast.group.connect<PropTypes, Snippet>(machine, machine.send, normalizeProps)
  return { ...api, machine }
}
