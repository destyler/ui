import { useState } from 'react'
import { Pagination } from '../index'

export function Controlled() {
  const [page, setPage] = useState(1)

  return (
    <>
      <output>
        Page
        {' '}
        {page}
      </output>
      <Pagination.Root
        count={100}
        pageSize={10}
        siblingCount={2}
        page={page}
        onPageChange={details => setPage(details.page)}
      >
        <Pagination.PrevTrigger>
          Previous
          <span className="visually-hidden">Page</span>
        </Pagination.PrevTrigger>
        <Pagination.Context>
          {pagination => (
            <>
              {pagination.pages.map((p, index) => (
                p.type === 'page'
                  ? (
                      <Pagination.Item key={index} value={p.value} type={p.type}>
                        {p.value}
                      </Pagination.Item>
                    )
                  : (
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
      </Pagination.Root>
    </>
  )
}
