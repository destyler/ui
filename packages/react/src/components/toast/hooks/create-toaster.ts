import type { PropTypes } from '@destyler/react'
import type { ReactNode } from 'react'
import type { Optional } from '~/types'
import { normalizeProps } from '@destyler/react'
import * as toast from '@destyler/toast'

export interface CreateToasterProps extends Optional<Partial<toast.GroupMachineContext>, 'id'> {
  placement: toast.Placement
}

export interface CreateToasterReturn extends toast.GroupApi<PropTypes, ReactNode> {
  machine: toast.GroupService<ReactNode>
}

export function createToaster(props: CreateToasterProps): CreateToasterReturn {
  const machine = toast.group.machine<ReactNode>({ id: '1', ...props })
  const api = toast.group.connect(machine, machine.send, normalizeProps)
  return { ...api, machine }
}
