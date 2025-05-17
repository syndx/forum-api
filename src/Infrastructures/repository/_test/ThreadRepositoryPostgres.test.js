const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const RegisterThread = require('../../../Domains/threads/entities/RegisterThread');
const RegisteredThread = require('../../../Domains/threads/entities/RegisteredThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist register thread and return registered thread correctly', async () => {
      await UsersTableTestHelper.addUser({ username: 'dicoding' });

      const registerThread = new RegisterThread({
        title: 'Thread title',
        body: 'Thread body',
      });
      const ownerId = 'user-123';
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      await threadRepositoryPostgres.addThread(registerThread, ownerId);

      const threads = await ThreadTableTestHelper.findThreadById('thread-123');
      expect(threads).toHaveLength(1);
    });

    it('should return registered thread correctly', async () => {
      await UsersTableTestHelper.addUser({ username: 'dicoding' });

      const registerThread = new RegisterThread({
        title: 'Thread title',
        body: 'Thread body',
      });
      const ownerId = 'user-123';
      const fakeIdGenerator = () => '123';

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      const registeredThread = await threadRepositoryPostgres.addThread(
        registerThread,
        ownerId
      );

      expect(registeredThread).toStrictEqual(
        new RegisteredThread({
          id: 'thread-123',
          title: 'Thread title',
          owner: ownerId,
        })
      );
    });
  });

  describe('getThreadById function', () => {
    it('should throw an error not found when failed find a thread', async () => {
      const threadId = 'thread-123';

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(
        threadRepositoryPostgres.getThreadById(threadId)
      ).rejects.toThrowError(NotFoundError);
    });

    it('should return a thread correctly', async () => {
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadTableTestHelper.addThread({ title: 'Thread title' });

      const threadId = 'thread-123';

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      const thread = await threadRepositoryPostgres.getThreadById(threadId);

      expect(thread).toEqual({
        id: 'thread-123',
        title: 'Thread title',
        body: 'Thread body',
        date: new Date('2025-05-07T08:45:15.235Z'),
        username: 'dicoding',
      });
    });
  });

  describe('verifyThreadAvailability function', () => {
    it('should throw an error when failed to find a thread', async () => {
      const threadId = 'thread-123';

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(
        threadRepositoryPostgres.verifyThreadAvailability(threadId)
      ).rejects.toThrowError(NotFoundError);
    });

    it('should not throw an error when success to find a thread', async () => {
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadTableTestHelper.addThread({ title: 'Thread title' });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(
        threadRepositoryPostgres.verifyThreadAvailability('thread-123')
      ).resolves.not.toThrowError(NotFoundError);
    });
  });
});
