<script setup lang="ts">
import { Label, useLabel } from '../index'

const label = useLabel()
</script>

<template>
  <main>
    <Label.RootProvider :value="label">
      Email Address
    </Label.RootProvider>
  </main>
</template>
