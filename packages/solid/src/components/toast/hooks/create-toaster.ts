import type { PropTypes } from '@destyler/solid'
import type { JSX } from 'solid-js'
import type { Optional } from '~/types'
import { normalizeProps } from '@destyler/solid'
import * as toast from '@destyler/toast'

export interface CreateToasterProps extends Optional<Partial<toast.GroupMachineContext>, 'id'> {
  placement: toast.Placement
}

export interface CreateToasterReturn extends toast.GroupApi<PropTypes, JSX.Element> {
  machine: toast.GroupService<JSX.Element>
}

export function createToaster(props: CreateToasterProps): CreateToasterReturn {
  const machine = toast.group.machine<JSX.Element>({ id: '1', ...props })
  const api = toast.group.connect(machine, machine.send, normalizeProps)
  return { ...api, machine }
}
