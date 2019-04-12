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
import request from 'supertest';
import mongoose from 'mongoose';
import {
  adminToken,
  regularToken
} from './util';
import app from '../../index';

let server

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
  });
  beforeEach(async () => {});
  afterEach(async () => {
  });

  afterAll(async () => {
    await Role.deleteMany({});
    await User.deleteMany({});
    await Document.deleteMany({});
    server.close();
  });
});