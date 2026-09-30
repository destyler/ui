<script setup lang="ts">
import { Splitter } from '../index'
</script>

<template>
  <Splitter.Root
    :default-size="[{ id: 'a', size: 50 }, { id: 'b', size: 50 }]"
    @size-change="(details) => console.log('onSizeChange', details)"
    @size-change-end="(details) => console.log('onSizeChangeEnd', details)"
  >
    <Splitter.Panel id="a">A</Splitter.Panel>
    <Splitter.ResizeTrigger id="a:b" />
    <Splitter.Panel id="b">B</Splitter.Panel>
  </Splitter.Root>
</template>
