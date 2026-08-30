import { LocaleProvider } from '@destyler-ui/solid/locale'
import { Usage } from './Usage'

export function Basic() {
  return (
    <LocaleProvider locale="ar-BH">
      <Usage />
    </LocaleProvider>
  )
}
