<script setup lang="ts">
import { Checkbox } from '../index'
</script>

<template>
  <Checkbox.Root checked="indeterminate">
    <Checkbox.Control data-testid="control">
      <Checkbox.Indicator>
        <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" width="12" height="12">
          <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </Checkbox.Indicator>
      <Checkbox.Indicator indeterminate>
        <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" width="12" height="12">
          <path d="M3 7H11" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
      </Checkbox.Indicator>
    </Checkbox.Control>
    <Checkbox.Label>Checkbox</Checkbox.Label>
    <Checkbox.HiddenInput />
  </Checkbox.Root>
</template>
