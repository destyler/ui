import ByteBasic from '../examples/ByteBasic.vue'
import ByteLocale from '../examples/ByteLocale.vue'
import ByteSize from '../examples/ByteSize.vue'
import ByteWithUnit from '../examples/ByteWithUnit.vue'
import ByteWithUnitDisplay from '../examples/ByteWithUnitDisplay.vue'
import NumberBasic from '../examples/NumberBasic.vue'
import NumberWithCompact from '../examples/NumberWithCompact.vue'
import NumberWithCurrency from '../examples/NumberWithCurrency.vue'
import NumberWithLocale from '../examples/NumberWithLocale.vue'
import NumberWithPercentage from '../examples/NumberWithPercentage.vue'
import NumberWithUnit from '../examples/NumberWithUnit.vue'

export default {
  title: 'Components / Format',
  parameters: {
    layout: 'fullscreen',
  },
}

export function byteBasic() {
  return {
    components: { ByteBasic },
    template: '<ByteBasic />',
  }
}

export function byteLocale() {
  return {
    components: { ByteLocale },
    template: '<ByteLocale />',
  }
}

export function byteSize() {
  return {
    components: { ByteSize },
    template: '<ByteSize />',
  }
}

export function byteWithUnit() {
  return {
    components: { ByteWithUnit },
    template: '<ByteWithUnit />',
  }
}

export function byteWithUnitDisplay() {
  return {
    components: { ByteWithUnitDisplay },
    template: '<ByteWithUnitDisplay />',
  }
}

export function numberBasic() {
  return {
    components: { NumberBasic },
    template: '<NumberBasic />',
  }
}

export function numberWithCompact() {
  return {
    components: { NumberWithCompact },
    template: '<NumberWithCompact />',
  }
}

export function numberWithCurrency() {
  return {
    components: { NumberWithCurrency },
    template: '<NumberWithCurrency />',
  }
}

export function numberWithLocale() {
  return {
    components: { NumberWithLocale },
    template: '<NumberWithLocale />',
  }
}

export function numberWithPercentage() {
  return {
    components: { NumberWithPercentage },
    template: '<NumberWithPercentage />',
  }
}

export function numberWithUnit() {
  return {
    components: { NumberWithUnit },
    template: '<NumberWithUnit />',
  }
}
