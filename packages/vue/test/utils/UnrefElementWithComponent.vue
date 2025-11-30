<script setup lang="ts">
import { computed, ref } from 'vue'
import { unrefElement } from '~/utils/unref-element'
import UnrefElementChild from './UnrefElementChild.vue'

const componentRef = ref<InstanceType<typeof UnrefElementChild> | null>(null)

const result = computed(() => {
  const el = unrefElement(componentRef)
  return el?.nodeName ?? 'null'
})
</script>

<template>
  <div>
    <UnrefElementChild ref="componentRef" />
    <div data-testid="result">
      {{ result }}
    </div>
  </div>
</template>
