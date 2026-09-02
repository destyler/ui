import { Format } from '@destyler-ui/solid/format'
import { LocaleProvider } from '@destyler-ui/solid/locale'

export function NumberWithLocale() {
  return (
    <LocaleProvider locale="de-DE">
      <Format.Number value={1450.45} />
    </LocaleProvider>
  )
}
