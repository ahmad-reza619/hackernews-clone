import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';

import PropTypes from 'prop-types';

import useUser from '../../utils/hooks/useUser';

const separator = <span>|</span>;

export default function Layout({
  children,
}) {

  const router = useRouter();

  const {
    data: user,
    mutate: mutateUser,
  } = useUser();

  async function logout() {
    const res = await fetch('/api/logout');
    if (res.ok) {
      mutateUser(null);
      router.push('/login');
    }
  }

  return (
    <>
      <Head>
        <title>
          Hacker News
        </title>
      </Head>
      <div className="max-w-6xl mx-auto mt-4 bg-orange-100">
        <nav className="flex px-4 list-none bg-orange-600">
          <Link href="/" >
            <a className="font-bold cursor-pointer">Hacker News</a>
          </Link>
          <div className="flex-1 mx-2">
            <Link href="/new">
              <a className="mx-1">new</a>
            </Link>
            {separator}
            <Link href="/top">
              <a className="mx-1">top</a>
            </Link>
            {separator}
            <Link href="/submit">
              <a className="mx-1">submit</a>
            </Link>
          </div>
          {
            user ? (
              <button onClick={logout}>logout</button>
            ) : (
              <Link href="/login">
                <a className="cursor-pointer">login</a>
              </Link>
            )
          }
        </nav>
        <main className="p-2">
          {children}
        </main>
        <div className="h-1 bg-orange-600" />
        <footer>
          <div className="flex justify-center w-full my-4">
            <Link href="/contact">
              <a>Contact</a>
            </Link>
          </div>
          <div className="flex justify-center w-full my-4">
            <span className="mr-4">Search:</span>
            <input className="border border-gray-600 rounded" />
          </div>
        </footer>
      </div>
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.any,
};

Layout.defaultProps = {
  children: null,
};
