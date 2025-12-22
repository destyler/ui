<script setup lang="ts">
import { ScrollArea, useScrollArea } from '../index'

const scrollArea = useScrollArea()

const scrollToTop = () => {
  scrollArea.value.scrollTo({ top: 0 })
}

const scrollToBottom = () => {
  scrollArea.value.scrollTo({ top: 9999 })
}

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`,
)
</script>

<template>
  <main style="display: flex; flex-direction: column; gap: 16px;">
    <div style="display: flex; gap: 8px;">
      <button @click="scrollToTop" style="padding: 8px 16px; cursor: pointer;">
        Scroll to Top
      </button>
      <button @click="scrollToBottom" style="padding: 8px 16px; cursor: pointer;">
        Scroll to Bottom
      </button>
    </div>

    <ScrollArea.RootProvider :value="scrollArea" style="width: 200px; height: 300px; border: 1px solid #ccc;">
      <ScrollArea.Viewport>
        <ScrollArea.Content>
          <div style="padding: 16px;">
            <h3 style="margin: 0 0 12px 0;">Tags (Provider)</h3>
            <div v-for="tag in tags" :key="tag" style="padding: 8px 0; border-bottom: 1px solid #eee;">
              {{ tag }}
            </div>
          </div>
        </ScrollArea.Content>
      </ScrollArea.Viewport>

      <ScrollArea.Scrollbar orientation="vertical" style="width: 8px; background: #f0f0f0;">
        <ScrollArea.Thumb orientation="vertical" style="background: #888; border-radius: 4px;" />
      </ScrollArea.Scrollbar>

      <ScrollArea.Scrollbar orientation="horizontal" style="height: 8px; background: #f0f0f0;">
        <ScrollArea.Thumb orientation="horizontal" style="background: #888; border-radius: 4px;" />
      </ScrollArea.Scrollbar>

      <ScrollArea.Corner style="background: #f0f0f0;" />
    </ScrollArea.RootProvider>
  </main>
</template>
