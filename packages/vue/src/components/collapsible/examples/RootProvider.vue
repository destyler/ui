<script setup lang="ts">
import { Collapsible, useCollapsible } from '~/index'

const collapsible = useCollapsible()

</script>

<template>
    <span>{{ collapsible.visible ? 'Visible' : 'Hidden' }}</span>

    <Collapsible.RootProvider :value="collapsible">
      <Collapsible.Trigger>Toggle</Collapsible.Trigger>
      <Collapsible.Content>Content</Collapsible.Content>
    </Collapsible.RootProvider>
</template>
