<script lang="ts">
  import { LocaleProvider } from '$lib/providers'
  import Basic from '../examples/Basic.svelte'
</script>

<LocaleProvider locale="ar-AE">
  <Basic orientation="horizontal" />
  <button type="button">After collapse</button>
</LocaleProvider>
