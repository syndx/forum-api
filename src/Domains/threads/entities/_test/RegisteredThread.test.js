const RegisteredThread = require('../RegisteredThread');

describe('a registeredThread entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'Thread title',
    };

    // Action and Assert
    expect(() => new RegisteredThread(payload)).toThrowError(
      'REGISTERED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'Thread title',
      owner: {},
    };

    // Action and Assert
    expect(() => new RegisteredThread(payload)).toThrowError(
      'REGISTERED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create registeredUser object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'dicoding',
      owner: 'owner-123',
    };

    // Action
    const registeredUser = new RegisteredThread(payload);

    // Assert
    expect(registeredUser.id).toEqual(payload.id);
    expect(registeredUser.title).toEqual(payload.title);
    expect(registeredUser.owner).toEqual(payload.owner);
  });
});
