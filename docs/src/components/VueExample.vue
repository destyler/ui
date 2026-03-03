<script setup lang="ts">
import { shallowRef, watchEffect } from 'vue'

const props = defineProps<{
  component: string
  example: string
}>()

const modules: Record<string, () => Promise<any>> = import.meta.glob(
  '../../../packages/vue/src/components/*/examples/*.vue',
)

const comp = shallowRef<any>(null)

watchEffect(async () => {
  const key = `../../../packages/vue/src/components/${props.component}/examples/${props.example}.vue`
  const loader = modules[key]
  if (loader) {
    const mod = await loader()
    comp.value = mod.default
  }
  else {
    comp.value = null
  }
})
</script>

<template>
  <div class="ds-vue-example">
    <component :is="comp" v-if="comp" />
    <div v-else class="ds-preview-empty">
      Vue example not found
    </div>
  </div>
</template>
