import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { getExports, getParts } from '../../../../../../utils/test'
import Basic from '../examples/Basic.vue'
import RootProvider from '../examples/RootProvider.vue'
import { Label, labelAnatomy } from '../index'

describe('[label] component', () => {
  it.each(getParts(labelAnatomy))('should render part %s', async (part) => {
    await render(Basic)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(labelAnatomy))('should export %s', async (part) => {
    expect(Label).toHaveProperty(part, expect.anything())
  })

  it('should render label text', async () => {
    await render(Basic)
    await expect.element(page.getByText('Username')).toBeVisible()
  })

  it('should work with RootProvider', async () => {
    await render(RootProvider)
    await expect.element(page.getByText('Email Address')).toBeVisible()
  })
})
