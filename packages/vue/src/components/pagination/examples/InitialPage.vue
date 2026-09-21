<script setup lang="ts">
import { Pagination } from '../index'
</script>
<template>
  <Pagination.Root :count="100" :page-size="10" :sibling-count="2" :default-page="5">
