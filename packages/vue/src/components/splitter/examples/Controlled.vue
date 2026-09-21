<script setup lang="ts">
import { Splitter } from '../index'
import { ref } from 'vue'

const size = ref([
  { id: 'a', size: 50 },
  { id: 'b', size: 50 },
])
</script>

<template>
  <output>{{ size.map(p => p.size).join(' / ') }}</output>
  <Splitter.Root :size="size" @size-change="details => (size = details.size)">
    <Splitter.Panel id="a">A</Splitter.Panel>
    <Splitter.ResizeTrigger id="a:b">
      <div className="bar"></div>
    </Splitter.ResizeTrigger>
    <Splitter.Panel id="b">B</Splitter.Panel>
  </Splitter.Root>
</template>
