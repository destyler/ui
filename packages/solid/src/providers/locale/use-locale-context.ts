import type { Locale } from '@destyler/i18n'
import type { Accessor } from 'solid-js'
import { createContext } from '~/utils/create-context'

export interface UseLocaleContext extends Accessor<Locale> {}

const localeContextProviderTuple = createContext<UseLocaleContext>({
  hookName: 'useEnvironmentContext',
  providerName: '<EnvironmentProvider />',
  strict: false,
  defaultValue: () => ({ dir: 'ltr', locale: 'en-US' }),
})

export const LocaleContextProvider = localeContextProviderTuple[0]
export const useLocaleContext = localeContextProviderTuple[1]
