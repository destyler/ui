import { formatNumber } from '@destyler/i18n'
import { createMemo, splitProps } from 'solid-js'
import { useLocaleContext } from '..'

export interface FormatNumberProps extends Intl.NumberFormatOptions {
  /**
   * The number to format
   */
  value: number
}

export function FormatNumber(props: FormatNumberProps) {
  const [valueProps, intlProps] = splitProps(props, ['value'])
  const ctx = useLocaleContext()
  const text = createMemo(() => formatNumber(valueProps.value, ctx().locale, intlProps))

  return <>{text}</>
}
