class MappedComment {
  constructor(payload) {
    this._validatePayload(payload);
    this._comments = payload;

    this.execute = this.execute.bind(this);
  }

  _validatePayload(payload) {
    if (!payload) {
      throw new Error('MAPPED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof payload !== 'object') {
      throw new Error('MAPPED_COMMENT.NOT_MEET_DATA_SPECIFICATION');
    }
  }

  execute() {
    const mappedData = [];

    this._comments.forEach((item) => {
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

    this._comments.forEach((item) => {
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

    return result;
  }
}

module.exports = MappedComment;
