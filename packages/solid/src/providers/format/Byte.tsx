import { formatBytes } from '@destyler/i18n'
import { createMemo, splitProps } from 'solid-js'
import { useLocaleContext } from '..'

export interface FormatByteProps {
  /**
   * The unit granularity to display
   */
  unit?: 'bit' | 'byte'
  /**
   * The unit display
   */
  unitDisplay?: 'long' | 'short' | 'narrow'
  /**
   * The byte size to format
   */
  value: number
}

export function FormatByte(props: FormatByteProps) {
  const [valueProps, intlProps] = splitProps(props, ['value'])
  const ctx = useLocaleContext()
  const text = createMemo(() => formatBytes(valueProps.value, ctx().locale, intlProps))

  return <>{text}</>
}
