<script setup lang="ts">
import { Checkbox } from '../index'
import { ref } from 'vue'

const checked = ref<Checkbox.CheckedState>(true)
</script>

<template>
  {{ checked }}
  <button @click="() => (checked = true)">set checked</button>
  <Checkbox.Root v-model:checked="checked">
    <Checkbox.Label>Checkbox</Checkbox.Label>
    <Checkbox.Control>
      <Checkbox.Indicator>
        x
      </Checkbox.Indicator>
    </Checkbox.Control>
    <Checkbox.HiddenInput />
  </Checkbox.Root>
</template>
