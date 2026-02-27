<script setup lang="ts">
import { Avatar } from '../index'
import { ref } from 'vue'

const status = ref('loading...')
</script>

<template>
  <div class="stack">
    <output>Status: {{ status }}</output>
    <Avatar.Root @status-change="(e) => status = e.status">
      <Avatar.Fallback>EL</Avatar.Fallback>
      <Avatar.Image src="https://github.com/elonehoo.png" alt="avatar" />
    </Avatar.Root>
  </div>
</template>
