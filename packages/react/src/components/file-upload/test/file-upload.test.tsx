import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { getExports, getParts } from '../../../../../../utils/test'
import { Basic } from '../examples/Basic'
import { FileUpload, fileUploadAnatomy } from '../index'

describe('[file-upload] component', () => {
  it.each(getParts(fileUploadAnatomy))('should render part %s', (part) => {
    render(<Basic />)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(fileUploadAnatomy))('should export %s', (part) => {
    expect(FileUpload[part]).toBeDefined()
  })
})
