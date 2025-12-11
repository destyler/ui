<script setup lang="ts">
import { Field } from '~/index'
</script>

<template>
  <Field.Root data-testid="root" disabled>
    <Field.Label>Label</Field.Label>
    <Field.Input />
    <Field.HelperText>Some additional Info</Field.HelperText>
    <Field.ErrorText>Error Info</Field.ErrorText>
  </Field.Root>
</template>
