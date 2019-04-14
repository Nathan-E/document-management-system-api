import 'babel-polyfill';
import request from 'supertest';
import mongoose from 'mongoose';
import {
  Role
} from '../../models/roles';
import {
  adminToken,
  regularToken
} from './util';
import app from '../../index';

let server;

describe('/api/v1/roles', () => {
  beforeAll(async () => {
    server = app;
  });
  beforeEach(async () => {
    await Role.collection.insertMany([{
      title: 'admin'
    }, {
      title: 'regular'
    }]);
  });
  afterEach(async () => {
    await Role.deleteMany({});
  });
  afterAll(async () => {
    await Role.deleteMany({});
    server.close();
  });
  describe('GET /', () => {
    it('should return all the roles if user is Admin', async () => {
      const response = await request(server)
        .get('/api/v1/roles')
        .set('x-auth-token', adminToken)
        .send();

      expect(response.status).toBe(200);
      expect(response.body.some(g => g.title === 'admin')).toBeTruthy();
      expect(response.body.some(g => g.title === 'regular')).toBeTruthy();
    });
    it('should return 403 if user is not an Admin', async () => {
      const response = await request(server)
        .get('/api/v1/roles')
        .set('x-auth-token', regularToken)
        .send();

      expect(response.status).toBe(403);
    });
    it('should 401 if user is not logged in', async () => {
      const response = await request(server)
        .get('/api/v1/roles')
        .send();

      expect(response.status).toBe(401);
    });
    it('should 400 if token is invalid', async () => {
      const response = await request(server)
        .get('/api/v1/roles')
        .set('x-auth-token', 'qdehpdH')
        .send();

      expect(response.status).toBe(400);
    });
  });
  describe('POST /', () => {
    it('should create a new role if the user is an Admin', async () => {
      const role = {
        title: 'veteran'
      };

      const response = await request(server)
        .post('/api/v1/roles')
        .set('x-auth-token', adminToken)
        .send(role);

      const newRole = await Role.find({
        title: 'veteran'
      });

      expect(newRole).not.toBeNull();
      expect(response.status).toBe(200);
    });
    it('should not create a new role the user is not an Admin', async () => {
      const role = {
        title: 'veteran1'
      };

      const response = await request(server)
        .post('/api/v1/roles')
        .set('x-auth-token', regularToken)
        .send(role);

      expect(response.status).toBe(403);
    });
    it('should not create a new role if the Admin is not logged in', async () => {
      const role = {
        title: 'veteran2'
      };

      const response = await request(server)
        .post('/api/v1/roles')
        .send(role);

      expect(response.status).toBe(401);
    });
    it('should not create a new role the token is invalid', async () => {
      const role = {
        title: 'veteran3'
      };

      const response = await request(server)
        .post('/api/v1/roles')
        .set('x-auth-token', 'regularToken')
        .send(role);

      expect(response.status).toBe(400);
    });
    it('should return 400 if role already exist', async () => {
      const roles = {
        title: 'admin'
      }

      const response = await request(server)
        .post('/api/v1/roles')
        .set('x-auth-token', adminToken)
        .send(roles);

      expect(response.status).toBe(400);
    });
    it('should return 400 if the payload property, title is less than 4 characters', async () => {
      const role = {
        title: 'adm'
      }

      const response = await request(server)
        .post('/api/v1/roles')
        .set('x-auth-token', adminToken)
        .send(role);

      expect(response.status).toBe(400);
    });
    it('should return 400 if the payload property, title is more than 10 characters', async () => {
      const role = {
        title: new Array(12).join('a')
      }

      const response = await request(server)
        .post('/api/v1/roles')
        .set('x-auth-token', adminToken)
        .send(role);

      expect(response.status).toBe(400);
    });
  });
  describe('PUT /:id', () => {
    it('should update an existing role if the user is an Admin', async () => {
      const role = new Role({
        title: 'amateurs'
      });

      await role.save();

      const id = role._id;
      const newTitle = 'sup-admin';

      const response = await request(server)
        .put(`/api/v1/roles/${id}`)
        .set('x-auth-token', adminToken)
        .send({
          title: newTitle
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('title', newTitle);
    });
    it('should return 400 if an invalid id is passed', async () => {
      const id = 1;

      const response = await request(server)
        .put(`/api/v1/roles/${id}`)
        .set('x-auth-token', adminToken)
        .send({
          title: 'superAdmin'
        });

      expect(response.status).toBe(400);
    });
    it('should not update an existing role if the user is not an Admin', async () => {
      const role = new Role({
        title: 'amateu1'
      });

      await role.save();

      const id = role._id;
      const newTitle = 'superAdmi1';

      const response = await request(server)
        .put(`/api/v1/roles/${id}`)
        .set('x-auth-token', regularToken)
        .send({
          title: newTitle
        });

      expect(response.status).toBe(403);
    });
    it('should not update an existing role if the user is not logged in', async () => {
      const role = new Role({
        title: 'amateu12'
      });

      await role.save();

      const id = role._id;
      const newTitle = 'superAdmi1';

      const response = await request(server)
        .put(`/api/v1/roles/${id}`)
        .send({
          title: newTitle
        });

      expect(response.status).toBe(401);
    });
    it('should not update an existing role if the token is invalid', async () => {
      const role = new Role({
        title: 'amateu3'
      });

      await role.save();

      const id = role._id;
      const newTitle = 'superAdmi1';

      const response = await request(server)
        .put(`/api/v1/roles/${id}`)
        .set('x-auth-token', 'ajhfhdfsah')
        .send({
          title: newTitle
        });

      expect(response.status).toBe(400);
    });
    it('should return 400 if the payload, title is less than 4 characterss', async () => {
      const role = new Role({
        title: 'cleaner'
      });

      await role.save();

      const id = role._id;
      const newTitle = 'sup';

      const response = await request(server)
        .put(`/api/v1/roles/${id}`)
        .set('x-auth-token', adminToken)
        .send({
          title: newTitle
        });

      expect(response.status).toBe(400);
    });
    it('should return 400 if the payload, title is less than 4 characterss', async () => {
      const role = new Role({
        title: 'cleane'
      });

      await role.save();

      const id = role._id;
      const newTitle = 'superadmins';

      const response = await request(server)
        .put(`/api/v1/roles/${id}`)
        .set('x-auth-token', adminToken)
        .send({
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

      const response = await request(server)
        .put(`/api/v1/roles/${id}`)
        .set('x-auth-token', adminToken)
        .send({
          title: newRole
        });
      expect(response.status).toBe(400);
    });
    it('should return 404 if the passed id is not found', async () => {
      const id = mongoose.Types.ObjectId();
      const newTitle = 'superAdm';

      const response = await request(server)
        .put(`/api/v1/roles/${id}`)
        .set('x-auth-token', adminToken)
        .send({
          title: newTitle
        });

      expect(response.status).toBe(404);
    });
  });
  describe('GET /:id', () => {
    it('should return an existing role', async () => {
      const role = new Role({
        title: 'amate'
      });

      await role.save();

      const id = role._id;

      const response = await request(server).get(`/api/v1/roles/${id}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('title', role.title);
    });
    it('should return 400 if an invalid id is passed', async () => {
      const id = 1;

      const response = await request(server).get(`/api/v1/roles/${id}`);

      expect(response.status).toBe(400);
    });
    it('should return 404 if no role with the Id is found', async () => {
      const id = mongoose.Types.ObjectId();

      const response = await request(server).get(`/api/v1/roles/${id}`);

      expect(response.status).toBe(404);
    });
  });
});