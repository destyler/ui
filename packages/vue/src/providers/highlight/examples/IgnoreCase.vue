<script setup lang="ts">
import { Highlight } from '../index'
</script>

<template>
  <Highlight text="The quick brown Fox jumps over the lazy Dog." :query="['fox', 'dog']" :ignoreCase="true" />
</template>
