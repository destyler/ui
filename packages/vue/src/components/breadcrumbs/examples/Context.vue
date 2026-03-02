<script setup lang="ts">
import { Breadcrumbs } from '../index'

const items = [
  { id: '1', label: 'Dashboard', href: '/dashboard' },
  { id: '2', label: 'Settings', href: '/settings' },
  { id: '3', label: 'Profile' },
]
</script>

<template>
  <main>
    <Breadcrumbs.Root :items="items">
      <Breadcrumbs.List>
        <Breadcrumbs.Context v-slot="breadcrumbs">
          <output>
            <p>Hovered: {{ breadcrumbs.hoveredId || 'none' }}</p>
            <p>Focused: {{ breadcrumbs.focusedId || 'none' }}</p>
          </output>
          <div>
            <template v-for="(item, index) in breadcrumbs.items" :key="item.id">
              <Breadcrumbs.Item :item="item">
                <Breadcrumbs.Link :item="item">
                  <span v-if="index === 0">🏠</span>
                  {{ item.label }}
                </Breadcrumbs.Link>
                <Breadcrumbs.Separator v-if="item.href">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Breadcrumbs.Separator>
              </Breadcrumbs.Item>
            </template>
          </div>
        </Breadcrumbs.Context>
      </Breadcrumbs.List>
    </Breadcrumbs.Root>
  </main>
</template>
