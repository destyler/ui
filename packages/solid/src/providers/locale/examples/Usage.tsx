import { useLocaleContext } from '@destyler-ui/solid/locale'

export function Usage() {
  const locale = useLocaleContext()

  return <pre>{JSON.stringify(locale(), null, 2)}</pre>
}
