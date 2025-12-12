<script setup lang="ts">
import { Checkbox } from '../index'
</script>

<template>
  <Checkbox.Root>
    <Checkbox.Control>
      <Checkbox.Indicator>
        x
      </Checkbox.Indicator>
    </Checkbox.Control>
    <Checkbox.Context v-slot="checkbox">
      <Checkbox.Label>Checkbox {{ checkbox.checked.toString() }}</Checkbox.Label>
    </Checkbox.Context>
    <Checkbox.HiddenInput />
  </Checkbox.Root>
</template>
