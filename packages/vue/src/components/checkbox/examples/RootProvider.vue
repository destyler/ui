<script setup lang="ts">
import { Checkbox, useCheckbox } from '~/index'

const checkbox = useCheckbox()
</script>

<template>
  <span>{{ checkbox.checked ? 'Checked' : 'UnChecked' }}</span>

  <Checkbox.RootProvider :value="checkbox">
    <Checkbox.Label>Checkbox</Checkbox.Label>
    <Checkbox.Control>
      <Checkbox.Indicator>
        x
      </Checkbox.Indicator>
    </Checkbox.Control>
    <Checkbox.HiddenInput />
  </Checkbox.RootProvider>
</template>
