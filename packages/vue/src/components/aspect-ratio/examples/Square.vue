<script setup lang="ts">
import { AspectRatio } from '../index'
</script>

<template>
  <main style="width: 200px;">
    <AspectRatio.Root :ratio="1">
      <AspectRatio.Content>
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;">
          1:1
        </div>
      </AspectRatio.Content>
    </AspectRatio.Root>
  </main>
</template>
