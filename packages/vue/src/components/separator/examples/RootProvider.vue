<script setup lang="ts">
import { Separator, useSeparator } from '../index'

const separator = useSeparator()
</script>

<template>
  <main>
    <div>
      <p>Destyler UI</p>
      <p>Unstyled components for Vue.</p>
    </div>
    <Separator.RootProvider :value="separator" />
  </main>
</template>
