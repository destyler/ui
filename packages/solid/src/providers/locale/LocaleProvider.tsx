import type { Locale } from '@destyler/i18n'
import type { ParentProps } from 'solid-js'
import { isRTL } from '@destyler/i18n'
import { createMemo } from 'solid-js'
import { LocaleContextProvider } from './use-locale-context'

export interface LocaleProviderProps extends ParentProps {
  /**
   * The locale to use for the application.
   * @default 'en-US'
   */
  locale: string
}

export function LocaleProvider(props: LocaleProviderProps) {
  const context = createMemo(
    (): Locale => ({
      locale: props.locale,
      dir: isRTL(props.locale) ? 'rtl' : 'ltr',
    }),
  )

  return <LocaleContextProvider value={context}>{props.children}</LocaleContextProvider>
}
