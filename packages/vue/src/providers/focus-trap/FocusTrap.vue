<script lang="ts">
import type { VNodeRef } from 'vue'
import type { PolymorphicProps } from '~/factory'
import type { BaseEmits, BaseProps } from './types'

export interface FocusTrapBaseProps extends BaseProps, PolymorphicProps {}
export interface FocusTrapProps extends FocusTrapBaseProps {}
export interface FocusTrapEmits extends BaseEmits {}
</script>

<script setup lang="ts">
import { trapFocus, type FocusTrapOptions } from '@destyler/focus-trap'
import { watchEffect, ref, onWatcherCleanup, onBeforeUnmount } from 'vue'
import { ui } from '~/factory'
import { cleanProps } from '~/utils'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'FocusTrap',
})

const props = withDefaults(defineProps<FocusTrapProps>(), {
  disabled: undefined,
  allowOutsideClick: undefined,
  returnFocusOnDeactivate: undefined,
  initialFocus: undefined,
  fallbackFocus: undefined,
  setReturnFocus: undefined,
})

const emits = defineEmits<BaseEmits>()

const nodeRef = ref<VNodeRef | null>(null)
let cleanup: (() => void) | undefined

watchEffect(() => {
  if (props.disabled) return
  if (!nodeRef.value) return
  const node: HTMLElement | null = nodeRef.value.$el ? nodeRef.value.$el : nodeRef.value
  if (!node) return
  const autoFocusNode = node.querySelector<HTMLElement>('[autofocus], [data-autofocus]')

  const trapProps = cleanProps(props) as FocusTrapOptions
  trapProps.initialFocus ||= autoFocusNode ?? undefined

  cleanup = trapFocus(node, {
    ...trapProps,
    onActivate: () => emits('activate'),
    onDeactivate: () => emits('deactivate'),
  })

  onWatcherCleanup(() => cleanup?.())
})

onBeforeUnmount(() => {
  cleanup?.()
})

useForwardExpose()
</script>

<template>
  <ui.div ref="nodeRef" :as-child="asChild">
    <slot />
  </ui.div>
</template>
