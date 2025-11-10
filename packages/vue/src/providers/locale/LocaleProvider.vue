<script setup lang="ts">
import { isRTL, type Locale } from '@destyler/i18n'
import { computed } from 'vue'
import { LocaleContextProvider } from './use-locale-context'
import type { LocaleProviderProps } from './types'

const props = defineProps<LocaleProviderProps>()
const context = computed<Locale>(() => ({
  locale: props.locale,
  dir: isRTL(props.locale) ? 'rtl' : 'ltr',
}))

LocaleContextProvider(context)
</script>

<template>
  <slot />
</template>
