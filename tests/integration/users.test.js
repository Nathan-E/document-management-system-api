import 'babel-polyfill';
import request from 'supertest';
import mongoose from 'mongoose';
import {
  User
} from '../../models/users';
import {
  Role
} from '../../models/roles';
import {
  adminToken,
  regularToken
} from './util';
import bcrypt from 'bcrypt';
import _ from 'lodash';
import app from '../../index';

let server

describe('/api/v1/users', () => {
  beforeAll(async () => {
    server = app;
    await Role.collection.insertMany([{
      title: 'admin1'
    }, {
      title: 'regular1'
    }, ]);
  });
  beforeEach(async () => {});
  afterEach(async () => {
    await User.deleteMany({});

  });

  afterAll(async () => {
    await Role.deleteMany({});
    await User.deleteMany({});
    server.close();
  });
  describe('POST /signup', () => {
    it('should create a new user if the input field are valid', async () => {
      const payload = {
        firstname: 'Chibueze',
        lastname: 'Nathan',
        role: 'regular1',
        username: 'nachi',
        email: 'chibueze6@test.com',
        password: '12345'
      }

      const response = await request(server)
        .post('/api/v1/users/signup')
        .send(payload);

      expect(response.status).toBe(200);
    });
  });
  describe('POST /login', () => {
    it('should login in signed up user', async () => {
      const salt = await bcrypt.genSalt(10);

      const password = '12345'
      const hashedPassword = await bcrypt.hash(password, salt);

      const payload = {
        firstname: 'Chibueze1',
        lastname: 'Nathan1',
        role: 'regular1',
        username: 'nachi1',
        email: 'chibueze1@test.com',
        password: hashedPassword
      }

      await User.collection.insertOne(payload);

      const token = await new User(payload).generateAuthToken();

      const credentials = {
        email: payload.email,
        password: password
      }

      const response = await request(server)
        .post('/api/v1/users/login')
        .send(credentials);

      expect(response.status).toBe(200);
      expect(response.header['x-auth-token']).not.toBe(null);
    });
  });
  describe('POST /logout', () => {
    it('should logout a user', async () => {
      const token = adminToken;

      const response = await request(server)
        .post('/api/v1/users/logout')
        .set('x-auth-token', token)
        .send();

      expect(response.status).toBe(200);
      expect(response.header['x-auth-token']).toBe(undefined);
    });
  });
  describe('GET /', () => {
    it('should return all the user if user is Admin', async () => {
      const salt = await bcrypt.genSalt(10);

      const password1 = '12345';
      const password2 = '12345';

      const hashedPassword1 = await bcrypt.hash(password1, salt);
      const hashedPassword2 = await bcrypt.hash(password2, salt);


      await User.collection.insertMany([{
        _id: 1,
        firstname: 'Chibueze3',
        lastname: 'Nathan3',
        role: 'regular1',
        username: 'nachi12',
        email: 'chibueze3@test.com',
        password: hashedPassword1
      }, {
        _id: 2,
        firstname: 'Chibueze4',
        lastname: 'Nathan4',
        role: 'regular1',
        username: 'nachi13',
        email: 'chibueze3@test.com',
        password: hashedPassword2
      }]);

      const response = await request(server)
        .get('/api/v1/users')
        .set('x-auth-token', adminToken)
        .send();

      expect(response.status).toBe(200);
    });
  });
  describe('GET /:id', () => {
    it('should return a user if user the user exist', async () => {
      const salt = await bcrypt.genSalt(10);
      const password1 = '12345';
      const hashedPassword1 = await bcrypt.hash(password1, salt);


      const payload = {
        _id: 1,
        firstname: 'Chibueze4',
        lastname: 'Nathan4',
        role: 'regular1',
        username: 'nachi123',
        email: 'chibueze34@test.com',
        password: hashedPassword1
      };

      const user = await new User(payload);

      const response = await request(server)
        .get(`/api/v1/users/${user._id}`)
        .send();

      expect(response.status).toBe(200);
    });
  });
});