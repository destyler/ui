<script lang="ts">
  import { LocaleProvider } from '../index'
  import FilterValue from './FilterValue.svelte'
</script>

<LocaleProvider locale="tr-TR">
  <FilterValue testId="context-filter" />
  <FilterValue testId="overridden-filter" locale="en-US" />
</LocaleProvider>
