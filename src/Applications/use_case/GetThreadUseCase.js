const MappedComment = require('../../Domains/comments/entities/MappedComment');

class GetThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(payload) {
    const threadPostgres = await this._threadRepository.getThreadById(payload);
    const commentsPostgres = await this._commentRepository.getCommentByThreadId(
      payload
    );

    commentsPostgres.sort((a, b) => new Date(a.date) - new Date(b.date));

    const mappedComments = new MappedComment(commentsPostgres);
    const comments = mappedComments.execute();

    return {
      ...threadPostgres,
      comments,
    };
  }
}

module.exports = GetThreadUseCase;
