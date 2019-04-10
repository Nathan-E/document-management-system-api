import {
  User
} from '../../../models/users';
import mongoose from 'mongoose';

describe('User mongoose model', () => {
  it('should return an instance of user the model', () => {
    const payload = {
      _id: mongoose.Types.ObjectId(),
      firstname: 'Chibueze',
      lastname: 'Ikedi',
      username: 'cikedi',
      email: 'ikedichibueze@test.com',
      role_id: {
        _id: mongoose.Types.ObjectId()
      },
      password: '12345'
    };

    const newUser = new User(payload);

    expect(newUser).toBeInstanceOf(User);
    expect(newUser).toMatchObject(payload);
  });
});