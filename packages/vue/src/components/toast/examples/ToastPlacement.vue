<script setup lang="ts">
import { Toast, Toaster, createToaster } from '../index'

const toasterTopStart = createToaster({ placement: 'top-start' })
const toasterBottomEnd = createToaster({ placement: 'bottom-end' })

const createTopStart = () => {
  toasterTopStart.create({
    title: 'Top Start Toast',
    description: 'This toast appears at top-start',
    type: 'info',
  })
}

const createBottomEnd = () => {
  toasterBottomEnd.create({
    title: 'Bottom End Toast',
    description: 'This toast appears at bottom-end',
    type: 'info',
  })
}
</script>

<template>
  <button @click="createTopStart">Top Start</button>
  <button @click="createBottomEnd">Bottom End</button>
  <Toaster :toaster="toasterTopStart" v-slot="toast">
    <Toast.Root>
      <Toast.Title>{{ toast.title }}</Toast.Title>
      <Toast.Description>{{ toast.description }}</Toast.Description>
      <Toast.CloseTrigger>x</Toast.CloseTrigger>
    </Toast.Root>
  </Toaster>
  <Toaster :toaster="toasterBottomEnd" v-slot="toast">
    <Toast.Root>
      <Toast.Title>{{ toast.title }}</Toast.Title>
      <Toast.Description>{{ toast.description }}</Toast.Description>
      <Toast.CloseTrigger>x</Toast.CloseTrigger>
    </Toast.Root>
  </Toaster>
</template>
