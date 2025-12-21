<script setup lang="ts">
import { Separator } from '../index'
</script>

<template>
  <main>
    <div>
      <p>Destyler UI</p>
      <p>Unstyled components for Vue.</p>
    </div>
    <Separator.Root />
    <nav>
      <span>Blog</span>
      <Separator.Root orientation="vertical" />
      <span>Docs</span>
      <Separator.Root orientation="vertical" />
      <span>Source</span>
    </nav>
  </main>
</template>
