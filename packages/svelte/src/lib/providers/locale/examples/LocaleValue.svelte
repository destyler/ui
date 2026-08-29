<script lang="ts">
  import { useLocaleContext } from '../index'

  const locale = useLocaleContext()
</script>

<p dir={locale().dir}>Locale: {locale().locale}; direction: {locale().dir}</p>
