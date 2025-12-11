<script setup lang="ts">
import { Avatar } from '~/index'
</script>

<template>
  <Avatar.Root @status-change="(e) => console.log(e.status)">
    <Avatar.Fallback>EL</Avatar.Fallback>
    <Avatar.Image src="https://github.com/elonehoo.png" alt="avatar" />
  </Avatar.Root>
</template>
