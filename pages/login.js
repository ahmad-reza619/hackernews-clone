import Link from 'next/link';

import Layout from '../components/Layout';

export default function Login() {
  return (
    <Layout>
      <form>
        <div className="p-1 m-2">
          <input
            type="text"
            placeholder="email"
            className="border"
          />
        </div>
        <div className="p-1 m-2">
          <input
            type="password"
            placeholder="password"
            className="border"
          />
        </div>
        <div className="m-2">
          <button className="p-1 bg-gray-400" type="submit">
            Submit
          </button>
        </div>
        <div className="p-1 m-2">
          <Link href="/signup">
            <a>Don&apos;t have account?</a>
          </Link>
        </div>
      </form>
    </Layout>
  );
}
