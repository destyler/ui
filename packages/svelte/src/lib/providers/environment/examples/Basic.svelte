<script lang="ts">
  import { EnvironmentProvider } from '../index'
  import Usage from './Usage.svelte'
</script>

<EnvironmentProvider>
  <Usage />
</EnvironmentProvider>
