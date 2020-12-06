import PropTypes from 'prop-types';
import { gql } from 'graphql-request';

import Layout from '../components/Layout';
import client from '../utils/graphql-client';
import useUser from '../utils/hooks/useUser';
import { getAuthCookie } from '../utils/auth-cookie';

const mutation = gql`
mutation createLink($url: String!, $description: String!, $postedBy: ID!) {
  createLink(data: { url: $url, description: $description, postedBy: { connect: $postedBy } }) {
    url
    description
    postedBy {
      _id
    }
  }
}
`;

export default function Submit({ token }) {

  const { data: user } = useUser();

  async function handleSubmit(evt) {
    evt.preventDefault();
    const form = new FormData(evt.target);
    try {
      await client(token).request(
        mutation,
        {
          url: form.get('url'),
          description: form.get('description'),
          postedBy: user && user.id,
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
