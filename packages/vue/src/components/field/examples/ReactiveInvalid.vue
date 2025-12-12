<script lang="ts" setup>
import { Field } from '../index'
import { computed, ref } from 'vue'

const errorMessage = ref('')
const invalid = computed(() => !!errorMessage.value)
</script>

<template>
  <input v-model="errorMessage" />
  <Field.Root :invalid="invalid">
    IsInvalid? {{ invalid }}
    <Field.ErrorText style="color: red">{{ errorMessage }}</Field.ErrorText>
  </Field.Root>
</template>
