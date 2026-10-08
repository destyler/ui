import { mergeProps } from 'vue'

type Props = Record<string, unknown>

export function isCarouselEvent(key: string) {
  return /^on[A-Z]/.test(key)
}

export function mergeCarouselProps(baseProps: object, consumerProps: object) {
  const base = baseProps as Props
  const consumer = consumerProps as Props
  const result = mergeProps(base, consumer)
  for (const key of Object.keys(base)) {
    if (!isCarouselEvent(key) || !(typeof base[key] === 'function' || Array.isArray(base[key])))
      continue
    const first = consumer[key]
    const last = base[key]
    result[key] = first == null
      ? last
      : [...(Array.isArray(first) ? first : [first]), ...(Array.isArray(last) ? last : [last])]
  }
  return result
}
