import mongoose from 'mongoose';
import { Document } from '../../../models/documents';

describe('document model', () => {
  it('should return a document', () => {
    const payload = {
      title: 'Evaluation of EOR in sandstone reservoirs',
      type: {
        id: mongoose.Types.ObjectId()
      },
      createdAt: Date.now(),
      content: new Array(100).join('a'),
      owner: {
        id: mongoose.Types.ObjectId()
      },
      ownerRole: 'Admin',
      accessRight: 'private',
    }

    const newDocument = new Document(payload);

    expect(newDocument).toBeInstanceOf(Document);
    expect(newDocument).toMatchObject(payload);
  });
});