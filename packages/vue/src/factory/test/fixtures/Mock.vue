<script setup lang="ts">
import {ui} from '~/factory'

const emits = defineEmits([
  'parent', 
  'child'
])

</script>

<template>
  <ui.div data-testid="parent" @click="emits('parent')" as-child>
    <ui.span data-testid="child" @click="emits('child')" >
      Destyler UI
    </ui.span>
  </ui.div>
</template>
