import type { Accessor } from '$lib/types'
import type { Locale } from '@destyler/i18n'
import { createContext } from '$lib/utils/create-context'

export interface UseLocaleContext extends Accessor<Locale> {}

export const [LocaleContextProvider, useLocaleContext] = createContext<UseLocaleContext>({
  name: 'LocaleContext',
  strict: false,
  defaultValue: (): Locale => ({
    dir: 'ltr',
    locale: 'en-US',
  }),
})
