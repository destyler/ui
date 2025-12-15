<script setup lang="ts">
import { Field } from '~/components/field'
import { Signature } from '../index'
import { ref } from 'vue'

interface Props {
  disabled?: boolean
  invalid?: boolean
  readOnly?: boolean
  required?: boolean
}

defineProps<Props>()

const imageUrl = ref('')

const handleDrawEnd = async (details: Signature.DrawEndDetails) => {
  imageUrl.value = await details.getDataUrl('image/png')
}
</script>

<template>
  <Field.Root :disabled="disabled" :invalid="invalid" :read-only="readOnly" :required="required">
    <Signature.Root @draw-end="handleDrawEnd">
      <Signature.Label>Label</Signature.Label>
      <Signature.Control>
        <Signature.Segment />
        <Signature.ClearTrigger>Clear</Signature.ClearTrigger>
        <Signature.Guide />
      </Signature.Control>
      <Signature.HiddenInput :value="imageUrl" />
    </Signature.Root>
    <Field.HelperText>Additional Info</Field.HelperText>
    <Field.ErrorText>Error Info</Field.ErrorText>
  </Field.Root>
</template>
