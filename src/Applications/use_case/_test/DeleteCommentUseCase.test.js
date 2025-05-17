const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should throw error if use case payload not contain needed property', async () => {
    const useCasePayload = {};
    const deleteCommentUseCase = new DeleteCommentUseCase({});

    await expect(
      deleteCommentUseCase.execute(useCasePayload)
    ).rejects.toThrowError(
      'DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error if use case payload did not meet data type specification', async () => {
    const useCasePayload = {
      id: 1234821,
      threadId: 'thread-123',
    };
    const deleteCommentUseCase = new DeleteCommentUseCase({});

    await expect(
      deleteCommentUseCase.execute(useCasePayload)
    ).rejects.toThrowError(
      'DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should orchestrating the delete comment action correctly', async () => {
    const useCasePayload = {
      id: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThreadAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.verifyCommentAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.verifyOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.deleteComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    await deleteCommentUseCase.execute(useCasePayload);

    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith(
      useCasePayload.threadId
    );

    expect(
      mockCommentRepository.verifyCommentAvailability
    ).toHaveBeenCalledWith(useCasePayload.id);

    expect(mockCommentRepository.verifyOwner).toHaveBeenCalledWith(
      useCasePayload.id,
      useCasePayload.owner
    );

    expect(mockCommentRepository.deleteComment).toHaveBeenCalledWith(
      useCasePayload.id
    );
  });

  it('should orchestrating the delete reply action correctly', async () => {
    const useCasePayload = {
      id: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123',
      replyId: 'reply-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThreadAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.verifyCommentAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.verifyOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.deleteComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    await deleteCommentUseCase.execute(useCasePayload);

    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith(
      useCasePayload.threadId
    );

    expect(
      mockCommentRepository.verifyCommentAvailability
    ).toHaveBeenCalledWith(useCasePayload.id);

    expect(mockCommentRepository.verifyOwner).toHaveBeenCalledWith(
      useCasePayload.replyId,
      useCasePayload.owner
    );

    expect(mockCommentRepository.deleteComment).toHaveBeenCalledWith(
      useCasePayload.replyId
    );
  });
});
