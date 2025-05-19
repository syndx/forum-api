class LikeCommentUseCase {
  constructor({ threadRepository, commentRepository, likeCommentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeCommentRepository = likeCommentRepository;
  }

  async execute({ threadId, owner, commentId }) {
    this._validatePayload(threadId, owner, commentId);
    await this._threadRepository.verifyThreadAvailability(threadId);
    await this._commentRepository.verifyCommentAvailability(commentId);

    const hasLike = await this._likeCommentRepository.checkCommentHasLike({
      owner,
      commentId,
    });

    if (hasLike) {
      await this._likeCommentRepository.removeLike({ owner, commentId });
    } else {
      await this._likeCommentRepository.addLike({ owner, commentId });
    }
  }

  _validatePayload(threadId, owner, commentId) {
    if (!threadId || !owner || !commentId) {
      throw new Error('LIKE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof threadId !== 'string' ||
      typeof owner !== 'string' ||
      typeof commentId !== 'string'
    ) {
      throw new Error('LIKE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = LikeCommentUseCase;
