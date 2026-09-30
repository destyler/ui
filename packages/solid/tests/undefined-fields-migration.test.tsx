import type { CalendarDate } from '@destyler/calendar'
import type { Accessor } from 'solid-js'
import { parse as parseDate } from '@destyler/calendar'
import { parse as parseColor } from '@destyler/color-picker'
import { cleanup, render, waitFor } from '@solidjs/testing-library'
import user from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useCalendar } from '../src/components/calendar'
import { Carousel, useCarousel } from '../src/components/carousel'
import { useCheckbox } from '../src/components/checkbox'
import { useCollapse } from '../src/components/collapse'
import { useColorPicker } from '../src/components/color-picker'
import { useCombobox } from '../src/components/combobox'
import { useEdit } from '../src/components/edit'
import { useNavigationMenu } from '../src/components/navigation-menu'
import { useNumberInput } from '../src/components/number-input'
import { useOtpInput } from '../src/components/otp-input'
import { usePagination } from '../src/components/pagination'
import { useRadio } from '../src/components/radio'
import { useSelect } from '../src/components/select'
import { useSlider } from '../src/components/slider'
import { Splitter, useSplitter } from '../src/components/splitter'
import { useSteps } from '../src/components/steps'
import { useSwitch } from '../src/components/switch'
import { useTabs } from '../src/components/tabs'
import { ToggleGroup, useToggleGroup } from '../src/components/toggle-group'
import { useTree } from '../src/components/tree'
import { createListCollection, createTreeCollection } from '../src/utils/collection'

const collection = createListCollection({ items: ['one', 'two'] })
const treeCollection = createTreeCollection({
  rootNode: { id: 'ROOT', children: [{ id: 'one', children: [{ id: 'leaf-one' }] }, { id: 'two', children: [{ id: 'leaf-two' }] }] },
  nodeToValue: node => node.id,
  nodeToString: node => node.id,
})
afterEach(cleanup)

async function assertUncontrolled<T>(
  useApi: () => Accessor<T>,
  read: (api: T) => unknown,
  change: (api: T) => void,
  reset: (api: T) => void,
  initial: unknown,
  changed: unknown,
) {
  let api!: Accessor<T>
  const view = render(() => {
    api = useApi()
    return <output data-testid="value">{JSON.stringify(read(api()))}</output>
  })
  expect(read(api())).toEqual(initial)
  expect(view.getByTestId('value').textContent).toBe(JSON.stringify(initial))
  change(api())
  await waitFor(() => expect(read(api())).toEqual(changed))
  expect(view.getByTestId('value').textContent).toBe(JSON.stringify(changed))
  reset(api())
  await waitFor(() => expect(read(api())).toEqual(initial))
  expect(view.getByTestId('value').textContent).toBe(JSON.stringify(initial))
}

describe('undefined live fields do not acquire core ownership', () => {
  it('calendar.value accepts repeated uncontrolled changes', async () => {
    await assertUncontrolled(
      () => useCalendar({ value: undefined, defaultValue: [parseDate('2026-01-01')] }),
      api => api.value.map(date => date.toString()),
      api => api.setValue([parseDate('2026-02-02') as CalendarDate]),
      api => api.setValue([parseDate('2026-01-01') as CalendarDate]),
      ['2026-01-01'],
      ['2026-02-02'],
    )
  })

  it('carousel.page accepts repeated uncontrolled changes', async () => {
    let api!: ReturnType<typeof useCarousel>
    const view = render(() => {
      api = useCarousel({ page: undefined, defaultPage: 0, slideCount: 3 })
      return (
        <Carousel.RootProvider value={api}>
          <Carousel.ItemGroup
            ref={(el) => {
              // Deterministic geometry isolates ownership from browser layout.
              vi.spyOn(el, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 300, 100))
              Object.defineProperties(el, { scrollWidth: { value: 900 }, offsetWidth: { value: 300 } })
            }}
            style={{ 'scroll-padding-left': '0px', 'scroll-padding-right': '0px', 'scroll-padding-top': '0px', 'scroll-padding-bottom': '0px' }}
          >
            {[0, 1, 2].map(index => (
              <Carousel.Item
                index={index}
                ref={el => vi.spyOn(el, 'getBoundingClientRect').mockReturnValue(new DOMRect(index * 300, 0, 300, 100))}
              >
                Slide {index}
              </Carousel.Item>
            ))}
          </Carousel.ItemGroup>
          <output data-testid="page">{api().page}</output>
        </Carousel.RootProvider>
      )
    })
    await waitFor(() => expect(api().pageSnapPoints).toHaveLength(3))
    expect(api().page).toBe(0)
    api().scrollTo(1)
    await waitFor(() => expect(api().page).toBe(1))
    expect(view.getByTestId('page')).toHaveTextContent('1')
    api().scrollTo(0)
    await waitFor(() => expect(api().page).toBe(0))
  })

  it('checkbox.checked accepts repeated uncontrolled changes', async () => {
    await assertUncontrolled(
      () => useCheckbox({ checked: undefined, defaultChecked: true }),
      api => api.checked,
      api => api.setChecked(false),
      api => api.setChecked(true),
      true,
      false,
    )
  })

  it('collapse.value accepts repeated uncontrolled changes', async () => {
    await assertUncontrolled(
      () => useCollapse({ value: undefined, defaultValue: ['one'] }),
      api => api.value,
      api => api.setValue(['two']),
      api => api.setValue(['one']),
      ['one'],
      ['two'],
    )
  })

  it('color-picker.value accepts repeated uncontrolled changes', async () => {
    await assertUncontrolled(
      () => useColorPicker({ value: undefined, defaultValue: parseColor('#ff0000') }),
      api => api.value.toString('hex'),
      api => api.setValue(parseColor('#00ff00')),
      api => api.setValue(parseColor('#ff0000')),
      '#FF0000',
      '#00FF00',
    )
  })

  it('combobox.value accepts repeated uncontrolled changes', async () => {
    await assertUncontrolled(
      () => useCombobox({ collection, value: undefined, defaultValue: ['one'] }),
      api => api.value,
      api => api.setValue(['two']),
      api => api.setValue(['one']),
      ['one'],
      ['two'],
    )
  })

  it('combobox.inputValue accepts repeated uncontrolled changes', async () => {
    await assertUncontrolled(
      () => useCombobox({ collection, inputValue: undefined, defaultInputValue: 'one' }),
      api => api.inputValue,
      api => api.setInputValue('two'),
      api => api.setInputValue('one'),
      'one',
      'two',
    )
  })

  it('edit.value accepts repeated uncontrolled changes', async () => {
    await assertUncontrolled(
      () => useEdit({ value: undefined, defaultValue: 'one' }),
      api => api.value,
      api => api.setValue('two'),
      api => api.setValue('one'),
      'one',
      'two',
    )
  })

  it('navigation-menu.value accepts repeated uncontrolled changes', async () => {
    await assertUncontrolled(
      () => useNavigationMenu({ value: undefined, defaultValue: 'one' }),
      api => api.value,
      api => api.setValue('two'),
      api => api.setValue('one'),
      'one',
      'two',
    )
  })

  it('number-input.value accepts repeated uncontrolled changes', async () => {
    await assertUncontrolled(
      () => useNumberInput({ value: undefined, defaultValue: '1' }),
      api => api.value,
      api => api.setValue(2),
      api => api.setValue(1),
      '1',
      '2',
    )
  })

  it('otp-input.value accepts repeated uncontrolled changes', async () => {
    await assertUncontrolled(
      () => useOtpInput({ value: undefined, defaultValue: ['1', '2'] }),
      api => api.value,
      api => api.setValue(['3', '4']),
      api => api.setValue(['1', '2']),
      ['1', '2'],
      ['3', '4'],
    )
  })

  it('pagination.page accepts repeated uncontrolled changes', async () => {
    await assertUncontrolled(
      () => usePagination({ count: 100, page: undefined, defaultPage: 2 }),
      api => api.page,
      api => api.setPage(3),
      api => api.setPage(2),
      2,
      3,
    )
  })

  it('pagination.pageSize accepts repeated uncontrolled changes', async () => {
    await assertUncontrolled(
      () => usePagination({ count: 100, pageSize: undefined, defaultPageSize: 10 }),
      api => api.pageSize,
      api => api.setPageSize(25),
      api => api.setPageSize(10),
      10,
      25,
    )
  })

  it('radio.value accepts repeated uncontrolled changes', async () => {
    await assertUncontrolled(
      () => useRadio({ value: undefined, defaultValue: 'one' }),
      api => api.value,
      api => api.setValue('two'),
      api => api.setValue('one'),
      'one',
      'two',
    )
  })

  it('select.value accepts repeated uncontrolled changes', async () => {
    await assertUncontrolled(
      () => useSelect({ collection, value: undefined, defaultValue: ['one'] }),
      api => api.value,
      api => api.setValue(['two']),
      api => api.setValue(['one']),
      ['one'],
      ['two'],
    )
  })

  it('slider.value accepts repeated uncontrolled changes', async () => {
    await assertUncontrolled(
      () => useSlider({ value: undefined, defaultValue: [20] }),
      api => api.value,
      api => api.setValue([30]),
      api => api.setValue([20]),
      [20],
      [30],
    )
  })

  it('steps.step accepts repeated uncontrolled changes', async () => {
    await assertUncontrolled(
      () => useSteps({ count: 4, step: undefined, defaultStep: 1 }),
      api => api.value,
      api => api.setStep(2),
      api => api.setStep(1),
      1,
      2,
    )
  })

  it('switch.checked accepts repeated uncontrolled changes', async () => {
    await assertUncontrolled(
      () => useSwitch({ checked: undefined, defaultChecked: true }),
      api => api.checked,
      api => api.setChecked(false),
      api => api.setChecked(true),
      true,
      false,
    )
  })

  it('tabs.value accepts repeated uncontrolled changes', async () => {
    await assertUncontrolled(
      () => useTabs({ value: undefined, defaultValue: 'one' }),
      api => api.value,
      api => api.setValue('two'),
      api => api.setValue('one'),
      'one',
      'two',
    )
  })

  it('toggle-group.value accepts repeated uncontrolled changes', async () => {
    let api!: ReturnType<typeof useToggleGroup>
    const view = render(() => {
      api = useToggleGroup({ value: undefined, defaultValue: ['one'] })
      return (
        <ToggleGroup.RootProvider value={api}>
          <ToggleGroup.Item value="one">One</ToggleGroup.Item>
          <ToggleGroup.Item value="two">Two</ToggleGroup.Item>
        </ToggleGroup.RootProvider>
      )
    })
    expect(api().value).toEqual(['one'])
    await user.click(view.getByText('Two'))
    expect(api().value).toEqual(['two'])
    expect(view.getByText('Two')).toHaveAttribute('data-state', 'on')
    await user.click(view.getByText('One'))
    expect(api().value).toEqual(['one'])
  })

  it('tree.selectedValue accepts repeated uncontrolled changes', async () => {
    await assertUncontrolled(
      () => useTree({ collection: treeCollection, selectedValue: undefined, defaultSelectedValue: ['one'] }),
      api => api.selectedValue,
      api => api.setSelectedValue(['two']),
      api => api.setSelectedValue(['one']),
      ['one'],
      ['two'],
    )
  })

  it('tree.expandedValue accepts repeated uncontrolled changes', async () => {
    await assertUncontrolled(
      () => useTree({ collection: treeCollection, expandedValue: undefined, defaultExpandedValue: ['one'] }),
      api => api.expandedValue,
      api => api.setExpandedValue(['two']),
      api => api.setExpandedValue(['one']),
      ['one'],
      ['two'],
    )
  })

  it('splitter.size accepts repeated uncontrolled changes through RootProvider', async () => {
    let api!: ReturnType<typeof useSplitter>
    const view = render(() => {
      api = useSplitter({ size: undefined, defaultSize: [{ id: 'a', size: 50 }] })
      return (
        <Splitter.RootProvider value={api}>
          <Splitter.Panel id="a" data-testid="panel">A</Splitter.Panel>
          <Splitter.ResizeTrigger id="a:b" />
          <Splitter.Panel id="b">B</Splitter.Panel>
        </Splitter.RootProvider>
      )
    })
    const panel = view.getByTestId('panel')
    expect(panel.style.flexGrow).toContain('50')
    api().setSize('a', 75)
    await waitFor(() => expect(panel.style.flexGrow).toContain('75'))
    api().setSize('a', 50)
    await waitFor(() => expect(panel.style.flexGrow).toContain('50'))
  })
})
