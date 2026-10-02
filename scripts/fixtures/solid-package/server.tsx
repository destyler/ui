import { generateHydrationScript, renderToString } from 'solid-js/web'
import { Fixture } from './Fixture'

export * as entries from './entries'
export const render = () => generateHydrationScript() + renderToString(() => <Fixture changes={{ pressed: [], open: [] }} />)
