import { Pagination, usePagination } from '../index'

export function RootProvider() {
  const pagination = usePagination({ count: 100, pageSize: 10, siblingCount: 2 })

  return (
    <>
      <button onClick={() => pagination.goToNextPage()}>Next Page</button>

      <Pagination.RootProvider value={pagination}>
        <Pagination.PrevTrigger>
          Previous
          <span className="visually-hidden">Page</span>
        </Pagination.PrevTrigger>
        <Pagination.Context>
          {(ctx) => (
            <>
              {ctx.pages.map((page, index) => (
                page.type === 'page' ? (
                  <Pagination.Item key={index} value={page.value} type={page.type}>
                    {page.value}
                  </Pagination.Item>
                ) : (
                  <Pagination.Ellipsis key={`e${index}`} index={index}>
                    &#8230;
                  </Pagination.Ellipsis>
                )
              ))}
            </>
          )}
        </Pagination.Context>
        <Pagination.NextTrigger>
          Next
          <span className="visually-hidden">Page</span>
        </Pagination.NextTrigger>
      </Pagination.RootProvider>
    </>
  )
}
