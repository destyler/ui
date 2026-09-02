import type { ScrollbarProps } from '@destyler/scroll-area'
import type { Accessor } from 'solid-js'
import { createContext } from '~/utils/create-context'

export interface UseScrollAreaScrollbarContext extends Accessor<ScrollbarProps> {}

const scrollAreaScrollbarProviderTuple = createContext<UseScrollAreaScrollbarContext>({
  hookName: 'useScrollAreaScrollbarContext',
  providerName: '<ScrollAreaScrollbarProvider />',
})

export const ScrollAreaScrollbarProvider = scrollAreaScrollbarProviderTuple[0]
export const useScrollAreaScrollbarContext = scrollAreaScrollbarProviderTuple[1]
