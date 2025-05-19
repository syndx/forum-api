const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');
const GetThreadUseCase = require('../../../../Applications/use_case/GetThreadUseCase');
const LikeCommentUseCase = require('../../../../Applications/use_case/LikeCommentUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadHandler = this.getThreadHandler.bind(this);
    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
    this.likeByCommentId = this.likeByCommentId.bind(this);
  }

  async postThreadHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const addThreadUsecase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUsecase.execute(
      request.payload,
      credentialId
    );

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadHandler(request, h) {
    const { threadId } = request.params;
    const getThreadUseCase = this._container.getInstance(GetThreadUseCase.name);
    const thread = await getThreadUseCase.execute(threadId);

    const response = h.response({
      status: 'success',
      data: {
        thread,
      },
    });
    response.code(200);
    return response;
  }

  async postCommentHandler(request, h) {
    const { threadId } = request.params;
    const { id: owner } = request.auth.credentials;

    const addCommentUseCase = this._container.getInstance(
      AddCommentUseCase.name
    );

    const addedComment = await addCommentUseCase.execute({
      threadId,
      owner,
      payload: request.payload,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async postReplyHandler(request, h) {
    const { threadId } = request.params;
    const { id: owner } = request.auth.credentials;
    const parents = request.params.commentId;

    const addCommentUseCase = this._container.getInstance(
      AddCommentUseCase.name
    );

    const addedReply = await addCommentUseCase.execute({
      threadId,
      owner,
      payload: request.payload,
      parents,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request, h) {
    const { threadId, commentId } = request.params;
    const { id: owner } = request.auth.credentials;

    const deleteCommentUseCase = this._container.getInstance(
      DeleteCommentUseCase.name
    );

    await deleteCommentUseCase.execute({
      id: commentId,
      threadId,
      owner,
    });

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }

  async deleteReplyHandler(request, h) {
    const { threadId, commentId, replyId } = request.params;
    const { id: owner } = request.auth.credentials;

    const deleteCommentUseCase = this._container.getInstance(
      DeleteCommentUseCase.name
    );

    await deleteCommentUseCase.execute({
      id: commentId,
      threadId,
      owner,
      replyId,
    });

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }

  async likeByCommentId(request, h) {
    const { threadId, commentId } = request.params;
    const { id: owner } = request.auth.credentials;

    const likeCommentUseCase = this._container.getInstance(
      LikeCommentUseCase.name
    );

    await likeCommentUseCase.execute({
      threadId,
      owner,
      commentId,
    });

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
