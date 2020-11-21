import Head from 'next/head';
import Link from 'next/link';

import useSWR from 'swr';
import { gql } from 'graphql-request';

import agent from '../utils/graphql-client';

const fetcher = async (query) => await agent.request(query);

const separator = <span>|</span>

export default function Home() {
  const { data, error } = useSWR(
    gql`
      {
        feeds {
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
          <Link href="/login">
            <a className="cursor-pointer">login</a>
          </Link>
        </nav>
        <main className="p-2">
          {
            data
              ? (
                <ul className="list-none">
                  {data.feeds.data.map((link) => (
                    <li>{link.description} <small className="text-gray-600">({link.url})</small></li>
                  ))}
                </ul>
              )
              : 'Loading...'
          }
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
  )
}
