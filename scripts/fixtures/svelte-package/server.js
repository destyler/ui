import { render as renderSvelte } from 'svelte/server'
import Fixture from './Fixture.svelte'

export * as entries from './entries'
export const render = () => renderSvelte(Fixture, { props: { changes: { pressed: [], open: [] } } }).body
