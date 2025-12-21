<script setup lang="ts">
import { ref } from 'vue'
import { Toast, Toaster, createToaster } from '../index'

const toaster = createToaster({ placement: 'bottom-end' })
const actionTriggered = ref(false)

const createToast = () => {
  actionTriggered.value = false
  toaster.create({
    title: 'File deleted',
    description: 'The file has been deleted',
    type: 'info',
  })
}

const handleAction = () => {
  actionTriggered.value = true
}
</script>

<template>
  <button @click="createToast">Create Toast</button>
  <div v-if="actionTriggered">Action triggered!</div>
  <Toaster :toaster="toaster" v-slot="toast">
    <Toast.Root>
      <Toast.Title>{{ toast.title }}</Toast.Title>
      <Toast.Description>{{ toast.description }}</Toast.Description>
      <Toast.ActionTrigger @click="handleAction">Undo</Toast.ActionTrigger>
      <Toast.CloseTrigger>x</Toast.CloseTrigger>
    </Toast.Root>
  </Toaster>
</template>
