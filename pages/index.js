import useSWR from 'swr';
import { gql } from 'graphql-request';

import Layout from '../components/Layout';

import agent from '../utils/graphql-client';

const fetcher = async (query) => await agent.request(query);

export default function Home() {
  const { data, error } = useSWR(
    gql`
      {
        feeds(_size: 30) {
          data {
            _id
            url
            description
          }
        }
      }
    `,
    fetcher,
  );

  if (error) return <div>Failed to load feeds</div>;

  return (
    <Layout>
      {
        data
          ? (
            <ul className="list-none">
              {data.feeds.data.map((link) => (
                <li key={link._id}>
                  <a rel="noreferrer" target="_blank" href={`https://${link.url}`}>{link.description}</a>
                  <small className="text-gray-600">({link.url})</small>
                </li>
              ))}
            </ul>
          )
          : 'Loading...'
      }
    </Layout>
  )
}
