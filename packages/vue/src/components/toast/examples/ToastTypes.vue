<script setup lang="ts">
import { Toast, Toaster, createToaster } from '../index'

const toaster = createToaster({ placement: 'bottom-end' })

const createSuccess = () => {
  toaster.success({
    title: 'Success Toast',
    description: 'Operation completed successfully',
  })
}

const createError = () => {
  toaster.error({
    title: 'Error Toast',
    description: 'Something went wrong',
  })
}

const createLoading = () => {
  toaster.loading({
    title: 'Loading Toast',
    description: 'Please wait...',
  })
}

const createInfo = () => {
  toaster.create({
    title: 'Info Toast',
    description: 'Here is some information',
    type: 'info',
  })
}
</script>

<template>
  <button @click="createSuccess">Success</button>
  <button @click="createError">Error</button>
  <button @click="createLoading">Loading</button>
  <button @click="createInfo">Info</button>
  <Toaster :toaster="toaster" v-slot="toast">
    <Toast.Root>
      <Toast.Title>{{ toast.title }}</Toast.Title>
      <Toast.Description>{{ toast.description }}</Toast.Description>
      <Toast.CloseTrigger>x</Toast.CloseTrigger>
    </Toast.Root>
  </Toaster>
</template>
