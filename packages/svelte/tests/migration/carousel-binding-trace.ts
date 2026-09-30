import { vi } from 'vitest'

export function createCarouselBindingTrace(mode: string) {
  const events: object[] = []
  let container: HTMLElement | undefined
  let group: HTMLElement | null | undefined
  let scrollSpy: { mockRestore: () => void } | undefined
  const state = () => ({
    api: container?.querySelector('[data-testid="api-state"]')?.textContent,
    parent: container?.querySelector('[data-testid="parent-state"]')?.textContent,
    snapPoints: container?.querySelector('[data-testid="page-snap-points"]')?.textContent,
  })
  const record = (type: string, data: object = {}) => events.push({ type, time: performance.now(), ...data, ...state() })
  const onScroll = () => record('scroll')

  return {
    record,
    onChange: (value: unknown) => record('change', { value }),
    onWrite: (value: unknown) => record('write', { value }),
    attach(element: HTMLElement) {
      container = element
      group = container.querySelector<HTMLElement>('[data-part="item-group"]')
      if (!group)
        throw new Error('Carousel item group is missing')
      const scrollTo = group.scrollTo.bind(group)
      scrollSpy = vi.spyOn(group, 'scrollTo').mockImplementation((...args: Parameters<HTMLElement['scrollTo']>) => {
        record('scrollTo', { args })
        scrollTo(...args)
      })
      group.addEventListener('scroll', onScroll)
      record('mounted')
    },
    report() {
      // Read layout only after a failure; tracing must not force a layout flush
      // before the callback/scroll sequence that we are trying to diagnose.
      const rect = group?.getBoundingClientRect()
      console.error('Carousel synchronization trace', JSON.stringify({
        mode,
        events,
        final: {
          ...state(),
          scrollLeft: group?.scrollLeft,
          width: group?.clientWidth,
          scrollWidth: group?.scrollWidth,
          style: group?.getAttribute('style'),
          items: Array.from(group?.children ?? []).map((item) => {
            const itemRect = item.getBoundingClientRect()
            return {
              index: (item as HTMLElement).dataset.index,
              inView: (item as HTMLElement).dataset.inview,
              left: itemRect.left - (rect?.left ?? 0),
              width: itemRect.width,
              style: item.getAttribute('style'),
            }
          }),
        },
      }))
    },
    restore() {
      group?.removeEventListener('scroll', onScroll)
      scrollSpy?.mockRestore()
    },
  }
}
