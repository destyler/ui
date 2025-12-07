<script lang="ts">
export interface FormatNumberProps {
  /**
   * The number value to format
   */
  value: number
  /**
   * The formatting style to use
   */
  formatStyle?: 'decimal' | 'currency' | 'percent' | 'unit' | undefined
  /**
   * The currency to use (required when formatStyle is 'currency')
   */
  currency?: string | undefined
  compactDisplay?: 'short' | 'long' | undefined
  notation?: 'standard' | 'scientific' | 'engineering' | 'compact' | undefined
  signDisplay?: 'auto' | 'never' | 'always' | 'exceptZero' | undefined
  unit?: string | undefined
  unitDisplay?: 'short' | 'long' | 'narrow' | undefined
  currencyDisplay?: 'code' | 'symbol' | 'narrowSymbol' | 'name' | undefined
  currencySign?: 'standard' | 'accounting' | undefined
  /**
   * The minimum number of fraction digits to use
   */
  minimumFractionDigits?: number | undefined
  /**
   * The maximum number of fraction digits to use
   */
  maximumFractionDigits?: number | undefined
}
</script>

<script setup lang="ts">
import { formatNumber } from '@destyler/i18n'
import { computed } from 'vue'
import { DEFAULT_LOCALE, useLocaleContext } from '../../providers'

defineOptions({
  name: 'FormatNumber'
})

const props = defineProps<FormatNumberProps>()
const locale = useLocaleContext(DEFAULT_LOCALE)
const text = computed(() => {
  const { value, formatStyle, ...intlProps } = props
  return formatNumber(value, locale.value.locale, { ...intlProps, style: formatStyle })
})
</script>

<template>
  {{ text }}
</template>
