import 'babel-polyfill';
import {
  Type
} from '../../../models/roles';
import mongoose from 'mongoose';

describe('types mongoose model', () => {
  it('should return a valid document type', () => {
    const payload = {
      _id: new mongoose.Types.ObjectId(),
      title: 'journal'
    }

    const newType = new Type(payload);

    expect(newType).toBeInstanceOf(Type);
    expect(newType).toMatchObject(payload);
  });
});