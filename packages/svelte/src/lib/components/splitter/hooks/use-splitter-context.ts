import type { Accessor } from '$lib/types'
import type { Api } from '@destyler/splitter'
import type { PropTypes } from '@destyler/svelte'
import { createContext } from '$lib/utils/create-context'

export interface UseSplitterContext extends Accessor<Api<PropTypes>> {}

export const [SplitterProvider, useSplitterContext] = createContext<UseSplitterContext>({
  name: 'SplitterContext',
  hookName: 'useSplitterContext',
  providerName: '<SplitterProvider />',
})
