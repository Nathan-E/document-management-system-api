import 'babel-polyfill';
import request from 'supertest';
import mongoose from 'mongoose';
import {
  Role
} from '../../models/roles';
import app from '../../index';
import {
  expression
} from '@babel/template';
import {
  exportAllDeclaration
} from '@babel/types';

let server;

describe('/api/v1/roles', () => {
  beforeAll(() => {
    server = app;
  });
  beforeEach(() => {

  });
  afterEach(() => {

  });
  afterAll(async () => {
    await Role.deleteMany();
    server.close();
  });
  describe('GET /', () => {
    it('should return all the roles', async () => {
      const roles = [{
        title: 'admin'
      }, {
        title: 'regular'
      }];

      await Role.collection.insertMany(roles);

      const response = await request(server).get('/api/v1/roles');

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body.some(g => g.title === 'admin')).toBeTruthy();
      expect(response.body.some(g => g.title === 'regular')).toBeTruthy();
    });
  });
  describe('POST /', () => {
    it('should create a new role if it is unique', async () => {
      const role = {
        title: 'veteran'
      };

      const response = await request(server).post('/api/v1/roles').send(role);

      const newRole = await Role.find({
        title: 'veteran'
      });

      expect(newRole).not.toBeNull();
      expect(response.status).toBe(200);
    });
  });
  describe('PUT /:id', () => {
    it('should update an existing role', async () => {
      const role = new Role({
        title: 'amateur'
      });

      await role.save();

      const id = role._id;
      const newTitle = 'superAdmin';

      const response = await request(server).put(`/api/v1/roles/${id}`).send({
        title: newTitle
      });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('title', newTitle);
    });
  });
});