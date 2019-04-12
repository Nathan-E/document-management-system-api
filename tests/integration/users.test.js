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
} from './util'
import app from '../../index';

let server

describe('/api/v1/users', () => {
  beforeAll(() => {
    server = app;
  });
  beforeEach(() => {

  });
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
  describe('POST /', () => {
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
        .post('/api/v1/users')
        .send(payload);

      await Role.remove({});

      expect(response.status).toBe(200);
    });
  });
});