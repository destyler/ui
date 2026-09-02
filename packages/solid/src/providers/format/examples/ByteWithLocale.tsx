import { Format } from '@destyler-ui/solid/format'
import { LocaleProvider } from '@destyler-ui/solid/locale'
import { For } from 'solid-js'

export function ByteWithLocale() {
  const locales = ['de-DE', 'zh-CN']
  const value = 1450.45

  return (
    <div>
      <For each={locales}>
        {locale => (
          <LocaleProvider locale={locale}>
            <Format.Byte value={value} />
          </LocaleProvider>
        )}
      </For>
    </div>
  )
}
