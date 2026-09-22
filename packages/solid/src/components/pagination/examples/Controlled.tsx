import { Pagination } from '@destyler-ui/solid/pagination'
import { createSignal, For } from 'solid-js'

export function Controlled() {
  const [page, setPage] = createSignal(1)

  return (
    <>
      <output>
        Page
        {' '}
        {page()}
      </output>
      <Pagination.Root
        count={100}
        pageSize={10}
        siblingCount={2}
        page={page()}
        onPageChange={details => setPage(details.page)}
      >
        <Pagination.PrevTrigger>Previous Page</Pagination.PrevTrigger>
        <Pagination.Context>
          {api => (
            <For each={api().pages}>
              {(p, index) =>
                p.type === 'page'
                  ? (
                      <Pagination.Item {...p}>{p.value}</Pagination.Item>
                    )
                  : (
                      <Pagination.Ellipsis index={index()}>&#8230;</Pagination.Ellipsis>
                    )}
            </For>
          )}
        </Pagination.Context>
        <Pagination.NextTrigger>Next Page</Pagination.NextTrigger>
      </Pagination.Root>
    </>
  )
}
