<script lang="ts" setup>
import { FieldErrorText, FieldRoot } from '../index'
import { computed, ref } from 'vue'

const errorMessage = ref('')
const invalid = computed(() => !!errorMessage.value)
</script>

<template>
  <input v-model="errorMessage" />
  <FieldRoot :invalid="invalid">
    IsInvalid? {{ invalid }}
    <FieldErrorText style="color: red">{{ errorMessage }}</FieldErrorText>
  </FieldRoot>
</template>
