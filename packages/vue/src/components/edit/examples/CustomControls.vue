<script setup lang="ts">
import { Edit } from '../index'
import { ref } from 'vue'
const value = ref('Chakra')
</script>

<template>
  <Edit.Root placeholder="enter a value" v-model="value">
    <Edit.Label>Label</Edit.Label>
    <Edit.Area>
      <Edit.Input />
      <Edit.Preview />
    </Edit.Area>
    <Edit.Context v-slot="{ editing }">
      <Edit.Control v-if="editing">
        <Edit.SubmitTrigger>Save</Edit.SubmitTrigger>
        <Edit.CancelTrigger>Cancel</Edit.CancelTrigger>
      </Edit.Control>
      <Edit.Control v-else>
        <Edit.EditTrigger>Edit</Edit.EditTrigger>
      </Edit.Control>
    </Edit.Context>
  </Edit.Root>
</template>
