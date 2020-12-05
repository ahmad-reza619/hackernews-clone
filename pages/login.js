import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Layout from '../components/Layout';

export default function Login() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');

  async function onSubmit(evt) {
    evt.preventDefault();
    setErrorMessage('');

    const formdata = new FormData(evt.currentTarget);
    const plainFormData = Object.fromEntries(formdata.entries());
    const formDataAsJsonString = JSON.stringify(plainFormData);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: formDataAsJsonString,
      });

      if (res.ok) {
        router.push('/');
      } else {
        throw new Error(await res.text());
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    }
  }

  return (
    <Layout>
      <form onSubmit={onSubmit}>
        {
          errorMessage &&
          <div>{errorMessage}</div>
        }
        <div className="p-1 m-2">
          <input
            type="email"
            name="email"
            placeholder="email"
            className="border"
          />
        </div>
        <div className="p-1 m-2">
          <input
            type="password"
            name="password"
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
