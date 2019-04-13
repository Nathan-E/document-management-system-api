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
let user2;
let token2;

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
      role: admin._id,
      username: 'nachi1LL',
      email: 'chibuezj3555@test.com',
      password: hashedPassword
    };

    user = await new User(payload);

    token = user.generateAuthToken();

    await user.save();

    const payload2 = {
      firstname: 'ChibuezEx',
      lastname: 'NathaNe',
      role: regular._id,
      username: 'qwertdf',
      email: 'chibuezewqr@test.com',
      password: hashedPassword
    };

    user2 = await new User(payload2);

    token2 = user2.generateAuthToken();
    await user2.save();

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
        accessRight: 2,
        content: new Array(25).join('hi'),
      }

      const response = await request(server)
        .post('/api/v1/documents')
        .set('x-auth-token', token)
        .send(document);

      expect(response.status).toBe(200);
    });
    it('should create not document if in field are invlalid', async () => {

      const document = {
        title: 'Nat',
        type: 'thesis',
        accessRight: 2,
        content: new Array(25).join('hi'),
      }

      const response = await request(server)
        .post('/api/v1/documents')
        .set('x-auth-token', token)
        .send(document);

      expect(response.status).toBe(400);
    });
    it('should create not document if document type doesn\'t exit', async () => {

      const document = {
        title: 'Natural gas processing',
        type: 'Biology',
        accessRight: 2,
        content: new Array(25).join('hi'),
      }

      const response = await request(server)
        .post('/api/v1/documents')
        .set('x-auth-token', token)
        .send(document);

      expect(response.status).toBe(404);
    });
    it('should create not document if user does not exist', async () => {

      const document = {
        title: 'Natural gas processing',
        type: 'thesis',
        accessRight: 2,
        content: new Array(25).join('hi'),
      }

      const response = await request(server)
        .post('/api/v1/documents')
        .set('x-auth-token', regularToken)
        .send(document);

      expect(response.status).toBe(404);
    });
    it('should create not document if the access level is invalid', async () => {

      const document = {
        title: 'Natural gas processing',
        type: 'thesis',
        accessRight: 5,
        content: new Array(25).join('hi'),
      }

      const response = await request(server)
        .post('/api/v1/documents')
        .set('x-auth-token', token)
        .send(document);

      expect(response.status).toBe(404);
    });
    it('should create not document if the accessRight is passed', async () => {

      const document = {
        title: 'Natural gas processing',
        type: 'thesis',
        accessRight: 1,
        content: new Array(25).join('hi'),
      }

      const response = await request(server)
        .post('/api/v1/documents')
        .set('x-auth-token', token2)
        .send(document);

      expect(response.status).toBe(400);
    });
  });
  describe('GET /', () => {
    it('should return all document if user is Admin', async () => {

      await Document.collection.insertMany([{
        title: 'Queeen',
        type_id: mongoose.Types.ObjectId(),
        owner_id: user._id,
        ownerRole: 'regularX',
        content: new Array(15).join('aw'),
        accessRight: 3,
      }, {
        title: 'Kings',
        type_id: mongoose.Types.ObjectId(),
        owner_id: user._id,
        ownerRole: 'regularX',
        content: new Array(15).join('af'),
        accessRight: 2,
      }, {
        title: 'Prince',
        type_id: mongoose.Types.ObjectId(),
        owner_id: mongoose.Types.ObjectId(),
        ownerRole: 'regularX',
        content: new Array(15).join('am'),
        accessRight: 3,
      }, {
        title: 'Princess',
        type_id: mongoose.Types.ObjectId(),
        owner_id: mongoose.Types.ObjectId(),
        ownerRole: 'adminX',
        content: new Array(15).join('am'),
        accessRight: 4,
      }]);

      const response = await request(server)
        .get('/api/v1/documents')
        .set('x-auth-token', token)
        .send();

      expect(response.status).toBe(200);
    });
    it('should return appropriate document if user is not admin', async () => {
      const response = await request(server)
        .get('/api/v1/documents')
        .set('x-auth-token', token2)
        .send();

      expect(response.status).toBe(200);
    });
    it('should return document if user is invalid', async () => {
      const response = await request(server)
        .get('/api/v1/documents')
        .set('x-auth-token', adminToken)
        .send();

      expect(response.status).toBe(400);
    });
  });
  describe('GET /:id', () => {
    it('should return all document if user is signed in', async () => {

      const paylaod = {
        title: 'qwertyuioer',
        type_id: mongoose.Types.ObjectId(),
        owner_id: user._id,
        ownerRole: 'regularX',
        content: new Array(15).join('a'),
        accessRight: 4,
      };

      const doc = new Document(paylaod);

      await doc.save();

      const response = await request(server)
        .get(`/api/v1/documents/${doc._id}`)
        .set('x-auth-token', token)
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
        accessRight: 2,
      };

      const doc = new Document(paylaod);

      await doc.save();


      const response = await request(server)
        .put(`/api/v1/documents/${doc._id}`)
        .set('x-auth-token', token)
        .send({
          title: 'Hello!!!',
          accessRight: 4
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id');
    });
  });
  describe('DELETE /:id', () => {
    it('should delete a doc if the user is an admin', async () => {
      const paylaod = {
        title: 'jhf44444fskh',
        type_id: mongoose.Types.ObjectId(),
        owner_id: user._id,
        ownerRole: 'regularX',
        content: new Array(15).join('at'),
        accessRight: 2,
      };

      const doc = new Document(paylaod);

      await doc.save();

      const response = await request(server)
        .delete(`/api/v1/documents/${doc._id}`)
        .set('x-auth-token', token)
        .send();

      expect(response.status).toBe(200);
    });
  });
});