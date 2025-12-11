import type { UseMenuReturn } from './use-menu'
import { createContext } from '~/utils'

export type UseMenuMachineContext = UseMenuReturn['machine'] | undefined

export const [MenuMachineProvider, useMenuMachineContext] = createContext<UseMenuMachineContext>('MenuMachineContext')
