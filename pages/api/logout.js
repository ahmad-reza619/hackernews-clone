import { query as q } from 'faunadb';
import { authClient } from '../../utils/fauna-client';
import { getAuthCookie, removeAuthCookie } from '../../utils/auth-cookie';

export default async function logout(req, res) {
  const token = getAuthCookie(req);

  // Already logged out
  if (!token) return res.status(200).end();

  try {
    await authClient(token).query(q.Logout(false));
    removeAuthCookie(res);
    res.status(200).end();
  } catch (error) {
    console.error(error);
    res.status(error.requestResult.statusCode).send(error.message);
  }
}

