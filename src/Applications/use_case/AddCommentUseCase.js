const RegisterComment = require('../../Domains/comments/entities/RegisterComment');

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute({ threadId, owner, payload, parents = null }) {
    this._validate(threadId, owner);
    await this._threadRepository.verifyThreadAvailability(threadId);
    const registerComment = new RegisterComment(payload);
    if (parents) {
      await this._commentRepository.verifyCommentAvailability(parents);
    }
    return this._commentRepository.addComment(
      threadId,
      owner,
      registerComment,
      parents
    );
  }

  _validate(threadId, owner) {
    if (!threadId || !owner) {
      throw new Error('REGISTER_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof threadId !== 'string' || typeof owner !== 'string') {
      throw new Error('REGISTER_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddCommentUseCase;
