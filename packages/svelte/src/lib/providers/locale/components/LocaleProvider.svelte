<script module lang="ts">
  import type { Snippet } from 'svelte'
  import type { UseLocaleContext } from '../hooks/use-locale-context'

  export interface LocaleProviderProps {
    /**
     * The locale to use for the application.
     * @default 'en-US'
     */
    locale: string
    /**
     * The children to render.
     */
    children?: Snippet
  }
</script>

<script lang="ts">
  import { isRTL } from '@destyler/i18n'
  import { LocaleContextProvider } from '../hooks/use-locale-context'

  let { locale, children }: LocaleProviderProps = $props()

  const context = $derived<ReturnType<UseLocaleContext>>({
    locale,
    dir: isRTL(locale) ? 'rtl' : 'ltr',
  })

  LocaleContextProvider(() => context)
</script>

{@render children?.()}
