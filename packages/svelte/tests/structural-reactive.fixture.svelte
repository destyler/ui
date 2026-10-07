<script lang="ts">
  import Fixture from './structural.fixture.svelte'
  let ratio = $state(2)
  let vertical = $state(false)
  export function update() {
    ratio = 0.5
    vertical = true
  }
</script>
<Fixture {ratio} {vertical} />
