import {
  errorHandler
} from '../../../middlewares/index';

const res = {
  status: function (code) {
    return this;
  },
  send: function (msg) {
    return msg
  }
};

let next = true;

describe('Error Handling Middleware', () => {
  it('should return an error message', () => {
    const message = errorHandler('Error', 'req', res, next);

    expect(message).toBe('Something went wrong!!!');
  });
  it('should return an error message', () => {
    const message = errorHandler('', 'req', res, next);

    expect(message).toBeUndefined();
  });
});
