<script lang="ts">
  import type { SplitterRootProps } from '../index'
  import { Splitter } from '../index'

  let { size = $bindable([
    { id: 'a', size: 50 },
    { id: 'b', size: 50 },
  ]), ...props }: SplitterRootProps = $props()
</script>

<Splitter.Root bind:size {...props}>
  <Splitter.Panel id="a">A</Splitter.Panel>
  <Splitter.ResizeTrigger id="a:b"><div class="bar"></div></Splitter.ResizeTrigger>
  <Splitter.Panel id="b">B</Splitter.Panel>
</Splitter.Root>
