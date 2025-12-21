<script setup lang="ts">
import { Toast, Toaster, createToaster } from '../index'

const toaster = createToaster({ placement: 'bottom-end', overlap: true, gap: 24 })

const createToast = () => {
  toaster.create({
    title: 'Title',
    description: 'Description',
    type: 'info',
  })
}
</script>

<template>
  <button @click="createToast">Create Toast</button>
  <Toaster :toaster="toaster" v-slot="toast">
    <Toast.Root>
      <Toast.Title>{{ toast.title }}</Toast.Title>
      <Toast.Description>{{ toast.description }}</Toast.Description>
      <Toast.ActionTrigger>Action</Toast.ActionTrigger>
      <Toast.CloseTrigger>x</Toast.CloseTrigger>
    </Toast.Root>
  </Toaster>
</template>
