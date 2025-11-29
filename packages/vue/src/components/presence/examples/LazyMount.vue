<script setup lang="ts">
import { Presence } from '../index'
import { ref } from 'vue'

const isPresent = ref(false)
</script>

<template>
  <div>
    <button @click="isPresent = !isPresent">Toggle</button>
    <Presence :present="isPresent" lazyMount>
      <div data-testid="box">Hidden and Hidden</div>
    </Presence>
  </div>
</template>
