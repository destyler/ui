import type { HTMLAttributes, SvelteHTMLElements } from 'svelte/elements'
import { createNormalizer } from '@destyler/types'

type Dict = Record<string, unknown>

const propMap: Record<string, string> = {
  className: 'class',
  defaultChecked: 'checked',
  defaultValue: 'value',
  htmlFor: 'for',
  onBlur: 'onfocusout',
  onChange: 'oninput',
  onFocus: 'onfocusin',
  onDoubleClick: 'ondblclick',
}

export type PropTypes = SvelteHTMLElements & {
  element: HTMLAttributes<HTMLElement>
  style?: HTMLAttributes<HTMLElement>['style']
}

function toStyleString(style: Record<string, unknown>) {
  let result = ''

  for (let key in style) {
    const value = style[key]
    if (value === null || value === undefined)
      continue

    if (!key.startsWith('--'))
      key = key.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`)

    result += `${key}:${value};`
  }

  return result
}

const preserveKeys = new Set(
  'viewBox,className,preserveAspectRatio,fillRule,clipPath,clipRule,strokeWidth,strokeLinecap,strokeLinejoin,strokeDasharray,strokeDashoffset,strokeMiterlimit'.split(','),
)

function toSvelteProp(key: string) {
  if (key in propMap)
    return propMap[key]
  if (preserveKeys.has(key))
    return key
  return key.toLowerCase()
}

function toSveltePropValue(key: string, value: unknown) {
  if (key === 'style' && typeof value === 'object' && value !== null)
    return toStyleString(value as Record<string, unknown>)
  return value
}

export const normalizeProps = createNormalizer<PropTypes>((props) => {
  const normalized: Dict = {}

  for (const key in props)
    normalized[toSvelteProp(key)] = toSveltePropValue(key, props[key])

  return normalized
})
