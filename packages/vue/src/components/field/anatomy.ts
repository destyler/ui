import { createAnatomy } from '@destyler/anatomy'

export const fieldAnatomy = createAnatomy('field').parts(
  'root',
  'errorText',
  'helperText',
  'input',
  'label',
  'requiredIndicator',
)
export const parts = fieldAnatomy.build()
