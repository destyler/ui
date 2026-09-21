<script lang="ts">
  import { Splitter } from '../index'

  let size = $state([
    { id: 'a', size: 50 },
    { id: 'b', size: 50 },
  ])
</script>

<output>{size.map(p => p.size).join(' / ')}</output>
<Splitter.Root bind:size>
  <Splitter.Panel id="a">A</Splitter.Panel>
  <Splitter.ResizeTrigger id="a:b"><div class="bar"></div></Splitter.ResizeTrigger>
  <Splitter.Panel id="b">B</Splitter.Panel>
</Splitter.Root>
