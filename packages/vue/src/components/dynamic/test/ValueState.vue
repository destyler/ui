<script setup lang="ts">
import type { UseDynamicProps } from '../composables/use-dynamic'
import { Dynamic } from '../index'

const props = defineProps<UseDynamicProps>()
</script>

<template>
  <Dynamic.Root v-bind="props">
    <Dynamic.Context v-slot="api">
      <output data-testid="value">{{ JSON.stringify(api.value) }}</output>
      <button type="button" @click="api.setValue(['Edited'])">Set value</button>
    </Dynamic.Context>
    <Dynamic.Input aria-label="Tag" />
    <Dynamic.HiddenInput />
  </Dynamic.Root>
</template>
