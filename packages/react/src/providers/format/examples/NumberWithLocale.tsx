import { LocaleProvider } from '../../locale'
import { Format } from '../index'

export function NumberWithLocale() {
  return (
    <LocaleProvider locale="de-DE">
      <Format.Number value={1450.45} />
    </LocaleProvider>
  )
}
