<script lang="ts">
import { contractItems } from '../../../utils/core-033-contracts'
import type { ContractOptions } from '../../../utils/core-033-contracts'
import { Breadcrumbs } from '$lib/components/breadcrumbs'
import { ScrollArea } from '$lib/components/scroll-area'
import { Splitter } from '$lib/components/splitter'
import { LocaleProvider } from '$lib/providers/locale'
let { orientation, locale }: ContractOptions = $props()
</script>

<LocaleProvider {locale}>
  {#each contractItems as item (item.id)}
    <Breadcrumbs.Root items={[item]}>
      <Breadcrumbs.List><Breadcrumbs.Item {item}><Breadcrumbs.Link {item}>{item.label}</Breadcrumbs.Link></Breadcrumbs.Item></Breadcrumbs.List>
    </Breadcrumbs.Root>
  {/each}
  <button type="button" data-testid="after-breadcrumbs">After breadcrumbs</button>
  <ScrollArea.Root type="always" style="width: 120px; height: 120px;">
    <ScrollArea.Viewport style="width: 120px; height: 120px;">
      <ScrollArea.Content style="height: 600px; width: 100px;">Scrollable content</ScrollArea.Content>
    </ScrollArea.Viewport>
    <ScrollArea.Scrollbar orientation="vertical" style="width: 12px;"><ScrollArea.Thumb /></ScrollArea.Scrollbar>
  </ScrollArea.Root>
  <Splitter.Root {orientation} defaultSize={[{ id: 'a', size: 50 }, { id: 'b', size: 50 }]} style="width: 400px; height: 400px;">
    <Splitter.Panel id="a">A</Splitter.Panel>
    <Splitter.ResizeTrigger id="a:b">Resize</Splitter.ResizeTrigger>
    <Splitter.Panel id="b">B</Splitter.Panel>
  </Splitter.Root>
</LocaleProvider>
