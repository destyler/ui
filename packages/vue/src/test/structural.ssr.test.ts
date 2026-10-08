import { describe, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { assertStructuralMarkup } from '../../../../utils/test/structural-markup'
import { AspectRatio } from '../components/aspect-ratio'
import { Breadcrumbs } from '../components/breadcrumbs'
import { Label } from '../components/label'
import { Separator } from '../components/separator'

const home = { id: 'home', label: 'Home', href: '/' }
const current = { id: 'current', label: 'Current' }

describe('structural family SSR contracts', () => {
  it.each([[2, false], [0.5, true]] as const)('renders ratio %s and vertical=%s', async (ratio, vertical) => {
    const html = await renderToString(createSSRApp({
      render: () => h('main', [
        h(AspectRatio.Root, { id: 'frame', ratio }, () => h(AspectRatio.Content, { id: 'caller-content' }, () => 'Media')),
        h(Breadcrumbs.Root, { 'id': 'trail', 'items': [home, current], 'aria-label': 'Trail' }, () => h(Breadcrumbs.List, {}, () => [
          h(Breadcrumbs.Item, { item: home }, () => [h(Breadcrumbs.Link, { item: home }, () => 'Home'), h(Breadcrumbs.Separator, {}, () => '/')]),
          h(Breadcrumbs.Item, { item: current }, () => h(Breadcrumbs.Link, { item: current }, () => 'Current')),
        ])),
        h(Label.Root, { for: 'control' }, () => 'Name'),
        h('input', { id: 'control' }),
        h(Separator.Root, { id: 'rule', orientation: vertical ? 'vertical' : 'horizontal' }),
      ]),
    }))
    assertStructuralMarkup(html, ratio, vertical)
  })
})
