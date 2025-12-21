import type { PropTypes } from '@destyler/vue'
import type { VNodeChild } from 'vue'
import type { Optional } from '~/types'
import * as toast from '@destyler/toast'
import { normalizeProps } from '@destyler/vue'
import { useId } from 'vue'

export interface CreateToasterProps extends Optional<Partial<toast.GroupMachineContext>, 'id'> {
  placement: toast.Placement
}

export interface CreateToasterReturn extends toast.GroupApi<PropTypes, VNodeChild> {
  machine: toast.GroupService<VNodeChild>
}

export function createToaster(props: CreateToasterProps): CreateToasterReturn {
  const machine = toast.group.machine({
    id: useId(),
    ...props,
 })
  const api = toast.group.connect(machine, machine.send, normalizeProps)
  return { ...api, machine }
}
