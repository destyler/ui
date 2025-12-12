<script setup lang="ts">
import { OtpInput, useOtpInput } from '../index'

const pinInput = useOtpInput()
</script>

<template>
  <button @click="pinInput.focus()">Focus</button>

  <OtpInput.RootProvider :value="pinInput">
    <OtpInput.Label>Label</OtpInput.Label>
    <OtpInput.Control>
      <OtpInput.Input v-for="id in [0, 1, 2]" :key="id" :index="id" />
    </OtpInput.Control>
    <OtpInput.HiddenInput />
  </OtpInput.RootProvider>
</template>
