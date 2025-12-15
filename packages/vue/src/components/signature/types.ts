import type * as signature from '@destyler/signature'

export interface RootProps {
  /**
   * Whether the signature is disabled.
   */
  disabled?: boolean
  /**
   * The drawing options.
   * @default '{ size: 2, simulatePressure: true }'
   */
  drawing?: signature.DrawingOptions
  /**
   * The unique identifier of the machine.
   */
  id?: string
  /**
   * The ids of the signature elements. Useful for composition.
   */
  ids?: Partial<{ root: string, control: string, hiddenInput: string, label: string }>
  /**
   * The name of the signature. Useful for form submission.
   */
  name?: string
  /**
   * Whether the signature is read-only.
   */
  readOnly?: boolean
  /**
   * Whether the signature is required.
   */
  required?: boolean
  /**
   * The translations of the signature. Useful for internationalization.
   */
  translations?: signature.IntlTranslations
}

export interface RootEmits {
  /**
   * Callback when the signature is drawing.
   */
  draw: [details: signature.DrawDetails]
  /**
   * Callback when the signature is done drawing.
   */
  drawEnd: [details: signature.DrawEndDetails]
}
