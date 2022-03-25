export default () => `query ReportQuery($userId: String!, $startDate: Int!, $endDate: Int!) {
      reports(
        select: [
          "day","clicks","conversions",
        ],
        groupBy:"day",
        pagination: {
          page: 1,
          limit: 50,
        },
        sorting: {
          orderBy: "day",
          orderDirectionAsc: true,
        },
        filter:[{ field: "advertiser_id", value: [$userId] }, { field: "offer_type", value: ["regular"] }],
        period:{
          start: $startDate,
          end: $endDate,
        }
        ){count,
          data {
              day,
              clicks,
              conversions
          }
        }
    }`;
