import { formatBytes } from '@destyler/i18n'
import { useMemo } from 'react'
import { useLocaleContext } from '~/providers/locale'

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
  const { value, ...intlOptions } = props
  const { locale } = useLocaleContext()
  const text = useMemo(() => formatBytes(value, locale, intlOptions), [value, locale, intlOptions])
  return <>{text}</>
}

FormatByte.displayName = 'FormatByte'
