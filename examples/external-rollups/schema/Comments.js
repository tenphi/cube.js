cube(`Comments`, {
  sql: `select * from \`bigquery-public-data.hacker_news.comments\` WHERE time_ts IS NOT NULL`,

  joins: {
    Stories: {
      sql: `${CUBE}.parent = ${Stories}.id`,
      relationship: `belongsTo`
    }
  },

  measures: {
    count: {
      type: `count`,
    }
  },

  dimensions: {
    time: {
      sql: `time_ts`,
      type: `time`
    },

    id: {
      sql: `id`,
      type: `number`,
      primaryKey: true
    }
  }
});

cube(`CommentsPreAgg`, {
  extends: Comments,
  joins: {
    StoriesPreAgg: {
      sql: `${CUBE}.parent = ${StoriesPreAgg}.id`,
      relationship: `belongsTo`
    }
  },
  preAggregations: {
    rollupByDay: {
      type: `rollup`,
      measureReferences: [count],
      dimensionReferences: [StoriesPreAgg.category],
      granularity: `day`,
      timeDimensionReference: time,
      external: true
    }
  }
});
