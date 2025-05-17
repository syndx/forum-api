const RegisteredComment = require('../RegisteredComment');

describe('Registered Comment entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'comment-123',
      content: 'ini adalah komentar',
    };

    expect(() => new RegisteredComment(payload)).toThrowError(
      'REGISTERED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      content: 'ini adalah komentar',
      owner: 'user-123',
    };

    expect(() => new RegisteredComment(payload)).toThrowError(
      'REGISTERED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create a registered comment object correctly', () => {
    const payload = {
      id: 'comment-123',
      content: 'ini adalah komentar',
      owner: 'user-123',
    };

    const { id, content, owner } = new RegisteredComment(payload);

    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
