const RegisterComment = require('../RegisterComment');

describe('a RegisterComment entitiy', () => {
  it('should throw error when payload not contain needed property', () => {
    const payload = {};

    expect(() => new RegisterComment(payload)).toThrowError(
      'REGISTER_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when not meet data type specification', () => {
    const payload = {
      content: 123,
    };

    expect(() => new RegisterComment(payload)).toThrowError(
      'REGISTER_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create RegisterComment object correctly', () => {
    const payload = {
      content: 'ini adalah komentar',
    };

    const { content } = new RegisterComment(payload);

    expect(content).toEqual(payload.content);
  });
});
