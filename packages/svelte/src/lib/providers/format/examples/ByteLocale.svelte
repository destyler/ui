<script lang="ts">
  import { LocaleProvider } from '../../locale'
  import { Format } from '../index'

  const locales = ['de-DE', 'zh-CN']
</script>

<div>
  {#each locales as locale}
    <LocaleProvider {locale}>
      <Format.Byte value={1450.45} />
    </LocaleProvider>
  {/each}
</div>
