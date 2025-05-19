const MappedComment = require('../MappedComment');

describe('MappedComment', () => {
  it('should throw error when did not contain needed paramter', () => {
    expect(() => new MappedComment()).toThrowError(
      'MAPPED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = 123;
    expect(() => new MappedComment(payload)).toThrowError(
      'MAPPED_COMMENT.NOT_MEET_DATA_SPECIFICATION'
    );
  });

  it('should create a mapped comment object correctly', () => {
    const comments = [
      {
        id: 'comments-1',
        username: 'Cheevin',
        date: '2025-05-07T07:46:15.905Z',
        parents: null,
        content: 'ini adalah komentar pertama',
        isDelete: false,
        likeCount: 0,
      },
      {
        id: 'comments-2',
        username: 'Mukidi',
        date: '2025-05-07T07:46:30.905Z',
        parents: 'comments-1',
        content: 'ini adalah balasan komentar pertama',
        isDelete: false,
        likeCount: 0,
      },
      {
        id: 'comments-3',
        username: 'Mukidi',
        date: '2025-05-07T07:46:20.905Z',
        parents: null,
        content: 'ini adalah komentar kedua',
        isDelete: false,
        likeCount: 0,
      },
      {
        id: 'comments-4',
        username: 'Subeki',
        date: '2025-05-07T07:46:50.905Z',
        parents: 'comments-1',
        content: 'ini adalah balasan komentar pertama lagi',
        isDelete: false,
        likeCount: 0,
      },
    ];

    const expectedComments = [
      {
        id: 'comments-1',
        username: 'Cheevin',
        date: '2025-05-07T07:46:15.905Z',
        replies: [
          {
            id: 'comments-2',
            content: 'ini adalah balasan komentar pertama',
            date: '2025-05-07T07:46:30.905Z',
            username: 'Mukidi',
          },
          {
            id: 'comments-4',
            content: 'ini adalah balasan komentar pertama lagi',
            date: '2025-05-07T07:46:50.905Z',
            username: 'Subeki',
          },
        ],
        content: 'ini adalah komentar pertama',
        likeCount: 0,
      },
      {
        id: 'comments-3',
        username: 'Mukidi',
        date: '2025-05-07T07:46:20.905Z',
        replies: [],
        content: 'ini adalah komentar kedua',
        likeCount: 0,
      },
    ];

    const mappedComment = new MappedComment(comments);
    const mappingComment = mappedComment.execute();

    expect(mappingComment).toStrictEqual(expectedComments);
  });
});
