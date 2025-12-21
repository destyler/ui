<script setup lang="ts">
import { ref } from 'vue'
import { Toast, Toaster, createToaster } from '../index'

const toaster = createToaster({ placement: 'bottom-end' })
const toastId = ref<string | undefined>()

const createToast = () => {
  toastId.value = toaster.create({
    title: 'Original Title',
    description: 'Original Description',
    type: 'info',
  })
}

const updateToast = () => {
  if (toastId.value) {
    toaster.update(toastId.value, {
      title: 'Updated Title',
      description: 'Updated Description',
      type: 'success',
    })
  }
}
</script>

<template>
  <button @click="createToast">Create Toast</button>
  <button @click="updateToast">Update Toast</button>
  <Toaster :toaster="toaster" v-slot="toast">
    <Toast.Root>
      <Toast.Title>{{ toast.title }}</Toast.Title>
      <Toast.Description>{{ toast.description }}</Toast.Description>
      <Toast.CloseTrigger>x</Toast.CloseTrigger>
    </Toast.Root>
  </Toaster>
</template>
