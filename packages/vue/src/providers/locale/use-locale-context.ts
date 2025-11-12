import type { ComputedRef } from 'vue'
import type { LocaleContext } from './types'
import { computed } from 'vue'
import { createContext } from '../../utils'

export const DEFAULT_LOCALE: ComputedRef<LocaleContext> = computed(() => ({
  dir: 'ltr',
  locale: 'en-US',
}))

export const [LocaleContextProvider, useLocaleContext] = createContext<ComputedRef<LocaleContext>>('LocaleContext')
