export interface Paginated<T> {
  data: T[]
  metadata: {
    /**
     *  Total number of pages with limitations set
     */
    total_page: number
    /**
     * Current page
     */
    page: number
    /**
     * Number of entities per page
     */
    limit: number
    /**
     * Total number of entities
     */
    total: number
  }
}

export interface PaginateFetchParameters {
  page: number
  limit: number
}
