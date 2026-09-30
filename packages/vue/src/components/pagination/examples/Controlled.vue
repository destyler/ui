<script setup lang="ts">
import { Pagination } from '../index'
import { ref } from 'vue'

const page = ref(1)
</script>

<template>
  <output>Page {{ page }}</output>
  <Pagination.Root :count="100" :page-size="10" :sibling-count="2" :page="page" @page-change="details => (page = details.page)">
    <Pagination.PrevTrigger>
      Previous
      <span className="visually-hidden">Page</span>
    </Pagination.PrevTrigger>
    <Pagination.Context v-slot="pagination">
      <template v-for="(p, index) in pagination.pages">
        <Pagination.Item v-if="p.type === 'page'" :key="index" :value="p.value" :type="p.type">
          {{ p.value }}
        </Pagination.Item>
        <Pagination.Ellipsis v-else :key="'e' + index" :index="index">&#8230;</Pagination.Ellipsis>
      </template>
    </Pagination.Context>
    <Pagination.NextTrigger>
      Next
      <span className="visually-hidden">Page</span>
    </Pagination.NextTrigger>
  </Pagination.Root>
</template>
