const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const LikeCommentRepository = require('../../repository/LikeCommentRepository');
const LikeCommentUseCase = require('../LikeCommentUseCase');

describe('Like Comment use case', () => {
  it('should throw error when payload did not contain needed property', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    await expect(
      likeCommentUseCase.execute(useCasePayload)
    ).rejects.toThrowError('LIKE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet type specification', async () => {
    const useCasePayload = {
      threadId: 123,
      owner: 'user-123',
      commentId: 'comment-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeCommentRepository = new LikeCommentRepository();

    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      LikeCommentRepository: mockLikeCommentRepository,
    });

    await expect(
      likeCommentUseCase.execute(useCasePayload)
    ).rejects.toThrowError('LIKE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating like comment action correctly when user have not liked the comment', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
      owner: 'user-123',
      commentId: 'comment-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeCommentRepository = new LikeCommentRepository();

    mockThreadRepository.verifyThreadAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.verifyCommentAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockLikeCommentRepository.checkCommentHasLike = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockLikeCommentRepository.addLike = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockLikeCommentRepository.removeLike = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      LikeCommentRepository: mockLikeCommentRepository,
    });

    await likeCommentUseCase.execute(useCasePayload);

    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(
      useCasePayload.threadId
    );

    expect(mockCommentRepository.verifyCommentAvailability).toBeCalledWith(
      useCasePayload.commentId
    );

    expect(mockLikeCommentRepository.checkCommentHasLike).toBeCalledWith(
      useCasePayload.owner,
      useCasePayload.commentId
    );

    expect(mockLikeCommentRepository.addLike).toBeCalledWith(
      useCasePayload.owner,
      useCasePayload.commentId
    );

    expect(mockLikeCommentRepository.removeLike).not.toBeCalled();
  });

  it('should orchestrating like comment action correctly when user has liked the comment', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
      owner: 'user-123',
      commentId: 'comment-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeCommentRepository = new LikeCommentRepository();

    mockThreadRepository.verifyThreadAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.verifyCommentAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockLikeCommentRepository.checkCommentHasLike = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockLikeCommentRepository.addLike = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockLikeCommentRepository.removeLike = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      LikeCommentRepository: mockLikeCommentRepository,
    });

    await likeCommentUseCase.execute(useCasePayload);

    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(
      useCasePayload.threadId
    );

    expect(mockCommentRepository.verifyCommentAvailability).toBeCalledWith(
      useCasePayload.commentId
    );

    expect(mockLikeCommentRepository.checkCommentHasLike).toBeCalledWith(
      useCasePayload.owner,
      useCasePayload.commentId
    );

    expect(mockLikeCommentRepository.addLike).not.toBeCalled();

    expect(mockLikeCommentRepository.removeLike).toBeCalledWith(
      useCasePayload.owner,
      useCasePayload.commentId
    );
  });
});
