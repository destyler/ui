<script setup lang="ts">
import { OtpInput } from '../index'
import { ref } from 'vue'

const value = ref(['1', '2', '3'])
</script>

<template>
  <output>{{ value.join('') }}</output>
  <OtpInput.Root v-model="value">
    <OtpInput.Label>Label</OtpInput.Label>
    <OtpInput.Control>
      <OtpInput.Input v-for="id in [0, 1, 2]" :key="id" :index="id" />
    </OtpInput.Control>
    <OtpInput.HiddenInput />
  </OtpInput.Root>
</template>
