import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Layout from '../components/Layout';

export default function Signup() {
  const [errors, setErrors] = useState(null);
  const router = useRouter();

  async function handleSignup(evt) {
    evt.preventDefault();
    const form = new FormData(evt.target);
    if (form.get('password') !== form.get('password_c')) {
      return setErrors('Password not match');
    }
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.get('email'),
          password: form.get('password'),
        }),
      });
      if (!res.ok) {
        console.log(res);
        throw new Error(await res.text());
      }
      router.push('/')
    } catch (error) {
      console.error(error.message);
      setErrors(error.message);
    }
  }
  return (
    <Layout>
      {errors && <div className="p-1 bg-red-500">{errors}</div>}
      <form onSubmit={handleSignup}>
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
        <div className="p-1 m-2">
          <input
            type="password"
            name="password_c"
            placeholder="password confirmation"
            className="border"
          />
        </div>
        <div className="m-2">
          <button className="p-1 bg-gray-400" type="submit">
            Submit
          </button>
        </div>
        <div className="p-1 m-2">
          <Link href="/login">
            <a>Already have an account?</a>
          </Link>
        </div>
      </form>
    </Layout>
  );
}
