<script setup lang="ts">
import { Checkbox } from '../index'
import { ref } from 'vue'

const disabled = ref(false)
</script>

<template>
  <Checkbox.Root :defaultChecked="true" :disabled="disabled">
    <Checkbox.Label>Standalone checkbox</Checkbox.Label>
    <Checkbox.Control />
    <Checkbox.HiddenInput />
  </Checkbox.Root>
  <button type="button" @click="disabled = true">
    disable
  </button>
</template>
