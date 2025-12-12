<script setup lang="ts">
import { Avatar } from '../index'
</script>

<template>
  <Avatar.Root>
    <Avatar.Context v-slot="avatar">
      <Avatar.Fallback>
        {{ avatar.loaded ? 'EL' : 'Loading' }}
      </Avatar.Fallback>
    </Avatar.Context>
    <Avatar.Image src="https://github.com/elonehoo.png" alt="avatar" />
  </Avatar.Root>
</template>
