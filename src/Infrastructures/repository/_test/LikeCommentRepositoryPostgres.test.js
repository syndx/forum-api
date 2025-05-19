const LikeCommentRepository = require('../LikeCommentRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const LikesCommentTableTestHelper = require('../../../../tests/LikesCommentTableTestHelper');
const pool = require('../../database/postgres/pool');

describe('Like Comment Repository Postgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await CommentTableTestHelper.cleanTable();
    await LikesCommentTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addLike function', () => {
    it('should persist register like', async () => {
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadTableTestHelper.addThread({ title: 'Thread Title' });
      await CommentTableTestHelper.addComment({
        registerComment: {
          content: 'Ini adalah komentar',
        },
      });

      const payload = {
        owner: 'user-123',
        commentId: 'comment-123',
      };

      const likeCommentRepositoryPostgres = new LikeCommentRepository(pool);

      await likeCommentRepositoryPostgres.addLike(payload);

      const likes = await LikesCommentTableTestHelper.getLikeByCommentId(
        payload.commentId
      );

      expect(likes).toEqual(1);
    });
  });

  describe('getLike function', () => {
    it('should return the total likes of comment', async () => {
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await UsersTableTestHelper.addUser({
        id: 'user-234',
        username: 'cheevin',
      });
      await ThreadTableTestHelper.addThread({ title: 'Thread Title' });
      await CommentTableTestHelper.addComment({
        registerComment: {
          content: 'Ini adalah komentar',
        },
      });
      await LikesCommentTableTestHelper.addLike({ owner: 'user-123' });
      await LikesCommentTableTestHelper.addLike({ owner: 'user-234' });

      const likeCommentRepositoryPostgres = new LikeCommentRepository(pool);
      const likes = await likeCommentRepositoryPostgres.getLikeByCommentId(
        'comment-123'
      );

      expect(likes).toEqual(2);
    });

    it('should return 0 when user has not liked the comment', async () => {
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadTableTestHelper.addThread({ title: 'Thread Title' });
      await CommentTableTestHelper.addComment({
        registerComment: {
          content: 'Ini adalah komentar',
        },
      });

      const likeCommentRepositoryPostgres = new LikeCommentRepository(pool);
      const likes = await likeCommentRepositoryPostgres.getLikeByCommentId(
        'comment-123'
      );

      expect(likes).toEqual(0);
    });
  });

  describe('checkCommentHasLike function', () => {
    it('should return total like if user has liked the comment', async () => {
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadTableTestHelper.addThread({ title: 'Thread Title' });
      await CommentTableTestHelper.addComment({
        registerComment: {
          content: 'Ini adalah komentar',
        },
      });
      await LikesCommentTableTestHelper.addLike({ owner: 'user-123' });

      const payload = {
        owner: 'user-123',
        commentId: 'comment-123',
      };

      const likeCommentRepositoryPostgres = new LikeCommentRepository(pool);
      const likes = await likeCommentRepositoryPostgres.checkCommentHasLike(
        payload
      );

      expect(likes).toEqual(1);
    });

    it('should return 0 when user has not liked the comment', async () => {
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadTableTestHelper.addThread({ title: 'Thread Title' });
      await CommentTableTestHelper.addComment({
        registerComment: {
          content: 'Ini adalah komentar',
        },
      });

      const payload = {
        owner: 'user-123',
        commentId: 'comment-123',
      };

      const likeCommentRepositoryPostgres = new LikeCommentRepository(pool);
      const likes = await likeCommentRepositoryPostgres.checkCommentHasLike(
        payload
      );

      expect(likes).toEqual(0);
    });
  });

  describe('RemoveLike function', () => {
    it('should remove like correctly', async () => {
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadTableTestHelper.addThread({ title: 'Thread Title' });
      await CommentTableTestHelper.addComment({
        registerComment: {
          content: 'Ini adalah komentar',
        },
      });

      const payload = {
        owner: 'user-123',
        commentId: 'comment-123',
      };

      const likeCommentRepositoryPostgres = new LikeCommentRepository(pool);
      await likeCommentRepositoryPostgres.removeLike(payload);

      const likes = await likeCommentRepositoryPostgres.checkCommentHasLike(
        payload
      );

      expect(likes).toEqual(0);
    });
  });
});
