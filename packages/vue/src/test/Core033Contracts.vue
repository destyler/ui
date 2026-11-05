<script setup lang="ts">
import { contractItems } from '../../../../utils/core-033-contracts'
import type { ContractOptions } from '../../../../utils/core-033-contracts'
import { Breadcrumbs } from '../components/breadcrumbs'
import { ScrollArea } from '../components/scroll-area'
import { Splitter } from '../components/splitter'
import { LocaleProvider } from '../providers/locale'
defineProps<ContractOptions>()
</script>

<template>
  <LocaleProvider :locale="locale">
    <Breadcrumbs.Root v-for="item in contractItems" :key="item.id" :items="[item]">
      <Breadcrumbs.List><Breadcrumbs.Item :item="item"><Breadcrumbs.Link :item="item">{{ item.label }}</Breadcrumbs.Link></Breadcrumbs.Item></Breadcrumbs.List>
    </Breadcrumbs.Root>
  <button type="button" data-testid="after-breadcrumbs">After breadcrumbs</button>
  <ScrollArea.Root type="always" style="width: 120px; height: 120px;">
    <ScrollArea.Viewport style="width: 120px; height: 120px;">
      <ScrollArea.Content style="height: 600px; width: 100px;">Scrollable content</ScrollArea.Content>
    </ScrollArea.Viewport>
    <ScrollArea.Scrollbar orientation="vertical" style="width: 12px;"><ScrollArea.Thumb /></ScrollArea.Scrollbar>
  </ScrollArea.Root>
  <Splitter.Root :orientation="orientation" :default-size="[{ id: 'a', size: 50 }, { id: 'b', size: 50 }]" style="width: 400px; height: 400px;">
    <Splitter.Panel id="a">A</Splitter.Panel>
    <Splitter.ResizeTrigger id="a:b">Resize</Splitter.ResizeTrigger>
    <Splitter.Panel id="b">B</Splitter.Panel>
  </Splitter.Root>
</LocaleProvider>
</template>
