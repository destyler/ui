<script lang="ts">
import type { Options } from '@destyler/toast'
import type { SlotsType, VNodeChild } from 'vue'
import type { PolymorphicProps } from '~/factory'
import type { CreateToasterReturn } from '../composables/create-toaster'

export interface ToasterBaseProps extends PolymorphicProps {}

export interface ToasterProps extends ToasterBaseProps {
  toaster: CreateToasterReturn
}

export interface ToasterSlots extends SlotsType<{
  default: Options<VNodeChild>
}> {}
</script>

<script setup lang="ts">
import { group } from '@destyler/toast'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed } from 'vue'
import { ui } from '~/factory'
import ToastActor from './ToastActor.vue'

defineOptions({
  name: 'Toaster',
})

const props = defineProps<ToasterProps>()

defineSlots<{
  default(context: Options<VNodeChild>): unknown
}>()

const [state, send] = useMachine(props.toaster.machine)
const placement = computed(() => state.value.context.placement)
const toaster = computed(() => group.connect(state.value as any, send, normalizeProps))
</script>

<template>
  <ui.div v-bind="toaster.getGroupProps({ placement })" :as-child="asChild">
    <ToastActor
      v-for="toastItem in toaster.getToastsByPlacement(placement)"
      :key="toastItem.id"
      :value="toastItem"
    >
      <template #default="context">
        <slot v-bind="context" />
      </template>
    </ToastActor>
  </ui.div>
</template>
