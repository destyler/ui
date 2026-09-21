<script setup lang="ts">
import { Splitter } from '../index'
</script>
<template>
  <Splitter.Root :default-size="[{ id: 'a', size: 30 }, { id: 'b', size: 70 }]">
    <Splitter.Panel id="a">A</Splitter.Panel>
    <Splitter.ResizeTrigger id="a:b">
      <div className="bar"></div>
    </Splitter.ResizeTrigger>
    <Splitter.Panel id="b">B</Splitter.Panel>
  </Splitter.Root>
</template>
