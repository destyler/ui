import { LocaleProvider } from '../../locale'
import { Format } from '../index'

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
