<script setup lang="ts">
import { Field } from '../index'

const model = defineModel()
</script>

<template>
  <Field.Root invalid required>
    <Field.Label>
      Label
      <Field.RequiredIndicator />
    </Field.Label>
    <Field.Input v-model="model" />
    <Field.Select>
      <option value="1">
        Option 1
      </option>
    </Field.Select>
    <Field.Textarea />
    <Field.HelperText>Some additional Info</Field.HelperText>
    <Field.ErrorText>Error Info</Field.ErrorText>
  </Field.Root>
</template>
