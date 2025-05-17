const RegisteredComment = require('../../Domains/comments/entities/RegisteredComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(
    threadId,
    ownerId,
    registerComment,
    parents = null,
    isDelete = false
  ) {
    const { content } = registerComment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, parents, content, owner',
      values: [id, threadId, ownerId, content, parents, isDelete],
    };

    const result = await this._pool.query(query);
    return new RegisteredComment({ ...result.rows[0] });
  }

  async getCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Komentar tidak dapat ditemukan');
    }

    return result.rows[0];
  }

  async verifyCommentAvailability(id) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Komentar tidak dapat ditemukan');
    }
  }

  async verifyOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND owner = $2',
      values: [id, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length > 0) {
      throw new AuthorizationError(
        'Gagal menghapus komentar dikarenakan user bukan pemilik komentar'
      );
    }
  }

  async getCommentByThreadId(threadId) {
    const query = {
      text: `
        SELECT c.id, u.username, c.date, c.parents, c.content, c."isDelete"
        FROM comments c
        JOIN "users" u ON c.owner = u.id
        WHERE c.thread = $1
      `,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async deleteComment(id) {
    const query = {
      text: 'UPDATE comments SET "isDelete" = $1 WHERE id = $2 ',
      values: [true, id],
    };

    await this._pool.query(query);
  }
}

module.exports = CommentRepositoryPostgres;
