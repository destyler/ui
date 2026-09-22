<script setup lang="ts">
import { Splitter } from '../index'
</script>

<template>
  <Splitter.Root :default-size="[{ id: 'a', size: 50 }, { id: 'b', size: 50 }]">
    <Splitter.Context v-slot="splitter">
      <Splitter.Panel id="a">
        <button @click="splitter.setSize('a', 10)">Set A to 10%</button>
      </Splitter.Panel>
      <Splitter.ResizeTrigger id="a:b" />
      <Splitter.Panel id="b">
        <button @click="splitter.setSize('b', 10)">Set B to 10%</button>
      </Splitter.Panel>
    </Splitter.Context>
  </Splitter.Root>
</template>
