import { gql } from 'graphql-request';

import Layout from '../components/Layout';
import client from '../utils/graphql-client';

const mutation = gql`
mutation createLink($url: String!, $description: String!) {
  createLink(data: { url: $url, description: $description }) {
    url
    description
  }
}
`;

export default function Submit() {
  async function handleSubmit(evt) {
    evt.preventDefault();
    const form = new FormData(evt.target);
    try {
      await client.request(
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
        <input
          name="url"
          placeholder="url"
          className="block p-1 m-2 border"
        />
        <input
          name="description"
          placeholder="description"
          className="block p-1 m-2 border"
        />
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
