import { Format } from '../index'
import { LocaleProvider } from '../../locale'

const locales = ['de-DE', 'zh-CN']
const value = 1450.45

export function ByteLocale() {
  return (
    <div>
      {locales.map(locale => (
        <LocaleProvider key={locale} locale={locale}>
          <Format.Byte value={value} />
        </LocaleProvider>
      ))}
    </div>
  )
}
