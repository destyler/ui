<script setup lang="ts">
import { Checkbox } from '~/index'
</script>

<template>
  <Checkbox.Root checked="indeterminate">
    <Checkbox.Label>Checkbox</Checkbox.Label>
    <Checkbox.Control data-testid="control">
      <Checkbox.Indicator>
        +
      </Checkbox.Indicator>
      <Checkbox.Indicator indeterminate>
        _
      </Checkbox.Indicator>
    </Checkbox.Control>
    <Checkbox.HiddenInput />
  </Checkbox.Root>
</template>
