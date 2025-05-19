class GetThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(payload) {
    const thread = await this._threadRepository.getThreadById(payload);
    const comments = await this._commentRepository.getCommentByThreadId(
      payload
    );

    comments.sort((a, b) => new Date(a.date) - new Date(b.date));

    const mappedData = [];

    comments.forEach((item) => {
      const comment = {
        id: item.id,
        username: item.username,
        date: item.date,
        parents: item.parents,
        replies: [],
        content: item.isDelete ? '**komentar telah dihapus**' : item.content,
        isDelete: item.isDelete,
        likeCount: item.likeCount,
      };
      mappedData.push(comment);
    });

    comments.forEach((item) => {
      if (item.parents) {
        const parent = mappedData.find((c) => c.id === item.parents);
        const child = mappedData.find((c) => c.id === item.id);
        delete child.parents;
        parent.replies.push({
          id: child.id,
          content: child.isDelete ? '**balasan telah dihapus**' : child.content,
          date: child.date,
          username: child.username,
        });
        delete child.isDelete;
      }
    });

    const result = mappedData.filter((item) => item.parents === null);

    result.forEach((item) => {
      delete item.parents;
      delete item.isDelete;
    });

    return {
      ...thread,
      comments: result,
    };
  }
}

module.exports = GetThreadUseCase;
