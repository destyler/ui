<script setup lang="ts">
import { Edit, useEdit } from '../index'

const editable = useEdit({ placeholder: 'Placeholder' })
</script>

<template>
  <button @click="editable.edit()">Edit</button>

  <Edit.RootProvider :value="editable">
    <Edit.Label>Label</Edit.Label>
    <Edit.Area>
      <Edit.Input />
      <Edit.Preview />
    </Edit.Area>
  </Edit.RootProvider>
</template>
