import { Format } from '../index'
import { LocaleProvider } from '../../locale'

export function NumberWithLocale() {
  return (
    <LocaleProvider locale="de-DE">
      <Format.Number value={1450.45} />
    </LocaleProvider>
  )
}
