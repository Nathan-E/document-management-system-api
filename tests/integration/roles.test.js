import 'babel-polyfill';
import request from 'supertest';
import mongoose from 'mongoose';
import { Role } from '../../models/roles';
import app from '../../index';
import { expression } from '@babel/template';
import { exportAllDeclaration } from '@babel/types';

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
    await Role.remove();
    server.close();
  });
  describe('GET /', () => {
    it('should return all the roles', async () => {
      const roles = [{
        title: 'admin'
      },{
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
});