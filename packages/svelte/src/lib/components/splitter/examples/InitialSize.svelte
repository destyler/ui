<script lang="ts">
  import type { SplitterRootProps } from '../index'
  import { Splitter } from '../index'

  let { ...props }: SplitterRootProps = $props()
</script>

<Splitter.Root
  defaultSize={[{ id: "a", size: 30 }, { id: "b", size: 70 }]}
  {...props}
>
  <Splitter.Panel id="a">A</Splitter.Panel>
  <Splitter.ResizeTrigger id="a:b"><div class="bar"></div></Splitter.ResizeTrigger>
  <Splitter.Panel id="b">B</Splitter.Panel>
</Splitter.Root>
