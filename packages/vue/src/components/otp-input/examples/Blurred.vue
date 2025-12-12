<script setup lang="ts">
import { OtpInput } from '../index'
</script>

<template>
  <OtpInput.Root blurOnComplete>
    <OtpInput.Label>Label</OtpInput.Label>
    <OtpInput.Control>
      <OtpInput.Input v-for="id in [0, 1, 2]" :key="id" :index="id" />
    </OtpInput.Control>
    <OtpInput.HiddenInput />
  </OtpInput.Root>
</template>
