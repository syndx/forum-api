const pool = require('../src/Infrastructures/database/postgres/pool');

const LikesCommentTableTestHelper = {
  async addLike({ owner = 'user-123', commentId = 'comment-123' }) {
    const query = {
      text: 'INSERT INTO likes VALUES($1, $2)',
      values: [owner, commentId],
    };

    await pool.query(query);
  },

  async getLikeByCommentId(commentId) {
    const query = {
      text: 'SELECT COUNT(*) FROM likes WHERE "commentId" = $1',
      values: [commentId],
    };

    const result = await pool.query(query);
    const likeCount = parseInt(result.rows[0].count, 10) || 0;
    return likeCount;
  },

  async cleanTable() {
    await pool.query('DELETE FROM likes WHERE 1=1');
  },
};

module.exports = LikesCommentTableTestHelper;
