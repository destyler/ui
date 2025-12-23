import type { Locale } from '@destyler/i18n'
import type { PropsWithChildren } from 'react'
import { isRTL } from '@destyler/i18n'
import { LocaleContextProvider } from './use-locale-context'

export interface LocaleProviderProps extends PropsWithChildren {
  /**
   * The locale to use for the application.
   * @default 'en-US'
   */
  locale: string
}

export function LocaleProvider(props: LocaleProviderProps) {
  const { children, locale } = props

  const context: Locale = {
    locale,
    dir: isRTL(locale) ? 'rtl' : 'ltr',
  }

  return <LocaleContextProvider value={context}>{children}</LocaleContextProvider>
}
