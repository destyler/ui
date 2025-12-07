<script setup lang="ts">
import { ui } from '~/factory';
</script>

<template>
  <ui.div data-testid="parent" as-child>
    <ui.span :as-child="false">
      <ui.span>Destyler UI</ui.span>
    </ui.span>
  </ui.div>
</template>
