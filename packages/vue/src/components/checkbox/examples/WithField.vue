<script setup lang="ts">
import { Checkbox } from '../index'
import { Field } from '~/components/field'
</script>

<template>
  <Field.Root>
    <Checkbox.Root>
      <Checkbox.Label>Label</Checkbox.Label>
      <Checkbox.Control>
        <Checkbox.Indicator>
          +
        </Checkbox.Indicator>
        <Checkbox.Indicator indeterminate>
          _
        </Checkbox.Indicator>
      </Checkbox.Control>
      <Checkbox.HiddenInput />
    </Checkbox.Root>
    <Field.HelperText>Additional Info</Field.HelperText>
    <Field.ErrorText>Error Info</Field.ErrorText>
  </Field.Root>
</template>
