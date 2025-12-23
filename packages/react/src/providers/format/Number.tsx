import { formatNumber } from '@destyler/i18n'
import { useMemo } from 'react'
import { useLocaleContext } from '../../providers/locale'

export interface FormatNumberProps extends Intl.NumberFormatOptions {
  /**
   * The number to format
   */
  value: number
}

export function FormatNumber(props: FormatNumberProps) {
  const { value, ...intlOptions } = props
  const { locale } = useLocaleContext()
  const text = useMemo(() => formatNumber(value, locale, intlOptions), [value, locale, intlOptions])
  return <>{text}</>
}

FormatNumber.displayName = 'FormatNumber'
