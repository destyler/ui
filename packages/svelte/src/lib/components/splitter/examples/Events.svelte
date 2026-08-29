<script lang="ts">
  import { Splitter } from '../index'

  let size = $state([
    { id: 'a', size: 50 },
    { id: 'b', size: 50 },
  ])
</script>

<Splitter.Root
  bind:size
  onSizeChange={(details) => console.log('onSizeChange', details)}
  onSizeChangeEnd={(details) => console.log('onSizeChangeEnd', details)}
>
  <Splitter.Panel id="a">A</Splitter.Panel>
  <Splitter.ResizeTrigger id="a:b" />
  <Splitter.Panel id="b">B</Splitter.Panel>
</Splitter.Root>
