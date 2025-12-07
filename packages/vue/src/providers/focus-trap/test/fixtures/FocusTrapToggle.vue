<script setup lang="ts">
import { ref } from 'vue'
import { FocusTrap } from '~/providers/focus-trap'

const visible = ref(true)
</script>

<template>
  <button data-testid="toggle" type="button" @click="visible = !visible">
    Toggle Trap
  </button>
  <FocusTrap v-if="visible" data-testid="toggle-trap">
    <div>
      <button type="button">One</button>
      <button type="button">Two</button>
    </div>
  </FocusTrap>
</template>
