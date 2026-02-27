<script setup lang="ts">
import { ref } from 'vue';
import { Avatar, useAvatar } from '../index'

const avatar = useAvatar()

const count = ref(0)
</script>

<template>
  <div class="stack">
    <button @click="count++">Change Source</button>

    <Avatar.RootProvider :value="avatar">
      <Avatar.Fallback>EL</Avatar.Fallback>
      <Avatar.Image :src="`https://cover.sli.dev?u=${count}`"  alt="avatar" />
    </Avatar.RootProvider>
  </div>
</template>
