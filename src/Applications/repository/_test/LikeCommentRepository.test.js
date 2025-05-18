const LikeCommentRepository = require('../LikeCommentRepository');

describe('LikeCommentRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    const likeCommentRepository = new LikeCommentRepository();

    await expect(
      likeCommentRepository.checkCommentHasLike('', '')
    ).rejects.toThrowError('LIKE_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');

    await expect(likeCommentRepository.addLike('', '')).rejects.toThrowError(
      'LIKE_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );

    await expect(likeCommentRepository.removeLike('', '')).rejects.toThrowError(
      'LIKE_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
  });
});
