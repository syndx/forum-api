class LikeCommentRepository {
  async checkCommentHasLike(owner, commentId) {
    throw new Error('LIKE_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async addLike(owner, commentId) {
    throw new Error('LIKE_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getLikeByCommentId(commentId) {
    throw new Error('LIKE_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async removeLike(owner, commentId) {
    throw new Error('LIKE_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = LikeCommentRepository;
