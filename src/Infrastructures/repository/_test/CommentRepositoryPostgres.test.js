const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const RegisterComment = require('../../../Domains/comments/entities/RegisterComment');
const RegisteredComment = require('../../../Domains/comments/entities/RegisteredComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await CommentTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist register comment and return registered comment correctly', async () => {
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadTableTestHelper.addThread({ title: 'Thread title' });

      const registerComment = new RegisterComment({
        content: 'Ini adalah komentar',
      });
      const ownerId = 'user-123';
      const threadId = 'thread-123';
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      await commentRepositoryPostgres.addComment(
        threadId,
        ownerId,
        registerComment
      );

      const comments = await CommentTableTestHelper.getCommentById(
        'comment-123'
      );

      expect(comments).toHaveLength(1);
    });

    it('should return registered comment correctly', async () => {
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadTableTestHelper.addThread({ title: 'Thread title' });

      const registerComment = new RegisterComment({
        content: 'Ini adalah komentar',
      });
      const ownerId = 'user-123';
      const threadId = 'thread-123';
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      const registeredComment = await commentRepositoryPostgres.addComment(
        threadId,
        ownerId,
        registerComment
      );

      expect(registeredComment).toStrictEqual(
        new RegisteredComment({
          id: 'comment-123',
          content: 'Ini adalah komentar',
          owner: ownerId,
        })
      );
    });
  });

  describe('getCommentById function', () => {
    it('should throw an error when failed to find a comment', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(
        commentRepositoryPostgres.getCommentById('comment-123')
      ).rejects.toThrowError(NotFoundError);
    });

    it('should return a comment correctly', async () => {
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadTableTestHelper.addThread({ title: 'Thread title' });
      await CommentTableTestHelper.addComment({
        registerComment: {
          content: 'Ini adalah Komentar',
        },
        date: '2025-05-07T08:45:15.235Z',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const comment = await commentRepositoryPostgres.getCommentById(
        'comment-123'
      );

      expect(comment).toEqual({
        id: 'comment-123',
        thread: 'thread-123',
        owner: 'user-123',
        content: 'Ini adalah Komentar',
        parents: null,
        isDelete: false,
        date: new Date('2025-05-07T08:45:15.235Z'),
      });
    });
  });

  describe('verifyOwner function', () => {
    it('should throw error when not authorize', async () => {
      await UsersTableTestHelper.addUser({ username: 'dicoding' });

      await UsersTableTestHelper.addUser({
        id: 'user-234',
        username: 'cheevin',
      });

      await ThreadTableTestHelper.addThread({ title: 'Thread title' });

      await CommentTableTestHelper.addComment({
        commentId: 'comment-123',
        registerComment: {
          content: 'Ini adalah Komentar 1',
        },
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await expect(
        commentRepositoryPostgres.verifyOwner('comment-123', 'user-234')
      ).rejects.toThrowError(AuthorizationError);
    });

    it('should pass when its owner', async () => {
      await UsersTableTestHelper.addUser({ username: 'dicoding' });

      await UsersTableTestHelper.addUser({
        id: 'user-234',
        username: 'cheevin',
      });

      await ThreadTableTestHelper.addThread({ title: 'Thread title' });

      await CommentTableTestHelper.addComment({
        commentId: 'comment-123',
        registerComment: {
          content: 'Ini adalah Komentar 1',
        },
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await expect(
        commentRepositoryPostgres.verifyOwner('comment-123', 'user-123')
      ).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('verifyCommentAvailability function', () => {
    it('should throw an error when failed to find a comment', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(
        commentRepositoryPostgres.verifyCommentAvailability('comment-123')
      ).rejects.toThrowError(NotFoundError);
    });

    it('should not throw an error when success to find a thread', async () => {
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadTableTestHelper.addThread({ title: 'Thread title' });
      await CommentTableTestHelper.addComment({
        registerComment: {
          content: 'Ini adalah Komentar 1',
        },
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(
        commentRepositoryPostgres.verifyCommentAvailability('comment-123')
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('getCommentByThread', () => {
    it('should return comments by thread id', async () => {
      await UsersTableTestHelper.addUser({ username: 'dicoding' });

      await UsersTableTestHelper.addUser({
        id: 'user-234',
        username: 'cheevin',
      });

      await ThreadTableTestHelper.addThread({ title: 'Thread title' });

      await CommentTableTestHelper.addComment({
        commentId: 'comment-123',
        registerComment: {
          content: 'Ini adalah Komentar 1',
        },
        date: '2025-05-07T11:49:06.063Z',
      });
      await CommentTableTestHelper.addComment({
        commentId: 'comment-234',
        ownerId: 'user-234',
        registerComment: {
          content: 'Ini adalah Komentar 2',
        },
        date: '2025-05-07T11:49:10.063Z',
      });

      const fakeIdGenerator = () => '123';

      const commentRepository = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      const comments = await commentRepository.getCommentByThreadId(
        'thread-123'
      );

      expect(comments.length).toEqual(2);
      expect(comments).toEqual([
        {
          id: 'comment-123',
          username: 'dicoding',
          date: new Date('2025-05-07T11:49:06.063Z'),
          parents: null,
          content: 'Ini adalah Komentar 1',
          isDelete: false,
        },
        {
          id: 'comment-234',
          username: 'cheevin',
          date: new Date('2025-05-07T11:49:10.063Z'),
          parents: null,
          content: 'Ini adalah Komentar 2',
          isDelete: false,
        },
      ]);
    });
  });

  describe('deleteComment', () => {
    it('should throw error when user is not the owner', async () => {
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadTableTestHelper.addThread({ title: 'Thread title' });
      await CommentTableTestHelper.addComment({
        registerComment: {
          content: 'Ini adalah Komentar',
        },
      });

      const commentId = 'comment-123';
      const falseUser = 'user-234';
      const fakeIdGenerator = () => '123';

      const commentRepository = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      await expect(
        commentRepository.verifyOwner(commentId, falseUser)
      ).rejects.toThrow(AuthorizationError);
    });

    it('should soft delete comment', async () => {
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadTableTestHelper.addThread({ title: 'Thread title' });
      await CommentTableTestHelper.addComment({
        registerComment: {
          content: 'Ini adalah Komentar',
        },
      });

      const commentId = 'comment-123';
      const user = 'user-123';
      const fakeIdGenerator = () => '123';

      const commentRepository = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      await commentRepository.verifyOwner(commentId, user);
      await commentRepository.deleteComment('comment-123');

      const comment = await CommentTableTestHelper.getCommentById(
        'comment-123'
      );
      expect(comment[0].isDelete).toBe(true);
    });
  });
});
