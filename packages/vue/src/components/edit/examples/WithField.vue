<script setup lang="ts">
import { Edit } from '../index'
import { Field } from '~/components/field'
</script>

<template>
  <Field.Root>
    <Edit.Root placeholder="Placeholder" activationMode="dblclick">
      <Edit.Label>Label</Edit.Label>
      <Edit.Area>
        <Edit.Input />
        <Edit.Preview />
      </Edit.Area>
    </Edit.Root>
    <Field.HelperText>Additional Info</Field.HelperText>
    <Field.ErrorText>Error Info</Field.ErrorText>
  </Field.Root>
</template>
