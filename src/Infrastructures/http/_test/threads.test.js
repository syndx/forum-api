const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');
const container = require('../../container');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      const userPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      const requestPayload = {
        title: 'Thread title',
        body: 'Thread Body',
      };

      const server = await createServer(container);

      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      const authUser = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: userPayload,
      });

      // get user token
      const responseUserJson = JSON.parse(authUser.payload);
      const accessToken = responseUserJson.data.accessToken;

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      const userPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      const requestPayload = {
        title: 'Thread title',
      };

      const server = await createServer(container);

      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // get user token
      const authUser = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: userPayload,
      });

      const responseUserJson = JSON.parse(authUser.payload);
      const accessToken = responseUserJson.data.accessToken;

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada'
      );
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      const userPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      const requestPayload = {
        title: 123,
        body: 'Thread Body',
      };

      const server = await createServer(container);

      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // get user token
      const authUser = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: userPayload,
      });

      const responseUserJson = JSON.parse(authUser.payload);
      const accessToken = responseUserJson.data.accessToken;

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat thread baru karena tipe data tidak sesuai'
      );
    });

    it('should response 401 if unauthorized', async () => {
      await UsersTableTestHelper.addUser({ username: 'dicoding' });

      const requestPayload = {
        title: 'Thread title',
        body: 'Thread Body',
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
      });

      expect(response.statusCode).toEqual(401);
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should throw error when thread not found', async () => {
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ title: 'Thread title' });

      const server = await createServer(container);

      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-234',
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });

    it('should response 200 when thread found and return all comments', async () => {
      await UsersTableTestHelper.addUser({ username: 'dicoding' });

      await UsersTableTestHelper.addUser({
        id: 'user-234',
        username: 'cheevin',
      });

      await ThreadsTableTestHelper.addThread({ title: 'Thread title' });

      await CommentTableTestHelper.addComment({
        commentId: 'comment-123',
        registerComment: {
          content: 'Ini adalah Komentar 1',
        },
      });

      await CommentTableTestHelper.addComment({
        commentId: 'comment-234',
        ownerId: 'user-234',
        registerComment: {
          content: 'Ini adalah Komentar 2',
        },
      });

      await CommentTableTestHelper.addComment({
        commentId: 'comment-345',
        registerComment: {
          content: 'Ini adalah Komentar 3',
        },
      });

      const server = await createServer(container);

      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-123',
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toBe(200);
      expect(responseJson.status).toBe('success');
    });
  });
});
