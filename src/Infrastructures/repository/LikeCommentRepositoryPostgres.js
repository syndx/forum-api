const LikeCommentRepository = require('../../Applications/repository/LikeCommentRepository');

class LikeCommentRepositoryPostgres extends LikeCommentRepository {
  constructor(pool) {
    super();
    this._pool = pool;
  }

  async addLike({ owner, commentId }) {
    const query = {
      text: 'INSERT INTO likes VALUES($1, $2)',
      values: [owner, commentId],
    };

    await this._pool.query(query);
  }

  async getLikeByCommentId(commentId) {
    const query = {
      text: 'SELECT COUNT(*) FROM likes WHERE "commentId" = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    const likeCount = parseInt(result.rows[0].count, 10) || 0;
    return likeCount;
  }

  async checkCommentHasLike({ owner, commentId }) {
    const query = {
      text: 'SELECT COUNT(*) FROM likes WHERE owner = $1 AND "commentId" = $2',
      values: [owner, commentId],
    };

    const result = await this._pool.query(query);
    const likeCount = parseInt(result.rows[0].count, 10) || 0;
    return likeCount;
  }

  async removeLike({ owner, commentId }) {
    const query = {
      text: 'DELETE FROM likes WHERE owner = $1 AND "commentId" = $2',
      values: [owner, commentId],
    };

    await this._pool.query(query);
  }
}

module.exports = LikeCommentRepositoryPostgres;
