<script lang="ts">
  import { useEnvironmentContext } from '../index'

  const environment = useEnvironmentContext()
</script>

<pre>{JSON.stringify(environment().getRootNode(), null, 2)}</pre>
