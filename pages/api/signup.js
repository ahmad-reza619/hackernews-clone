import { query as q } from 'faunadb';
import { guestClient } from '../../utils/fauna-client';
import { setAuthCookie } from '../../utils/auth-cookie';

export default async function signup(req, res) {
  const { email, password } = req.body;
  console.log({ email, password });

  if (!email || !password) {
    return res.status(400).send('Email and password not provided');
  }

  try {
    const existingEmail = await guestClient.query(
      // Exist return boolean, and Casefold return lowcase string
      q.Exists(q.Match(q.Index('user_by_email'), q.Casefold(email)))
    )

    if (existingEmail) {
      return res.status(400).send(`email ${email} already exist`);
    }

    const user = await guestClient.query(
      q.Create(
        q.Collection('User'),
        {
          credentials: { password },
          data: { email },
        }
      )
    )

    if (!user.ref) {
      return res.status(404).send('user ref is missing');
    }

    const auth = await guestClient.query(
      q.Login(user.ref, {
        password,
      })
    )

    if (!auth.secret) {
      return res.status(404).send('auth secret is missing');
    }

    setAuthCookie(res, auth.secret);

    res.status(200).end();
  } catch (error) {
    console.error(error);
    res.status(error.requestResult.statusCode).send(error.message)
  }
}
