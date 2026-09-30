<script setup lang="ts">
import { Splitter, useSplitter } from '../index'

const defaultSize = [
  { id: 'a', size: 50 },
  { id: 'b', size: 50 },
]

const splitter = useSplitter({ defaultSize })

function maximizeA() {
  splitter.value.setToMinSize('b')
  splitter.value.setToMaxSize('a')
}
</script>

<template>
  <button @click="maximizeA">Maximize a</button>

  <Splitter.RootProvider :value="splitter">
    <Splitter.Panel id="a">A</Splitter.Panel>
    <Splitter.ResizeTrigger id="a:b" />
    <Splitter.Panel id="b">B</Splitter.Panel>
  </Splitter.RootProvider>
</template>
