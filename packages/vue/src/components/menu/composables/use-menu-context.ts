import type { UseMenuReturn } from './use-menu'
import { createContext } from '~/utils'

export type UseMenuContext = UseMenuReturn['api']

export const [MenuProvider, useMenuContext] = createContext<UseMenuContext>('MenuContext')
