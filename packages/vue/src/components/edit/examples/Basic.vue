<script setup lang="ts">
import { Edit } from '../index'
</script>

<template>
  <Edit.Root placeholder="Placeholder">
    <Edit.Label>Label</Edit.Label>
    <Edit.Area>
      <Edit.Input />
      <Edit.Preview />
    </Edit.Area>
    <Edit.Control>
      <Edit.SubmitTrigger>Save</Edit.SubmitTrigger>
      <Edit.CancelTrigger>Cancel</Edit.CancelTrigger>
      <Edit.EditTrigger>Edit</Edit.EditTrigger>
    </Edit.Control>
  </Edit.Root>
</template>
