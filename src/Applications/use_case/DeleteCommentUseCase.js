class DeleteCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(payload) {
    this._validatePayload(payload);
    const { id, threadId, owner, replyId } = payload;

    await this._threadRepository.verifyThreadAvailability(threadId);
    await this._commentRepository.verifyCommentAvailability(id);
    if (replyId) {
      await this._commentRepository.verifyCommentAvailability(replyId);
      await this._commentRepository.verifyOwner(replyId, owner);
      await this._commentRepository.deleteComment(replyId);
    } else {
      await this._commentRepository.verifyOwner(id, owner);
      await this._commentRepository.deleteComment(id);
    }
  }

  _validatePayload({ id, threadId }) {
    if (!id || !threadId) {
      throw new Error('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof threadId !== 'string') {
      throw new Error(
        'DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'
      );
    }
  }
}

module.exports = DeleteCommentUseCase;
