import { createContext } from '~/utils/create-context'

interface TestContext {
  name: string
  count: number
}

export const [testContextProvider, testContextConsumer] = createContext<TestContext | string>('test-context')
