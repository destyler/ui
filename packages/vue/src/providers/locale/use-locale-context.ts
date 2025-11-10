import { type ComputedRef, computed } from 'vue'
import { createContext } from '../../utils'
import type { LocaleContext } from './types'


export const DEFAULT_LOCALE: ComputedRef<LocaleContext> = computed(() => ({
  dir: 'ltr',
  locale: 'en-US',
}))

export const [LocaleContextProvider, useLocaleContext] = createContext<ComputedRef<LocaleContext>>('LocaleContext')
