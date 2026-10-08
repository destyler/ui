import { render } from 'svelte/server'
import { expect, it, vi } from 'vitest'
import Fixture from './CallbackLifecycle.svelte'

it.each([false, true])('does not execute Frame callbacks during SSR (public frame=%s)', (frame) => {
  expect(typeof document).toBe('undefined')
  const onMountCall = vi.fn()
  const onUnmountCall = vi.fn()
  const { body } = render(Fixture, { props: { frame, incrementOnMount: true, onMountCall, onUnmountCall } })
  expect(body).toContain('data-testid="value">0</output>')
  expect(body).toContain(frame ? 'Callback lifecycle frame' : 'Frame lifecycle child')
  expect(onMountCall).not.toHaveBeenCalled()
  expect(onUnmountCall).not.toHaveBeenCalled()
})
