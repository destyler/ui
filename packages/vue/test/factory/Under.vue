<script setup lang="ts">
import {ui} from '~/factory'
</script>

<template>
  <ui.div id="parent" data-part="parent" data-testid="parent" class="parent" :style="{background: 'red'}" as-child>
    <ui.span id="child" data-part="child" data-testid="child" class="child" :style="{color: 'blue'}">
      Destyler UI
    </ui.span>
  </ui.div>
</template>
