import { render } from 'vitest-browser-vue'
import { core033Contracts } from '../../../../utils/core-033-contracts'
import Contracts from './Core033Contracts.vue'

core033Contracts(options => render(Contracts, { props: options }))
