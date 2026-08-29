// Generated from package-manifest.json. Do not edit by hand.
export const providerCategories = {
  Runtime: [
    { name: 'Client Only', slug: 'client-only' },
    { name: 'Environment', slug: 'environment' },
    { name: 'Frame', slug: 'frame' },
    { name: 'Locale', slug: 'locale' },
  ],
  Behavior: [
    { name: 'Focus Trap', slug: 'focus-trap' },
  ],
  Content: [
    { name: 'Format', slug: 'format' },
    { name: 'Highlight', slug: 'highlight' },
  ],
} as const

export type ProviderCategory = keyof typeof providerCategories
