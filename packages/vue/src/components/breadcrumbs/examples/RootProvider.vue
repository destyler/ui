<script setup lang="ts">
import { ref } from 'vue'
import { Breadcrumbs, useBreadcrumbs } from '../index'

const items = ref([
  { id: '1', label: 'Home', href: '/' },
  { id: '2', label: 'Products', href: '/products' },
  { id: '3', label: 'Electronics' },
])

const breadcrumbs = useBreadcrumbs({ items: items.value })

function addItem() {
  const newItem = { id: String(items.value.length + 1), label: `Item ${items.value.length + 1}` }
  items.value = [...items.value, newItem]
}
</script>

<template>
  <main>
    <button @click="addItem">Add Item</button>
    <Breadcrumbs.RootProvider :value="breadcrumbs">
      <Breadcrumbs.List>
        <Breadcrumbs.Context v-slot="api">
          <Breadcrumbs.Item v-for="item in api.items" :key="item.id" :item="item">
            <Breadcrumbs.Link :item="item">{{ item.label }}</Breadcrumbs.Link>
            <Breadcrumbs.Separator v-if="item.href">/</Breadcrumbs.Separator>
          </Breadcrumbs.Item>
        </Breadcrumbs.Context>
      </Breadcrumbs.List>
    </Breadcrumbs.RootProvider>
  </main>
</template>
