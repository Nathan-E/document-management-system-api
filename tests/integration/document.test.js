import 'babel-polyfill';
import {
  User
} from '../../models/users';
import {
  Role
} from '../../models/roles';
import {
  Access
} from '../../models/access';
import {
  Document
} from '../../models/documents';
import {
  Type
} from '../../models/types';
import request from 'supertest';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import {
  adminToken,
  regularToken
} from './util';
import app from '../../index';

let server;
let user;

describe('/api/v1/users', () => {
  beforeAll(async () => {
    server = app;
    await Role.collection.insertMany([{
      title: 'admin'
    }, {
      title: 'regular'
    }]);

    await Access.collection.insertMany([{
      name: 'admin',
      level: 1
    }, {
      name: 'private',
      level: 2
    }, {
      name: 'regular',
      level: 3
    }, {
      name: 'public',
      level: 4
    }]);

    await Type.collection.insertMany([{
      title: 'thesis'
    }, {
      title: 'manuscript'
    }, {
      title: 'proposal'
    }, {
      title: 'warrant'
    }, {
      title: 'license'
    }]);

    const salt = await bcrypt.genSalt(10);
    const password = '12345';
    const hashedPassword = await bcrypt.hash(password, salt);


    const payload = {
      firstname: 'ChibuezE',
      lastname: 'NathaN',
      role: mongoose.Types.ObjectId(),
      username: 'nachi1LL',
      email: 'chibuezj3555@test.com',
      password: hashedPassword
    };

    user = await new User(payload);

    await user.save();
  });
  beforeEach(async () => {});
  afterEach(async () => {});

  afterAll(async () => {
    await Role.deleteMany({});
    await User.deleteMany({});
    await Type.deleteMany({})
    await Document.deleteMany({});
    server.close();
  });

  describe('POST /', () => {
    it('should create a document if user is signed in', async () => {

      const document = {
        title: 'Natural Gas Processing',
        type: 'thesis',
        ownerId: user._id,
        content: new Array(25).join('hi'),
        ownerRole: 'regular'
      }

      const response  = await request(server)
        .post('/api/v1/documents')
        .set('x-auth-token', regularToken)
        .send(document);

      expect(response.status).toBe(200);
      expect(response.body.type).toBe('thesis');
    });
  })
});