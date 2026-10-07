import { renderToStaticMarkup } from 'react-dom/server'
import { describe, it } from 'vitest'
import { assertStructuralMarkup } from '../../../../utils/test/structural-markup'
import { AspectRatio } from '../components/aspect-ratio'
import { Breadcrumbs } from '../components/breadcrumbs'
import { Label } from '../components/label'
import { Separator } from '../components/separator'

const home = { id: 'home', label: 'Home', href: '/' }
const current = { id: 'current', label: 'Current' }

function Fixture(props: { ratio: number, vertical: boolean }) {
  return (
    <>
      <AspectRatio.Root id="frame" ratio={props.ratio}>
        <AspectRatio.Content id="caller-content">Media</AspectRatio.Content>
      </AspectRatio.Root>
      <Breadcrumbs.Root id="trail" items={[home, current]} aria-label="Trail">
        <Breadcrumbs.List>
          <Breadcrumbs.Item item={home}><Breadcrumbs.Link item={home}>Home</Breadcrumbs.Link><Breadcrumbs.Separator>/</Breadcrumbs.Separator></Breadcrumbs.Item>
          <Breadcrumbs.Item item={current}><Breadcrumbs.Link item={current}>Current</Breadcrumbs.Link></Breadcrumbs.Item>
        </Breadcrumbs.List>
      </Breadcrumbs.Root>
      <Label.Root htmlFor="control">Name</Label.Root>
      <input id="control" />
      <Separator.Root id="rule" orientation={props.vertical ? 'vertical' : 'horizontal'} />
    </>
  )
}

describe('structural family SSR contracts', () => {
  it.each([[2, false], [0.5, true]] as const)('renders ratio %s and vertical=%s', (ratio, vertical) => {
    const html = renderToStaticMarkup(<Fixture ratio={ratio} vertical={vertical} />)
    assertStructuralMarkup(html, ratio, vertical)
  })
})
