<script lang="ts">
import type { Options, Service } from '@destyler/toast'
import type { SlotsType, VNodeChild } from 'vue'

export interface ToastActorProps {
  value: Service<VNodeChild>
}

export interface ToastActorSlots extends SlotsType<{
  default: Options<VNodeChild>
}> {}
</script>

<script setup lang="ts">
import { connect } from '@destyler/toast'
import { normalizeProps, useActor } from '@destyler/vue'
import { computed } from 'vue'
import { ToastProvider } from '../composables/use-toast-context'

defineOptions({
  name: 'ToastActor',
})

const props = defineProps<ToastActorProps>()

defineSlots<{
  default(context: Options<VNodeChild>): unknown
}>()

const [state, send] = useActor(props.value)
const api = computed(() => connect(state.value, send, normalizeProps))

ToastProvider(api)
</script>

<template>
  <slot v-bind="state.context" />
</template>
