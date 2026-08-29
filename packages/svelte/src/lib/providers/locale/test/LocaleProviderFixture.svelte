<script lang="ts">
  import { LocaleProvider } from '../index'
  import LocaleValue from '../examples/LocaleValue.svelte'

  let locale = $state('en-US')
</script>

<button type="button" onclick={() => (locale = locale === 'en-US' ? 'ar-SA' : 'en-US')}>Change locale</button>

<LocaleProvider {locale}>
  <LocaleValue />
</LocaleProvider>
