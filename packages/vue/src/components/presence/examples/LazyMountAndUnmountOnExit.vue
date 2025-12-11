<script setup lang="ts">
import { Presence } from '~/index'
import { ref } from 'vue'

const isPresent = ref(false)
</script>

<template>
  <div>
    <button @click="isPresent = !isPresent">Toggle</button>
    <Presence :present="isPresent" lazyMount unmountOnExit>
      <div data-testid="box">Lazy Mount and Unmounted on Exit</div>
    </Presence>
  </div>
</template>
