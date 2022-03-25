export default (entity: string, entityName?: string) => `query BreakdownQuery(
    $userId: String!,
    $startDate: Int!,
    $endDate: Int!,
    $entity: String!,
    $orderBy: String!,
    $orderAsc: Boolean!,
    $page: Int!,
    $limit: Int!
  ) {
  reports(
    select: [
      $entity,"clicks","conversions","revenue"
    ],
    groupBy:$entity,
    pagination: {
      page: $page,
      limit: $limit,
    },
    sorting: {
      orderBy: $orderBy,
      orderDirectionAsc: $orderAsc,
    },
    filter:[{ field: "advertiser_id", value: [$userId] }, { field: "offer_type", value: ["regular"] }],
    period:{
      start: $startDate,
      end: $endDate,
    }
  ) {
    count,
    data {
        ${entity},
        ${entityName && entityName !== entity ? `${entityName},` : ''}
        clicks,conversions,revenue
    }
  }
}`;
