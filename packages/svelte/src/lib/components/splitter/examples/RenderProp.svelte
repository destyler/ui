<script lang="ts">
  import { Splitter } from '../index'

  let size = $state([
    { id: 'a', size: 50 },
    { id: 'b', size: 50 },
  ])
</script>

<Splitter.Root bind:size>
  <Splitter.Context>
    {#snippet render(splitter)}
      <Splitter.Panel id="a">
        <button onclick={() => splitter().setSize('a', 10)}>Set A to 10%</button>
      </Splitter.Panel>
      <Splitter.ResizeTrigger id="a:b" />
      <Splitter.Panel id="b">
        <button onclick={() => splitter().setSize('b', 10)}>Set B to 10%</button>
      </Splitter.Panel>
    {/snippet}
  </Splitter.Context>
</Splitter.Root>
