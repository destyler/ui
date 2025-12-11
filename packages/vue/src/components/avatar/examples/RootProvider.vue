<script setup lang="ts">
import { Avatar, useAvatar } from '~/index'

const avatar = useAvatar()
</script>

<template>
  <button @click="avatar.setSrc('https://new-source.com')">Change Source</button>

  <Avatar.RootProvider :value="avatar">
    <Avatar.Fallback>EL</Avatar.Fallback>
    <Avatar.Image src="https://github.com/elonehoo.png" alt="avatar" />
  </Avatar.RootProvider>
</template>
