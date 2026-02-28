<script setup lang="ts">
import { AspectRatio } from '../index'
</script>

<template>
  <main>
    <AspectRatio.Root :ratio="1">
      <AspectRatio.Content>
        <div class="demo-content">
          1:1
        </div>
      </AspectRatio.Content>
    </AspectRatio.Root>
  </main>
</template>
