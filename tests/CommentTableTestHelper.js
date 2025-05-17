const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentTableTestHelper = {
  async addComment({
    commentId = 'comment-123',
    threadId = 'thread-123',
    ownerId = 'user-123',
    registerComment,
    parents = null,
    isDelete = false,
    date = '2025-05-07T08:45:15.235Z',
  }) {
    const { content } = registerComment;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, content, owner',
      values: [commentId, threadId, ownerId, content, parents, isDelete, date],
    };

    await pool.query(query);
  },

  async getCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentTableTestHelper;
