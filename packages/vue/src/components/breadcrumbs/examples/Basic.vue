<script setup lang="ts">
import { Breadcrumbs } from '../index'

const items = [
  { id: '1', label: 'Home', href: '/' },
  { id: '2', label: 'Products', href: '/products' },
  { id: '3', label: 'Electronics', href: '/products/electronics' },
  { id: '4', label: 'Smartphones' },
]
</script>

<template>
  <main>
    <Breadcrumbs.Root :items="items">
      <Breadcrumbs.List>
        <Breadcrumbs.Context v-slot="breadcrumbs">
          <Breadcrumbs.Item v-for="item in breadcrumbs.items" :key="item.id" :item="item">
            <Breadcrumbs.Link :item="item">{{ item.label }}</Breadcrumbs.Link>
            <Breadcrumbs.Separator v-if="item.href">/</Breadcrumbs.Separator>
          </Breadcrumbs.Item>
        </Breadcrumbs.Context>
      </Breadcrumbs.List>
    </Breadcrumbs.Root>
  </main>
</template>
