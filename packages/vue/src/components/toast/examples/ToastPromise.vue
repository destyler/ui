<script setup lang="ts">
import { Toast, Toaster, createToaster } from '../index'

const toaster = createToaster({ placement: 'bottom-end' })

const createSuccessPromise = () => {
  toaster.promise(
    new Promise((resolve) => setTimeout(() => resolve('done'), 1000)),
    {
      loading: { title: 'Loading...', description: 'Please wait' },
      success: { title: 'Success!', description: 'Operation completed' },
      error: { title: 'Failed!', description: 'Something went wrong' },
    },
  )
}

const createErrorPromise = () => {
  toaster.promise(
    new Promise((_, reject) => setTimeout(() => reject(new Error('error')), 1000)),
    {
      loading: { title: 'Loading...', description: 'Please wait' },
      success: { title: 'Success!', description: 'Operation completed' },
      error: { title: 'Failed!', description: 'Something went wrong' },
    },
  )
}
</script>

<template>
  <button @click="createSuccessPromise">Promise Success</button>
  <button @click="createErrorPromise">Promise Error</button>
  <Toaster :toaster="toaster" v-slot="toast">
    <Toast.Root>
      <Toast.Title>{{ toast.title }}</Toast.Title>
      <Toast.Description>{{ toast.description }}</Toast.Description>
      <Toast.CloseTrigger>x</Toast.CloseTrigger>
    </Toast.Root>
  </Toaster>
</template>
