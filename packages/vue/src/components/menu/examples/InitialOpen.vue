<script setup lang="ts">
import { ref } from 'vue'
import { Menu } from '../index'

const items = ref(['react', 'solid', 'vue', 'svelte'])
const checked = ref(false)
</script>

<template>
  <Menu.Root default-open>
