import PropTypes from 'prop-types';
import { gql } from 'graphql-request';

import Layout from '../components/Layout';
import client from '../utils/graphql-client';
import { getAuthCookie } from '../utils/auth-cookie';

const mutation = gql`
mutation createLink($url: String!, $description: String!) {
  createLink(data: { url: $url, description: $description }) {
    url
    description
  }
}
`;

export default function Submit({ token }) {
  async function handleSubmit(evt) {
    evt.preventDefault();
    const form = new FormData(evt.target);
    try {
      await client(token).request(
        mutation,
        {
          url: form.get('url'),
          description: form.get('description'),
        },
      )
    } catch (e) {
      console.error(e);
    }
  }
  return (
    <Layout>
      <form onSubmit={handleSubmit}>
        <div className="p-1 m-2">
          <input
            name="url"
            placeholder="url"
            className="border"
          />
        </div>
        <div className="p-1 m-2">
          <input
            name="description"
            placeholder="description"
            className="border"
          />
        </div>
        <button
          type="submit"
          className="p-1 m-2 bg-gray-400"
        >
          Submit
        </button>
      </form>
    </Layout>
  );
}

Submit.propTypes = {
  token: PropTypes.string,
};

export async function getServerSideProps(ctx) {
  const token = getAuthCookie(ctx.req);
  return { props: { token: token || null } };
}
