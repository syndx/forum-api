const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUseCase', () => {
  it('should orchestrating the get thread correctly', async () => {
    const useCasePayload = 'thread-123';

    const mockThread = {
      id: 'thread-123',
      title: 'Thread title',
      body: 'Thread body',
      date: '2025-05-07T07:46:07.905Z',
      username: 'dicoding',
    };

    const mockComment = [
      {
        id: 'comments-1',
        username: 'Cheevin',
        date: '2025-05-07T07:46:15.905Z',
        parents: null,
        content: 'ini adalah komentar pertama',
        isDelete: false,
      },
      {
        id: 'comments-2',
        username: 'Mukidi',
        date: '2025-05-07T07:46:30.905Z',
        parents: 'comments-1',
        content: 'ini adalah balasan komentar pertama',
        isDelete: false,
      },
      {
        id: 'comments-3',
        username: 'Mukidi',
        date: '2025-05-07T07:46:20.905Z',
        parents: null,
        content: 'ini adalah komentar kedua',
        isDelete: false,
      },
      {
        id: 'comments-4',
        username: 'Subeki',
        date: '2025-05-07T07:46:50.905Z',
        parents: 'comments-1',
        content: 'ini adalah balasan komentar pertama lagi',
        isDelete: false,
      },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockThread));

    mockCommentRepository.getCommentByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockComment));

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const detailThread = await getThreadUseCase.execute(useCasePayload);

    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(
      useCasePayload
    );
    expect(mockCommentRepository.getCommentByThreadId).toHaveBeenCalledWith(
      useCasePayload
    );

    expect(detailThread).toStrictEqual({
      ...mockThread,
      comments: [
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
        },
        {
          id: 'comments-3',
          username: 'Mukidi',
          date: '2025-05-07T07:46:20.905Z',
          replies: [],
          content: 'ini adalah komentar kedua',
        },
      ],
    });
  });

  it('should orchestrating get detail thread when comment has deleted.', async () => {
    const useCasePayload = 'thread-123';

    const mockThread = {
      id: 'thread-123',
      title: 'Thread title',
      body: 'Thread body',
      date: '2025-05-07T07:46:07.905Z',
      username: 'dicoding',
    };

    const mockComment = [
      {
        id: 'comments-1',
        username: 'Cheevin',
        date: '2025-05-07T07:46:15.905Z',
        parents: null,
        content: 'ini adalah komentar pertama',
        isDelete: false,
      },
      {
        id: 'comments-2',
        username: 'Mukidi',
        date: '2025-05-07T07:46:30.905Z',
        parents: 'comments-1',
        content: 'ini adalah balasan komentar pertama',
        isDelete: false,
      },
      {
        id: 'comments-3',
        username: 'Mukidi',
        date: '2025-05-07T07:46:20.905Z',
        parents: null,
        content: 'ini adalah komentar kedua',
        isDelete: true,
      },
      {
        id: 'comments-4',
        username: 'Subeki',
        date: '2025-05-07T07:46:50.905Z',
        parents: 'comments-1',
        content: 'ini adalah balasan komentar pertama lagi',
        isDelete: false,
      },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockThread));

    mockCommentRepository.getCommentByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockComment));

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const detailThread = await getThreadUseCase.execute(useCasePayload);

    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(
      useCasePayload
    );
    expect(mockCommentRepository.getCommentByThreadId).toHaveBeenCalledWith(
      useCasePayload
    );

    expect(detailThread).toStrictEqual({
      ...mockThread,
      comments: [
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
        },
        {
          id: 'comments-3',
          username: 'Mukidi',
          date: '2025-05-07T07:46:20.905Z',
          replies: [],
          content: '**komentar telah dihapus**',
        },
      ],
    });
  });

  it('should orchestrating get detail thread when reply has deleted', async () => {
    const useCasePayload = 'thread-123';

    const mockThread = {
      id: 'thread-123',
      title: 'Thread title',
      body: 'Thread body',
      date: '2025-05-07T07:46:07.905Z',
      username: 'dicoding',
    };

    const mockComment = [
      {
        id: 'comments-1',
        username: 'Cheevin',
        date: '2025-05-07T07:46:15.905Z',
        parents: null,
        content: 'ini adalah komentar pertama',
        isDelete: false,
      },
      {
        id: 'comments-2',
        username: 'Mukidi',
        date: '2025-05-07T07:46:30.905Z',
        parents: 'comments-1',
        content: 'ini adalah balasan komentar pertama',
        isDelete: false,
      },
      {
        id: 'comments-3',
        username: 'Mukidi',
        date: '2025-05-07T07:46:20.905Z',
        parents: null,
        content: 'ini adalah komentar kedua',
        isDelete: false,
      },
      {
        id: 'comments-4',
        username: 'Subeki',
        date: '2025-05-07T07:46:50.905Z',
        parents: 'comments-1',
        content: 'ini adalah balasan komentar pertama lagi',
        isDelete: true,
      },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockThread));

    mockCommentRepository.getCommentByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockComment));

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const detailThread = await getThreadUseCase.execute(useCasePayload);

    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(
      useCasePayload
    );
    expect(mockCommentRepository.getCommentByThreadId).toHaveBeenCalledWith(
      useCasePayload
    );

    expect(detailThread).toStrictEqual({
      ...mockThread,
      comments: [
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
              content: '**balasan telah dihapus**',
              date: '2025-05-07T07:46:50.905Z',
              username: 'Subeki',
            },
          ],
          content: 'ini adalah komentar pertama',
        },
        {
          id: 'comments-3',
          username: 'Mukidi',
          date: '2025-05-07T07:46:20.905Z',
          replies: [],
          content: 'ini adalah komentar kedua',
        },
      ],
    });
  });
});
