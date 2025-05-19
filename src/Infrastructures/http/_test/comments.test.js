const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');
const container = require('../../container');
const LikesCommentTableTestHelper = require('../../../../tests/LikesCommentTableTestHelper');

describe('/threads endpoint', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST comments', () => {
    it('should response 400 when request payload not contain needed property', async () => {
      await UsersTableTestHelper.addUser({
        username: 'dicoding',
      });

      await ThreadsTableTestHelper.addThread({
        title: 'Title Thread',
      });

      const userPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      const requestPayload = {
        comment: {
          comment: 'ini adalah komentar',
        },
      };

      const server = await createServer(container);

      const authUser = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: userPayload,
      });

      const responseUserJson = JSON.parse(authUser.payload);
      const accessToken = responseUserJson.data.accessToken;

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak ada'
      );
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      await UsersTableTestHelper.addUser({
        username: 'dicoding',
      });

      await ThreadsTableTestHelper.addThread({
        title: 'Title Thread',
      });

      const userPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      const requestPayload = {
        content: {
          comment: 'ini adalah komentar',
        },
      };

      const server = await createServer(container);

      const authUser = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: userPayload,
      });

      const responseUserJson = JSON.parse(authUser.payload);
      const accessToken = responseUserJson.data.accessToken;

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat komentar baru karena tipe data tidak sesuai'
      );
    });

    it('should response 404 when thread not found', async () => {
      await UsersTableTestHelper.addUser({
        username: 'dicoding',
      });

      await ThreadsTableTestHelper.addThread({
        title: 'Title Thread',
      });

      const userPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      const requestPayload = {
        content: 'Ini adalah komentar',
      };

      const server = await createServer(container);

      const authUser = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: userPayload,
      });

      const responseUserJson = JSON.parse(authUser.payload);
      const accessToken = responseUserJson.data.accessToken;

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-234/comments',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });

    it('should response 201 and persisted comment', async () => {
      await UsersTableTestHelper.addUser({
        username: 'dicoding',
      });

      await ThreadsTableTestHelper.addThread({
        title: 'Title Thread',
      });

      const userPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      const requestPayload = {
        content: 'Ini adalah komentar',
      };

      const server = await createServer(container);

      const authUser = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: userPayload,
      });

      const responseUserJson = JSON.parse(authUser.payload);
      const accessToken = responseUserJson.data.accessToken;

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });
  });

  describe('when DELETE comments', () => {
    it('should throw error when the user did not have authorization', async () => {
      await UsersTableTestHelper.addUser({
        username: 'dicoding',
      });

      await UsersTableTestHelper.addUser({
        id: 'user-234',
        username: 'Cheevin',
      });

      await ThreadsTableTestHelper.addThread({
        title: 'Title Thread',
      });

      await CommentTableTestHelper.addComment({
        ownerId: 'user-234',
        registerComment: {
          content: 'Ini adalah komentar',
        },
      });

      const userPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      const server = await createServer(container);

      const authUser = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: userPayload,
      });

      const responseUserJson = JSON.parse(authUser.payload);
      const accessToken = responseUserJson.data.accessToken;

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
    });

    it('should throw error when thread not found', async () => {
      await UsersTableTestHelper.addUser({
        username: 'dicoding',
      });

      await ThreadsTableTestHelper.addThread({
        title: 'Title Thread',
      });

      await CommentTableTestHelper.addComment({
        registerComment: {
          content: 'Ini adalah komentar',
        },
      });

      const userPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      const server = await createServer(container);

      const authUser = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: userPayload,
      });

      const responseUserJson = JSON.parse(authUser.payload);
      const accessToken = responseUserJson.data.accessToken;

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-234/comments/comment-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });

    it('should throw error when comment not found', async () => {
      await UsersTableTestHelper.addUser({
        username: 'dicoding',
      });

      await ThreadsTableTestHelper.addThread({
        title: 'Title Thread',
      });

      await CommentTableTestHelper.addComment({
        registerComment: {
          content: 'Ini adalah komentar',
        },
      });

      const userPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      const server = await createServer(container);

      const authUser = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: userPayload,
      });

      const responseUserJson = JSON.parse(authUser.payload);
      const accessToken = responseUserJson.data.accessToken;

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-234',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });

    it('should soft delete when user access delete point', async () => {
      await UsersTableTestHelper.addUser({
        username: 'dicoding',
      });

      await ThreadsTableTestHelper.addThread({
        title: 'Title Thread',
      });

      await CommentTableTestHelper.addComment({
        registerComment: {
          content: 'Ini adalah komentar',
        },
      });

      const userPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      const server = await createServer(container);

      const authUser = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: userPayload,
      });

      const responseUserJson = JSON.parse(authUser.payload);
      const accessToken = responseUserJson.data.accessToken;

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');

      const comment = await CommentTableTestHelper.getCommentById(
        'comment-123'
      );
      expect(comment[0].isDelete).toBe(true);
    });
  });

  describe('when replies comment', () => {
    it('should be return 200 when success', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
      });

      await UsersTableTestHelper.addUser({
        id: 'user-234',
        username: 'cheevin',
      });

      await ThreadsTableTestHelper.addThread({
        title: 'Title Thread',
      });

      await CommentTableTestHelper.addComment({
        registerComment: {
          content: 'Ini adalah komentar',
        },
      });

      const userPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      const requestPayload = {
        content: 'Ini adalah komentar dicoding',
      };

      const server = await createServer(container);

      const authUser = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: userPayload,
      });

      const responseUserJson = JSON.parse(authUser.payload);
      const accessToken = responseUserJson.data.accessToken;

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const userPayload2 = {
        username: 'cheevin',
        password: 'secret',
      };

      const requestPayload2 = {
        content: 'Ini adalah komentar cheevin',
      };

      const authUser2 = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: userPayload2,
      });

      const responseUser2Json = JSON.parse(authUser2.payload);
      const accessToken2 = responseUser2Json.data.accessToken;

      const response2 = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: requestPayload2,
        headers: {
          Authorization: `Bearer ${accessToken2}`,
        },
      });

      const getThread = await server.inject({
        method: 'GET',
        url: '/threads/thread-123',
      });

      expect(response.statusCode).toBe(201);
      expect(response2.statusCode).toBe(201);
      expect(getThread.statusCode).toBe(200);
    });
  });

  describe('when delete replies', () => {
    it('should implemented soft delete when replies have deleted', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
      });

      await UsersTableTestHelper.addUser({
        id: 'user-234',
        username: 'cheevin',
      });

      await ThreadsTableTestHelper.addThread({
        title: 'Title Thread',
      });

      await CommentTableTestHelper.addComment({
        registerComment: {
          content: 'Ini adalah komentar',
        },
      });

      const userPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      const requestPayload = {
        content: 'Ini adalah komentar dicoding',
      };

      const server = await createServer(container);

      const authUser = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: userPayload,
      });

      const responseUserJson = JSON.parse(authUser.payload);
      const accessToken = responseUserJson.data.accessToken;

      const responseUser = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const userPayload2 = {
        username: 'cheevin',
        password: 'secret',
      };

      const requestPayload2 = {
        content: 'Ini adalah komentar cheevin',
      };

      const authUser2 = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: userPayload2,
      });

      const responseUser2Json = JSON.parse(authUser2.payload);
      const accessToken2 = responseUser2Json.data.accessToken;

      const responseUser2 = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: requestPayload2,
        headers: {
          Authorization: `Bearer ${accessToken2}`,
        },
      });

      const replyUser2Id = JSON.parse(responseUser2.payload).data.addedReply.id;

      const responseDelete = await server.inject({
        method: 'DELETE',
        url: `/threads/thread-123/comments/comment-123/replies/${replyUser2Id}`,
        headers: {
          Authorization: `Bearer ${accessToken2}`,
        },
      });

      const getThread = await server.inject({
        method: 'GET',
        url: '/threads/thread-123',
      });

      const responseJson = JSON.parse(responseDelete.payload);

      expect(responseUser.statusCode).toBe(201);
      expect(responseUser2.statusCode).toBe(201);
      expect(responseDelete.statusCode).toBe(200);
      expect(responseJson.status).toBe('success');
      expect(getThread.statusCode).toBe(200);
    });
  });

  describe('when likes comment', () => {
    it('should be error when unauthorized', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
      });

      await ThreadsTableTestHelper.addThread({
        title: 'Title Thread',
      });

      await CommentTableTestHelper.addComment({
        registerComment: {
          content: 'Ini adalah komentar',
        },
      });

      const server = await createServer(container);

      const responseUser = await server.inject({
        method: 'PUT',
        url: '/threads/thread-123/comments/comment-123/likes',
      });

      expect(responseUser.statusCode).toBe(401);
    });

    it('should throw error when thread not found', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
      });

      await ThreadsTableTestHelper.addThread({
        title: 'Title Thread',
      });

      await CommentTableTestHelper.addComment({
        registerComment: {
          content: 'Ini adalah komentar',
        },
      });

      const userPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      const server = await createServer(container);

      const authUser = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: userPayload,
      });

      const responseUserJson = JSON.parse(authUser.payload);
      const accessToken = responseUserJson.data.accessToken;

      const responseUser = await server.inject({
        method: 'PUT',
        url: '/threads/thread-234/comments/comment-123/likes',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const response = JSON.parse(responseUser.payload);
      expect(responseUser.statusCode).toBe(404);
      expect(response.status).toBe('fail');
    });

    it('should throw error when comment not found', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
      });

      await ThreadsTableTestHelper.addThread({
        title: 'Title Thread',
      });

      await CommentTableTestHelper.addComment({
        registerComment: {
          content: 'Ini adalah komentar',
        },
      });

      const userPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      const server = await createServer(container);

      const authUser = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: userPayload,
      });

      const responseUserJson = JSON.parse(authUser.payload);
      const accessToken = responseUserJson.data.accessToken;

      const responseUser = await server.inject({
        method: 'PUT',
        url: '/threads/thread-123/comments/comment-234/likes',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const response = JSON.parse(responseUser.payload);
      expect(responseUser.statusCode).toBe(404);
      expect(response.status).toBe('fail');
    });

    it('should be return 200 when success', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
      });

      await ThreadsTableTestHelper.addThread({
        title: 'Title Thread',
      });

      await CommentTableTestHelper.addComment({
        registerComment: {
          content: 'Ini adalah komentar',
        },
      });

      const userPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      const server = await createServer(container);

      const authUser = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: userPayload,
      });

      const responseUserJson = JSON.parse(authUser.payload);
      const accessToken = responseUserJson.data.accessToken;

      const responseUser = await server.inject({
        method: 'PUT',
        url: '/threads/thread-123/comments/comment-123/likes',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const response = JSON.parse(responseUser.payload);
      expect(responseUser.statusCode).toBe(200);
      expect(response.status).toBe('success');
    });

    it('should change the likeCount when success', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
      });

      await UsersTableTestHelper.addUser({
        id: 'user-234',
        username: 'cheevin',
      });

      await ThreadsTableTestHelper.addThread({
        title: 'Title Thread',
      });

      await CommentTableTestHelper.addComment({
        registerComment: {
          content: 'Ini adalah komentar',
        },
      });

      await CommentTableTestHelper.addComment({
        commentId: 'comment-234',
        ownerId: 'user-234',
        registerComment: {
          content: 'Ini adalah komentar',
        },
      });

      const userPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      const server = await createServer(container);

      const authUser = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: userPayload,
      });

      const responseUserJson = JSON.parse(authUser.payload);
      const accessToken = responseUserJson.data.accessToken;

      await server.inject({
        method: 'PUT',
        url: '/threads/thread-123/comments/comment-123/likes',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const getThread = await server.inject({
        method: 'GET',
        url: '/threads/thread-123',
      });

      const response = JSON.parse(getThread.payload);

      expect(response.status).toBe('success');
      expect(response.data.thread.comments[0].likeCount).toBe(1);
    });

    it('should remove like when user has liked the comment', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
      });

      await UsersTableTestHelper.addUser({
        id: 'user-234',
        username: 'cheevin',
      });

      await ThreadsTableTestHelper.addThread({
        title: 'Title Thread',
      });

      await CommentTableTestHelper.addComment({
        registerComment: {
          content: 'Ini adalah komentar',
        },
      });

      LikesCommentTableTestHelper.addLike({ owner: 'user-123' });
      LikesCommentTableTestHelper.addLike({ owner: 'user-234' });

      await CommentTableTestHelper.addComment({
        commentId: 'comment-234',
        ownerId: 'user-234',
        registerComment: {
          content: 'Ini adalah komentar',
        },
      });

      const userPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      const server = await createServer(container);

      const authUser = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: userPayload,
      });

      const responseUserJson = JSON.parse(authUser.payload);
      const accessToken = responseUserJson.data.accessToken;

      await server.inject({
        method: 'PUT',
        url: '/threads/thread-123/comments/comment-123/likes',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const getThread = await server.inject({
        method: 'GET',
        url: '/threads/thread-123',
      });

      const response = JSON.parse(getThread.payload);

      expect(response.status).toBe('success');
      expect(response.data.thread.comments[0].likeCount).toBe(1);
    });
  });
});
