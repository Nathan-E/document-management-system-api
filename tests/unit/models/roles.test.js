import 'babel-polyfill';
import Role from '../../../models/roles';
import mongoose from 'mongoose';
import { exportAllDeclaration } from '@babel/types';

describe('roles mongoose model', () => {
  it('should return a valid role', () => {
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      title: 'Admin'
    }

    const newRole = new Role(payload);

    expect(newRole).toBeInstanceOf(Role);
    expect(newRole).toMatchObject(payload);
  });
});