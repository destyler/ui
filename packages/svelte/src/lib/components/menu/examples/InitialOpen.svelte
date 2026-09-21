<script lang="ts">
  import { Menu } from '../index'
  const items = ['react', 'solid', 'vue', 'svelte']
  let checked = $state(false)
</script>

<Menu.Root defaultOpen>
