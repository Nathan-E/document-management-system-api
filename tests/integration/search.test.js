import 'babel-polyfill';
import {
  Document,
  Role,
  Access
} from '../../models/index';
import {
  regularToken,
  adminToken
} from '../integration/util';
import app from '../../index';
import request from 'supertest';
import mongoose from 'mongoose';

let server;

describe('/api/v1/search', () => {
  beforeAll(async () => {
    server = app;

    await Document.collection.insertMany([{
      title: 'Queen',
      type_id: mongoose.Types.ObjectId(),
      owner_id: mongoose.Types.ObjectId(),
      ownerRole: 'regular',
      content: new Array(15).join('aw'),
      accessRight: 4,
    }, {
      title: 'King',
      type_id: mongoose.Types.ObjectId(),
      owner_id: mongoose.Types.ObjectId(),
      ownerRole: 'regular',
      content: new Array(15).join('af'),
      accessRight: 2,
    }, {
      title: 'Princes',
      type_id: mongoose.Types.ObjectId(),
      owner_id: mongoose.Types.ObjectId(),
      ownerRole: 'regular',
      content: new Array(15).join('am'),
      accessRight: 3,
    }, {
      title: 'Princesses',
      type_id: mongoose.Types.ObjectId(),
      owner_id: mongoose.Types.ObjectId(),
      ownerRole: 'admin',
      content: new Array(15).join('am'),
      accessRight: 1,
    }]);

    await Role.collection.insertMany([{
      title: 'admin',
    }, {
      title: 'regular',
    }]);

    await Access.collection.insertMany([{
      name: 'admin',
      level: 1
    }, {
      name: 'regular',
      level: 2
    }, {
      name: 'private',
      level: 3
    }, {
      name: 'public',
      level: 4
    }]);
  });

  afterAll(async () => {
    await Document.deleteMany({});
    await Role.deleteMany({});
    server.close();
  });

  describe('GET /', () => {
      it('should get all the document if the the admin is request for it', async() => {
      const response = await request(server)
        .get('/api/v1/search')
        .set('x-auth-token', adminToken)
        .send();

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(4);
     });
    it('should get all the document if the the admin is request for it considering the query parameters', async () => {
      const response = await request(server)
        .get('/api/v1/search?role=regular')
        .set('x-auth-token', adminToken)
        .send();

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(3);
    });

  });
});