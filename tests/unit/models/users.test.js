import {
  User
}
from '../../../models/users';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import mongoose from 'mongoose';

describe('User mongoose model', () => {
  it('should return an instance of user the model', () => {
    const payload = {
      firstname: 'Chibueze',
      lastname: 'Ikedi',
      username: 'cikedi',
      email: 'ikedichibueze@test.com',
      role: new mongoose.Types.ObjectId(),
      password: '12345'
    };

    const newUser = new User(payload);

    expect(newUser).toBeInstanceOf(User);
    expect(newUser).toMatchObject(payload);
  });
  it('should return a valid JWT', () => {
    const payload = {
      firstname: 'Chibueze',
      lastname: 'Ikedi',
      username: 'cikedi',
      email: 'ikedichibueze@test.com',
      role: new mongoose.Types.ObjectId(),
      password: '12345',
      isAdmin: true
    };

    const user = new User(payload);

    const token = user.generateAuthToken();

    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    expect(decoded).toMatchObject(_.pick(payload, ['_id', 'isAdmin']));
  });
});
