<script setup lang="ts">
import { Steps } from '../index'

const items = [
  { value: 'first', title: 'First', description: 'Contact Info' },
  { value: 'second', title: 'Second', description: 'Date & Time' },
  { value: 'third', title: 'Third', description: 'Select Rooms' },
]
</script>

<template>
  <Steps.Root :count="items.length" :default-step="1">
