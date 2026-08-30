import { createAnatomy } from '@destyler/anatomy'

export const toggleAnatomy = createAnatomy('toggle', ['root', 'indicator'])

export const parts = toggleAnatomy.build()
