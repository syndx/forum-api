const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const RegisteredThread = require('../../Domains/threads/entities/RegisteredThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(registerThread, ownerId) {
    const { title, body } = registerThread;
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, owner',
      values: [id, title, body, ownerId],
    };

    const result = await this._pool.query(query);
    return new RegisteredThread({ ...result.rows[0] });
  }

  async getThreadById(id) {
    const query = {
      text: `
        SELECT t.id, t.title, t.body, t.date, u.username 
        FROM threads t
        JOIN "users" u ON t.owner = u.id
        WHERE t.id = $1`,
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Thread tidak dapat ditemukan');
    }

    return result.rows[0];
  }

  async verifyThreadAvailability(id) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Thread tidak dapat ditemukan');
    }
  }
}

module.exports = ThreadRepositoryPostgres;
