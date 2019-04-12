import 'babel-polyfill';
import { Role } from '../../../models/roles';
import mongoose from 'mongoose';

describe('roles mongoose model', () => {
  it('should return a valid role', () => {
    const payload = {
      _id: new mongoose.Types.ObjectId(),
      title: 'Admin'
    }

    const newRole = new Role(payload);

    expect(newRole).toBeInstanceOf(Role);
    expect(newRole).toMatchObject(payload);
  });
});