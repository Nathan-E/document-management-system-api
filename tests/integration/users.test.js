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
  beforeAll(() => {
    server = app;
  });
  beforeEach(async () => {});
  afterEach(async () => {
    await Role.deleteMany();
    await User.deleteMany();

  });
  afterAll(async () => {
    await Role.deleteMany();
    await User.deleteMany();
    db.Role.drop()
    server.close();
  });
  describe('POST /signup', () => {
    it('should create a new user if the input field are valid', async () => {
      const role = new Role({
        title: 'regular2'
      });

      await role.save();

      const payload = {
        firstname: 'Chibueze',
        lastname: 'Nathan',
        role_id: role._id,
        username: 'nachi',
        email: 'chibueze@test.com',
        password: '12345'
      }

      const response = await request(server)
        .post('/api/v1/users/signup')
        .send(payload);

      await Role.remove({});

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
        role: {
          _id: mongoose.Types.ObjectId(),
          title: 'dearest'
        },
        username: 'nachi1',
        email: 'chibueze1@test.com',
        password: hashedPassword
      }

      await User.collection.bulkWrite([{
        insertOne: payload
      }])

      const token = await new User(payload).generateAuthToken();

      const credentials = {
        email: payload.email,
        password: password
      }
      const response = await request(server)
        .post('/api/v1/users/login')
        .send(credentials);

      expect(response.status).toBe(200);
      expect(response.header['x-auth-token']).toBe(token);
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
});