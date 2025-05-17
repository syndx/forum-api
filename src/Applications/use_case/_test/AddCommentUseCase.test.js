const AddCommentUseCase = require('../AddCommentUseCase');
const RegisterComment = require('../../../Domains/comments/entities/RegisterComment');
const RegisteredComment = require('../../../Domains/comments/entities/RegisteredComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('AddCommentUsecase', () => {
  it('should throw error when payload not contain needed property', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
      payload: {
        content: 'ini adalah komentar',
      },
      parents: null,
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    const getCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    await expect(
      getCommentUseCase.execute(useCasePayload)
    ).rejects.toThrowError('REGISTER_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
      owner: 123214124,
      payload: {
        content: 'ini adalah komentar',
      },
      parents: null,
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    const getCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    await expect(
      getCommentUseCase.execute(useCasePayload)
    ).rejects.toThrowError('REGISTER_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the add comment action correctly when no parent comment', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
      owner: 'user-123',
      payload: {
        content: 'ini adalah komentar',
      },
      parents: null,
    };

    const mockRegisteredComment = new RegisteredComment({
      id: 'comment-123',
      content: 'ini adalah komentar',
      owner: 'user-123',
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThreadAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.verifyCommentAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.addComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockRegisteredComment));

    const getCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const registeredComment = await getCommentUseCase.execute(useCasePayload);

    expect(registeredComment).toStrictEqual(
      new RegisteredComment({
        id: 'comment-123',
        content: 'ini adalah komentar',
        owner: 'user-123',
      })
    );

    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(
      useCasePayload.threadId
    );

    expect(mockCommentRepository.verifyCommentAvailability).not.toBeCalled();

    expect(mockCommentRepository.addComment).toBeCalledWith(
      useCasePayload.threadId,
      useCasePayload.owner,
      new RegisterComment({
        content: useCasePayload.payload.content,
      }),
      useCasePayload.parents
    );
  });

  it('should orchestrate the add reply action correctly when a parent comment is provided', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
      owner: 'user-123',
      payload: {
        content: 'ini adalah komentar',
      },
      parents: 'comment-123',
    };

    const mockRegisteredComment = new RegisteredComment({
      id: 'comment-234',
      content: 'ini adalah komentar',
      owner: 'user-123',
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThreadAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.verifyCommentAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.addComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockRegisteredComment));

    const getCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const registeredComment = await getCommentUseCase.execute(useCasePayload);

    expect(registeredComment).toStrictEqual(
      new RegisteredComment({
        id: 'comment-234',
        content: 'ini adalah komentar',
        owner: 'user-123',
      })
    );

    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(
      useCasePayload.threadId
    );

    expect(mockCommentRepository.verifyCommentAvailability).toBeCalledWith(
      useCasePayload.parents
    );

    expect(mockCommentRepository.addComment).toBeCalledWith(
      useCasePayload.threadId,
      useCasePayload.owner,
      new RegisterComment({
        content: useCasePayload.payload.content,
      }),
      useCasePayload.parents
    );
  });
});
