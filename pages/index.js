import useSWR from 'swr';
import { gql } from 'graphql-request';

import Layout from '../components/Layout';

import useUser from '../utils/hooks/useUser';
import agent from '../utils/graphql-client';

const voteMutation = gql`
mutation createVote($user: ID!, $link: ID!) {
  createVote(data: { user: { connect: $user }, link: { connect: $link } }) {
    _id
  }
}
`;

export default function Home() {
  const fetcher = async (query) => await agent().request(query);
  const { data: user } = useUser();
  const { data, error } = useSWR(
    gql`
      {
        feeds(_size: 30) {
          data {
            _id
            url
            description
            postedBy {
              email
            }
            votes {
              data {
                _id
              }
            }
          }
        }
      }
    `,
    fetcher,
  );

  function onVote(linkIndex) {
    const link = data.feeds.data[linkIndex];
    return () => {
      agent().request(
        voteMutation,
        {
          link: link && link._id,
          user: user && user.id,
        },
      )
    };
  }

  if (error) return <div>Failed to load feeds</div>;

  return (
    <Layout>
      {
        data
          ? (
            <ul className="list-none">
              {data.feeds.data.map((link, index) => (
                <li className="flex " key={link._id}>
                  <div className="mr-1 text-gray-600">{index + 1}.</div>
                  {
                    user &&
                    <div
                      className="mr-1 text-gray-600 cursor-pointer"
                      onClick={onVote(index)}
                    >
                      ▲
                    </div>
                  }
                  <div>
                    <a rel="noreferrer" target="_blank" href={`https://${link.url}`}>{link.description}</a>
                    <small className="text-gray-600">({link.url})</small>
                    <small className="block text-gray-600">{link.votes.data.length} votes by {link.postedBy.email}</small>
                  </div>
                </li>
              ))}
            </ul>
          )
          : 'Loading...'
      }
    </Layout>
  )
}
