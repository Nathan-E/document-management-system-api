import mongoose from 'mongoose';
import { Document } from '../../../models/documents';

describe('document model', () => {
  it('should return a document', () => {
    const payload = {
      title: 'Evaluation of EOR in sandstone reservoirs',
      type_id: {
        _id: mongoose.Types.ObjectId()
      },
      content: new Array(100).join('a'),
      owner_id: {
        _id: mongoose.Types.ObjectId()
      },
      ownerRole: 'Admin',
      accessRight: 4,
    }

    const newDocument = new Document(payload);

    expect(newDocument).toBeInstanceOf(Document);
    expect(newDocument).toMatchObject(payload);
  });
});