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

Home.propTypes = {
  token: PropTypes.string,
};

export async function getServerSideProps(ctx) {
  const token = getAuthCookie(ctx.req);
  return { props: { token: token || null } };
}
