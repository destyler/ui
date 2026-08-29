import { describe, expect, it } from 'vitest'
import collapseMeta from '../../collapse/stories/collapse.stories'
import collapsibleMeta from '../../collapsible/stories/collapsible.stories'
import hoverCardMeta from '../../hover-card/stories/hover-card.stories'
import popoverMeta from '../../popover/stories/popover.stories'
import scrollAreaMeta from '../../scroll-area/stories/scroll-area.stories'
import separatorMeta from '../../separator/stories/separator.stories'
import splitterMeta from '../../splitter/stories/splitter.stories'
import stepsMeta from '../../steps/stories/steps.stories'
import tabsMeta from '../../tabs/stories/tabs.stories'
import toastMeta from '../../toast/stories/toast.stories'
import tooltipMeta from '../../tooltip/stories/tooltip.stories'
import tourMeta from '../../tour/stories/tour.stories'
import dialogMeta from '../stories/dialog.stories'

const stories = [
  [dialogMeta, 'Components / Overlay / Dialog'],
  [popoverMeta, 'Components / Overlay / Popover'],
  [tooltipMeta, 'Components / Overlay / Tooltip'],
  [hoverCardMeta, 'Components / Overlay / Hover Card'],
  [toastMeta, 'Components / Overlay / Toast'],
  [tourMeta, 'Components / Overlay / Tour'],
  [collapseMeta, 'Components / Layout / Collapse'],
  [collapsibleMeta, 'Components / Layout / Collapsible'],
  [tabsMeta, 'Components / Layout / Tabs'],
  [splitterMeta, 'Components / Layout / Splitter'],
  [stepsMeta, 'Components / Layout / Steps'],
  [separatorMeta, 'Components / Layout / Separator'],
  [scrollAreaMeta, 'Components / Layout / Scroll Area'],
] as const

describe('[stories] visual parity', () => {
  it.each(stories)('keeps %s categorized with the fullscreen layout', (meta, title) => {
    expect(meta.title).toBe(title)
    expect(meta.parameters?.layout).toBe('fullscreen')
  })
})
