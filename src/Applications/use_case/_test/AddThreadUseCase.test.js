const RegisterThread = require('../../../Domains/threads/entities/RegisterThread');
const RegisteredThread = require('../../../Domains/threads/entities/RegisteredThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    const useCasePayload = {
      title: 'Thread title',
      body: 'Thread body',
    };

    const ownerId = 'user-123';

    const mockRegisteredThread = new RegisteredThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: 'user-123',
    });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.addThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockRegisteredThread));

    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    const registeredThread = await getThreadUseCase.execute(
      useCasePayload,
      ownerId
    );

    expect(registeredThread).toStrictEqual(
      new RegisteredThread({
        id: 'thread-123',
        title: useCasePayload.title,
        owner: 'user-123',
      })
    );

    expect(mockThreadRepository.addThread).toBeCalledWith(
      new RegisterThread({
        title: useCasePayload.title,
        body: useCasePayload.body,
      }),
      ownerId
    );
  });
});
