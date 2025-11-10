import type { Locale } from '@destyler/i18n'

export interface LocaleProviderProps {
  /**
   * The locale to use for the application.
   * @default 'en-US'
   */
  locale: string
}

export interface LocaleContext extends Locale {}
