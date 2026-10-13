import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'

let fixture: HTMLDivElement

beforeEach(() => {
  fixture = document.createElement('div')
  document.body.append(fixture)
})

afterEach(() => {
  fixture.remove()
})

describe('vitest browser matching compatibility', () => {
  it('preserves partial, case-insensitive locators for queries and native actions', async () => {
    const button = document.createElement('button')
    button.textContent = 'React trigger'
    fixture.append(button)
    button.addEventListener('click', () => button.setAttribute('data-clicked', 'true'))

    const trigger = page.getByRole('button', { name: 'React Trigger' })
    expect(trigger.element()).toBe(button)
    await trigger.click()
    await expect.element(trigger).toHaveAttribute('data-clicked', 'true')

    expect(page.getByRole('button', { name: 'React Trigger', exact: true }).query()).toBeNull()
    expect(page.getByRole('button', { name: 'React trigger', exact: true }).element()).toBe(button)
    expect(page.getByRole('button', { name: 'Unrelated trigger' }).query()).toBeNull()
  })

  it('keeps text substring lookup separate from explicit whole-string lookup', () => {
    const link = document.createElement('a')
    link.textContent = '🏠 Dashboard'
    fixture.append(link)

    expect(page.getByText('Dashboard').element()).toBe(link)
    expect(page.getByText('Dashboard', { exact: true }).query()).toBeNull()
    expect(page.getByText('🏠 Dashboard', { exact: true }).element()).toBe(link)
    expect(page.getByText('Unrelated page').query()).toBeNull()
  })

  it('preserves substring assertions without accepting unrelated or wrong-case text', () => {
    const value = document.createElement('span')
    value.textContent = '  React\n  ChevronDownIcon  '
    fixture.append(value)

    expect(value).toMatchTextContent('React')
    expect(value).toMatchTextContent(/^React ChevronDownIcon$/)
    expect(value).not.toMatchTextContent('Vue')
    expect(value).not.toMatchTextContent('react')
    expect(value).not.toMatchTextContent(/^React$/)
    expect(value).not.toMatchTextContent('')
    expect(value).not.toHaveTextContent('React')
    expect(value).toHaveTextContent('React ChevronDownIcon')
  })
})
