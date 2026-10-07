import { render } from 'solid-js/web'
import { providerFilterCases } from '../../../../../tests/combobox/provider-filter-cases'
import { RootProvider } from '../examples/RootProvider'

providerFilterCases(container => render(() => <RootProvider />, container))
