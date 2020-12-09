import useSWR from 'swr';
import PropTypes from 'prop-types';
import { gql } from 'graphql-request';

import Layout from '../components/Layout';

import agent from '../utils/graphql-client';
import { getAuthCookie } from '../utils/auth-cookie';

export default function Home({ token }) {
  const fetcher = async (query) => await agent(token).request(query);
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
                  }
                  <div className="mr-1 text-gray-600 cursor-pointer">▲</div>
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

Home.propTypes = {
  token: PropTypes.string,
};

export async function getServerSideProps(ctx) {
  const token = getAuthCookie(ctx.req);
  return { props: { token: token || null } };
}
