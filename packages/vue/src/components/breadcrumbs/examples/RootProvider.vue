<script setup lang="ts">
import { reactive } from 'vue'
import { Breadcrumbs, useBreadcrumbs } from '../index'

const props = reactive({
  items: [
    { id: '1', label: 'Home', href: '/' },
    { id: '2', label: 'Products', href: '/products' },
    { id: '3', label: 'Electronics' },
  ],
})

const breadcrumbs = useBreadcrumbs(props)

function addItem() {
  const newItem = { id: String(props.items.length + 1), label: `Item ${props.items.length + 1}` }
  props.items = [...props.items, newItem]
}
</script>

<template>
  <main>
    <button @click="addItem">Add Item</button>
    <Breadcrumbs.RootProvider :value="breadcrumbs">
      <Breadcrumbs.List>
        <Breadcrumbs.Context v-slot="api">
          <Breadcrumbs.Item v-for="(item, index) in api.items" :key="item.id" :item="item">
            <Breadcrumbs.Link :item="item">{{ item.label }}</Breadcrumbs.Link>
            <Breadcrumbs.Separator v-if="index < api.items.length - 1">/</Breadcrumbs.Separator>
          </Breadcrumbs.Item>
        </Breadcrumbs.Context>
      </Breadcrumbs.List>
    </Breadcrumbs.RootProvider>
  </main>
</template>
