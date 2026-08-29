<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, shallowRef, watchEffect } from 'vue'
import { getFramework } from '../config/frameworks'
import { getExamplePreviewMessage } from '../utils/example-preview'
import { getActiveFramework, observeVisibility, onFrameworkChange } from '../utils/framework'

const props = defineProps<{
  component: string
  example: string
}>()

const modules: Record<string, () => Promise<any>> = import.meta.glob(
  '../../../packages/vue/src/components/*/examples/*.vue',
)

const framework = getFramework('vue')
const comp = shallowRef<any>(null)
const status = ref<'idle' | 'loading' | 'ready' | 'missing' | 'error'>('idle')
const rootElement = ref<HTMLElement>()
const isActive = ref(false)
const isVisible = ref(false)
let stopFrameworkListener: (() => void) | undefined
let stopVisibilityObserver: (() => void) | undefined
let loadVersion = 0

onMounted(() => {
  isActive.value = getActiveFramework() === framework.id
  stopFrameworkListener = onFrameworkChange((activeFramework) => {
    isActive.value = activeFramework === framework.id
  })
  if (rootElement.value) {
    const visibilityTarget = rootElement.value.parentElement ?? rootElement.value
    stopVisibilityObserver = observeVisibility(visibilityTarget, (visible) => {
      if (visible)
        isVisible.value = true
    })
  }
})

onBeforeUnmount(() => {
  stopFrameworkListener?.()
  stopVisibilityObserver?.()
})

watchEffect(async () => {
  const version = ++loadVersion
  if (!isActive.value || !isVisible.value) {
    comp.value = null
    status.value = 'idle'
    return
  }

  const key = `../../../packages/vue/src/components/${props.component}/examples/${props.example}.vue`
  const loader = modules[key]
  if (!loader) {
    comp.value = null
    status.value = 'missing'
    return
  }

  status.value = 'loading'
  try {
    const mod = await loader()
    if (version === loadVersion) {
      comp.value = mod.default
      status.value = comp.value ? 'ready' : 'error'
    }
  }
  catch {
    if (version === loadVersion) {
      comp.value = null
      status.value = 'error'
    }
  }
})
</script>

<template>
  <div ref="rootElement" class="ds-example-content">
    <component :is="comp" v-if="status === 'ready' && comp" />
    <div
      v-else-if="status === 'loading' || status === 'missing' || status === 'error'"
      :class="status === 'loading' ? 'ds-preview-loading' : 'ds-preview-empty'"
    >
      {{ getExamplePreviewMessage(framework.label, status) }}
    </div>
  </div>
</template>
