<script setup lang="ts">
import { Field } from '~/components/field'
import { OtpInput } from '../index'
</script>

<template>
  <Field.Root v-bind="$attrs">
    <OtpInput.Root v-bind="$attrs">
      <OtpInput.Label>Label</OtpInput.Label>
      <OtpInput.Control>
        <OtpInput.Input v-for="id in [0, 1, 2]" :key="id" :index="id" />
      </OtpInput.Control>
      <OtpInput.HiddenInput />
    </OtpInput.Root>
    <Field.HelperText>Additional Info</Field.HelperText>
    <Field.ErrorText>Error Info</Field.ErrorText>
  </Field.Root>
</template>
