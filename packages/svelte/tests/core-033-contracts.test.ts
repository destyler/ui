import { render } from 'vitest-browser-svelte'
import { core033Contracts } from '../../../utils/core-033-contracts'
import Contracts from './Core033Contracts.svelte'

core033Contracts(options => render(Contracts, { props: options }))
