<script setup lang="ts">
import { Field } from '../index'
</script>

<template>
  <Field.Root required>
    <Field.Label>
      Username
      <Field.RequiredIndicator />
    </Field.Label>
    <Field.Input placeholder="Enter your username" />
  </Field.Root>
</template>
