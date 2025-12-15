<script setup lang="ts">
import { Signature } from '../index'
import { ref } from 'vue'

const imageUrl = ref<string | null>(null)

const handleDrawEnd = async (details: Signature.DrawEndDetails) => {
  imageUrl.value = await details.getDataUrl('image/png')
}
</script>

<template>
  <Signature.Root @draw-end="handleDrawEnd">
    <Signature.Label>Sign below</Signature.Label>
    <Signature.Control>
      <Signature.Segment fill="orange" />
      <Signature.ClearTrigger>Clear</Signature.ClearTrigger>
      <Signature.Guide />
    </Signature.Control>
  </Signature.Root>
  <img v-if="imageUrl" :src="imageUrl" alt="Signature preview" />
</template>
