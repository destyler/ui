import { hydrate } from 'solid-js/web'
import { Fixture } from './Fixture'

export * as entries from './entries'
export const mount = (container, changes) => hydrate(() => <Fixture changes={changes} />, container)
