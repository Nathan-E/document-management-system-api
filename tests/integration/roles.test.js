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
      await Role.collection.bulkWrite([{
        insertOne: {
          title: 'admin'
        }
      }, {
        insertOne: {
          title: 'regular'
        },
      }]);

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
    it('should return 400 if role already exist', async () => {
      const roles = [{
        title: 'admin'
      }, {
        title: 'admin'
      }];

      const response = await request(server).post('/api/v1/roles').send(roles);
      expect(response.status).toBe(400);
    });
    it('should return 400 if the payload property, title is less than 4 characters', async () => {
      const role = {
        title: 'adm'
      }

      const response = await request(server).post('/api/v1/roles').send(role);
      expect(response.status).toBe(400);
    });
  });
  describe('PUT /:id', () => {
    it('should update an existing role', async () => {
      const role = new Role({
        title: 'amateurs'
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
    it('should return 404 if an invalid id is passed', async () => {
      const id = 1;
      const newTitle = 'superAdmin';

      const response = await request(server).put(`/api/v1/roles/${id}`).send({
        title: newTitle
      });

      expect(response.status).toBe(404);
    });
    it('should return 400 if the payload, title is less than 4 characterss', async () => {
      const role = new Role({
        title: 'cleaner'
      });

      await role.save();

      const id = role._id;
      const newTitle = 'sup';

      const response = await request(server).put(`/api/v1/roles/${id}`).send({
        title: newTitle
      });

      expect(response.status).toBe(400);
    });
    it('should return 400 if the payload, title is less than 4 characterss', async () => {
      const role = new Role({
        title: 'cleaners'
      });

      await role.save();

      const id = role._id;
      const newTitle = 'superadmins';

      const response = await request(server).put(`/api/v1/roles/${id}`).send({
        title: newTitle
      });

      expect(response.status).toBe(400);
    });
    it('should return 400 if role already exist', async () => {
      await Role.collection.bulkWrite([{
        insertOne: {
          title: 'admins'
        }
      }, {
        insertOne: {
          title: 'regulars'
        }
      }]);

      const roleTwo = new Role({
        title: 'clean'
      });

      await roleTwo.save();

      const id = roleTwo._id;
      const newRole = 'admins';

      const response = await request(server).put(`/api/v1/roles/${id}`).send({
        title: newRole
      });
      expect(response.status).toBe(400);
    });
    it('should return 404 if the passed id is not found', async () => {
      const id = mongoose.Types.ObjectId();
      const newTitle = 'superAdmin';

      const response = await request(server).put(`/api/v1/roles/${id}`).send({
        title: newTitle
      });

      expect(response.status).toBe(400);
    });
  });
  describe('GET /:id', () => {
    it('should return an existing role', async () => {
      const role = new Role({
        title: 'amateu'
      });

      await role.save();

      const id = role._id;

      const response = await request(server).get(`/api/v1/roles/${id}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('title', role.title);
    });
  });
});
