<script lang="ts">
  import { Highlight } from '../index'

  let query = $state('ipsum')
</script>

<div>
  <input type="text" placeholder="Search" bind:value={query} />
  <br />
  <Highlight
    {query}
    text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt."
  />
</div>
