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
let token;

describe('/api/v1/documents', () => {
  beforeAll(async () => {
    server = app;

    const admin = new Role({
      title: 'adminX',
    });

    await admin.save();

    const regular = new Role({
      title: 'regularX',
    });

    await regular.save();

    await Access.collection.insertMany([{
      name: 'adminX',
      level: 1
    }, {
      name: 'regularX',
      level: 2
    }, {
      name: 'private',
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
      role: regular._id,
      username: 'nachi1LL',
      email: 'chibuezj3555@test.com',
      password: hashedPassword
    };

    user = await new User(payload);

    token = user.generateAuthToken();

    await user.save();
  });
  beforeEach(async () => {});
  afterEach(async () => {});

  afterAll(async () => {
    await Role.deleteMany({});
    await User.deleteMany({});
    await Type.deleteMany({})
    await Document.deleteMany({});
    await Access.deleteMany({});
    server.close();
  });

  describe('POST /', () => {
    it('should create a document if user is signed in', async () => {

      const document = {
        title: 'Natural Gas Processing',
        type: 'thesis',
        accessRight: 'regularX',
        content: new Array(25).join('hi'),
      }

      const response = await request(server)
        .post('/api/v1/documents')
        .set('x-auth-token', token)
        .send(document);

      expect(response.status).toBe(200);
    });
  });
  describe('GET /', () => {
    it('should return all document if user is signed in', async () => {

      Document.collection.insertMany([{
        title: 'jeehwhd;q',
        type_id: mongoose.Types.ObjectId(),
        owner_id: mongoose.Types.ObjectId(),
        ownerRole: 'regularX',
        content: new Array(15).join('aw'),
        accessRight: 'public',
      }, {
        title: 'kef;jsi',
        type_id: mongoose.Types.ObjectId(),
        owner_id: mongoose.Types.ObjectId(),
        ownerRole: 'regularX',
        content: new Array(15).join('a'),
        accessRight: 'public',
      }]);

      const response = await request(server)
        .get('/api/v1/documents')
        .set('x-auth-token', adminToken)
        .send();

      expect(response.status).toBe(200);
    });
  });
  describe('GET /:id', () => {
    it('should return all document if user is signed in', async () => {

      const paylaod = {
        title: 'jhwah;d;jk',
        type_id: mongoose.Types.ObjectId(),
        owner_id: mongoose.Types.ObjectId(),
        ownerRole: 'regularX',
        content: new Array(15).join('a'),
        accessRight: 'public',
      };

      const doc = new Document(paylaod);

      await doc.save();

      const response = await request(server)
        .get(`/api/v1/documents/${doc._id}`)
        .set('x-auth-token', adminToken)
        .send();

      expect(response.status).toBe(200);
    });
  });
  describe('PUT /:id', () => {
    it('should update an existing document if the user is authorized', async () => {
      const paylaod = {
        title: 'jhajdhdskh',
        type_id: mongoose.Types.ObjectId(),
        owner_id: user._id,
        ownerRole: 'regularX',
        content: new Array(15).join('af'),
        accessRight: 'public',
      };

      const doc = new Document(paylaod);

      await doc.save();


      const response = await request(server)
        .put(`/api/v1/documents/${doc._id}`)
        .set('x-auth-token', token)
        .send({
          title: 'Hello!!!',
          accessRight: 'public'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id');
    });
  });
});