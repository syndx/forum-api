const RegisterThread = require('../RegisterThread');

describe('a thread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      title: 'thread title',
    };

    expect(() => new RegisterThread(payload)).toThrowError(
      'NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      title: 123,
      body: 'body thread',
    };

    expect(() => new RegisterThread(payload)).toThrowError(
      'NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create thread correctly', () => {
    const payload = {
      title: 'thread title',
      body: 'thread body',
    };

    const { title, body } = new RegisterThread(payload);

    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
  });
});
