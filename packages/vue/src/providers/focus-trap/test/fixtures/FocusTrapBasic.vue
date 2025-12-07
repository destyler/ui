<script setup lang="ts">
import { FocusTrap } from '~/providers/focus-trap'
</script>

<template>
  <FocusTrap data-testid="trap-root">
    <div>
      <button data-autofocus type="button">Auto focus</button>
      <button type="button">Second</button>
    </div>
  </FocusTrap>
</template>
