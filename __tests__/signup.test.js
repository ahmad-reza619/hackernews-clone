import { createMocks } from 'node-mocks-http';

import { guestClient } from '../utils/fauna-client';

import signupApi from '../pages/api/signup';

jest.mock('../utils/fauna-client');;

describe('/api/signup', () => {
  const makeMock = ({ email, password } = {}) => createMocks({
    method: 'POST',
    body: {
      email,
      password,
    },
  });
  test('returns error if email not provided', async () => {
    const { req, res } = makeMock();

    await signupApi(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getData()).toBe('Email and password not provided');
  })
  test('returns error if password not provided', async () => {
    const { req, res } = makeMock({
      email: 'hey',
    });

    await signupApi(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getData()).toBe('Email and password not provided');
  })
  test('returns error if user already exist', async () => {
    const { req, res } = makeMock({
      email: 'hey',
      password: 'bah',
    });

    guestClient.query.mockReturnValueOnce(true);

    await signupApi(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getData()).toBe('email hey already exist');
  })
  test('returns error if somehow user ref missing', async () => {
    const { req, res } = makeMock({
      email: 'hey',
      password: 'bah',
    });

    guestClient.query
      .mockReturnValueOnce(false)
      .mockReturnValueOnce({ ref: null });

    await signupApi(req, res);

    expect(res._getStatusCode()).toBe(404);
    expect(res._getData()).toBe('user ref is missing');
  })
  test('returns error if there is no secret for user', async () => {
    const { req, res } = makeMock({
      email: 'hey',
      password: 'bah',
    });

    guestClient.query
      .mockReturnValueOnce(false)
      .mockReturnValueOnce({ ref: 'hi' })
      .mockReturnValueOnce({ secret: null });

    await signupApi(req, res);

    expect(res._getStatusCode()).toBe(404);
    expect(res._getData()).toBe('auth secret is missing');
  })
  test('returns 200 code if there is no problem', async () => {
    const { req, res } = makeMock({
      email: 'hey',
      password: 'bah',
    });

    guestClient.query
      .mockReturnValueOnce(false)
      .mockReturnValueOnce({ ref: 'hi' })
      .mockReturnValueOnce({ secret: '123' });

    await signupApi(req, res);

    expect(res._getStatusCode()).toBe(200);
  })
})
