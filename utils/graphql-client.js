import { GraphQLClient } from 'graphql-request';

const endpoint = 'https://graphql.fauna.com/graphql';

export default (token) => {
  const secret = token || process.env.NEXT_PUBLIC_FAUNA_SECRET;
  return new GraphQLClient(
    endpoint,
    {
      headers: {
        authorization: `Bearer ${secret}`,
      },
    },
  );
}
